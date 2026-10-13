#!/usr/bin/env python3
"""Build the ABDM Connect Postman collection and environment.

Walks the "ABDM Connect" group in docs.json in sidebar order. A page with an
`openapi:` frontmatter line becomes a request built from its OpenAPI spec; a
webhook page (a "### Request" section with a JSON body) becomes a callback
request posted to {{webhook_url}}, so you can replay it against your receiver.

Run from the repo root after changing any ABDM Connect spec or page:

    python3 scripts/build_abdm_postman.py
"""

import json
import re
import uuid
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "api-reference/user-app/abdm-connect/postman"
COLLECTION_FILE = OUT_DIR / "eka-abdm-connect.postman_collection.json"
ENVIRONMENT_FILE = OUT_DIR / "eka-abdm-connect-sandbox.postman_environment.json"
SPECS = [
    ROOT / "api-reference/user-app/abdm-connect/registration.yml",
    ROOT / "api-reference/authorization/authorization.yml",
]
DOCS_BASE = "https://developer.eka.care/"
NAMESPACE = uuid.UUID("6b5ce0a0-abd0-4c0e-8a11-ec0000000000")
INCLUDED = set()

# Request fields filled from variables an earlier step saved.
FIELD_VARS = {
    "txn_id": "txn_id",
    "txnId": "txn_id",
    "request_id": "request_id",
    "order_id": "order_id",
    "provider_id": "provider_id",
    "hip_id": "hip_id",
    "abha_address": "abha_address",
    "user_x_token": "x_token",
    "oid": "oid",
}
HEADER_VARS = {
    "X-Pt-Id": "oid",
    "X-Partner-Pt-Id": "partner_patient_id",
    "X-Hip-Id": "hip_id",
}

# Every response passes through this: it keeps the identifiers the next steps need.
CAPTURE_SCRIPT = """// Keep the identifiers later requests in the flow depend on.
let body;
try { body = pm.response.json(); } catch (e) { return; }
if (!body || typeof body !== "object") return;
const keep = {
  txn_id: "txn_id",
  request_id: "request_id",
  order_id: "order_id",
  provider_id: "provider_id",
  token: "x_token",
  access_token: "access_token",
  refresh_token: "refresh_token"
};
Object.keys(keep).forEach(function (field) {
  const value = body[field];
  if (typeof value === "string" && value.length) {
    pm.collectionVariables.set(keep[field], value);
  }
});"""

ENVIRONMENT = [
    ("base_url", "https://api.dev.eka.care", "default"),
    ("client_id", "", "default"),
    ("client_secret", "", "secret"),
    ("access_token", "", "secret"),
    ("refresh_token", "", "secret"),
    ("oid", "", "default"),
    ("partner_patient_id", "", "default"),
    ("hip_id", "", "default"),
    ("abha_address", "", "default"),
    ("webhook_url", "https://your-server.example.com/eka/webhooks", "default"),
    ("webhook_signature", "", "secret"),
]


def stable_id(*parts):
    return str(uuid.uuid5(NAMESPACE, "/".join(parts)))


def load_specs():
    ops = {}
    for spec_path in SPECS:
        spec = yaml.safe_load(spec_path.read_text())
        for path, methods in spec["paths"].items():
            for method, op in methods.items():
                if method in ("get", "post", "put", "patch", "delete"):
                    ops[(method, path)] = (op, spec)
    return ops


def humanise(page):
    """A request name from the page's file name, for pages with no title."""
    words = page.rsplit("/", 1)[-1].replace("_", "-").split("-")
    return " ".join(w.upper() if w in ("otp", "hpr", "hfr", "abha") else w.capitalize() for w in words)


def frontmatter(text):
    match = re.match(r"---\n(.*?)\n---", text, re.S)
    return yaml.safe_load(match.group(1)) if match else {}


def resolve(schema, spec, seen=()):
    while isinstance(schema, dict) and "$ref" in schema:
        name = schema["$ref"].split("/")[-1]
        if name in seen:
            return {}
        seen = seen + (name,)
        schema = spec["components"]["schemas"][name]
    return schema


def sample(schema, spec, field=None, depth=0, seen=()):
    """An example value for a schema, preferring variables, then examples."""
    if field in FIELD_VARS:
        return "{{%s}}" % FIELD_VARS[field]
    if isinstance(schema, dict) and "$ref" in schema:
        name = schema["$ref"].split("/")[-1]
        if name in seen or depth > 6:
            return {}
        seen = seen + (name,)
    schema = resolve(schema, spec)
    if not isinstance(schema, dict):
        return None
    if "example" in schema:
        return schema["example"]
    if schema.get("examples"):
        return schema["examples"][0]
    if "enum" in schema:
        return schema["enum"][0]
    for key in ("allOf", "oneOf", "anyOf"):
        if schema.get(key):
            merged = {}
            for part in schema[key]:
                value = sample(part, spec, field, depth + 1, seen)
                if isinstance(value, dict):
                    merged.update(value)
                elif key != "allOf":
                    return value
            return merged
    kind = schema.get("type")
    if isinstance(kind, list):
        kind = next((t for t in kind if t != "null"), None)
    if kind == "object" or "properties" in schema:
        return {
            name: sample(prop, spec, name, depth + 1, seen)
            for name, prop in schema.get("properties", {}).items()
        }
    if kind == "array":
        return [sample(schema.get("items", {}), spec, None, depth + 1, seen)]
    if kind == "integer":
        return 0
    if kind == "number":
        return 0.0
    if kind == "boolean":
        return False
    if schema.get("format") == "date-time":
        return "2026-01-01T00:00:00.000Z"
    return "<%s>" % field if field else ""


def param_value(param):
    name = param["name"]
    if param["in"] == "header" and name in HEADER_VARS:
        return "{{%s}}" % HEADER_VARS[name]
    if name in FIELD_VARS:
        return "{{%s}}" % FIELD_VARS[name]
    example = param.get("example", param.get("schema", {}).get("example"))
    return str(example) if example is not None else "<%s>" % name


def api_request(page, meta, ops):
    method, path = meta["openapi"].split(None, 1)
    method = method.lower()
    if (method, path) not in ops:
        print("Skipped %s: %s %s is in no spec" % (page, method.upper(), path))
        return None
    op, spec = ops[(method, path)]
    INCLUDED.add((method, path))
    params = op.get("parameters", [])

    segments = []
    for segment in path.strip("/").split("/"):
        name = re.fullmatch(r"\{(.+)\}", segment)
        segments.append(":" + name.group(1) if name else segment)
    path_vars = [
        {"key": p["name"], "value": param_value(p), "description": p.get("description", "")}
        for p in params if p["in"] == "path"
    ]
    query = [
        {
            "key": p["name"],
            "value": param_value(p),
            "description": p.get("description", ""),
            "disabled": not p.get("required", False) and p["name"] not in FIELD_VARS,
        }
        for p in params if p["in"] == "query"
    ]
    raw = "{{base_url}}/" + "/".join(segments)
    if query:
        raw += "?" + "&".join("%s=%s" % (q["key"], q["value"]) for q in query if not q["disabled"])

    headers = [
        {"key": p["name"], "value": param_value(p), "description": p.get("description", "")}
        for p in params if p["in"] == "header" and p["name"] not in ("Authorization", "auth")
    ]
    request = {
        "method": method.upper(),
        "header": headers,
        "url": {
            "raw": raw,
            "host": ["{{base_url}}"],
            "path": segments,
            "query": query,
            "variable": path_vars,
        },
        "description": "%s\n\nDocs: %s%s" % (
            op.get("description") or op.get("summary") or "", DOCS_BASE, page),
    }
    body = op.get("requestBody", {}).get("content", {}).get("application/json", {})
    if body.get("schema"):
        example = body.get("example") or sample(body["schema"], spec)
        headers.append({"key": "Content-Type", "value": "application/json"})
        request["body"] = {
            "mode": "raw",
            "raw": json.dumps(example, indent=2, default=str),
            "options": {"raw": {"language": "json"}},
        }
    if path.startswith("/connect-auth/"):
        request["auth"] = {"type": "noauth"}
        if path.endswith("/login"):
            request["body"]["raw"] = json.dumps(
                {"client_id": "{{client_id}}", "client_secret": "{{client_secret}}"}, indent=2)
        elif path.endswith("/refresh-token"):
            request["body"]["raw"] = json.dumps(
                {"access_token": "{{access_token}}", "refresh_token": "{{refresh_token}}"}, indent=2)
            for header in headers:
                if header["key"] == "Client-Id":
                    header["value"] = "{{client_id}}"
            headers.insert(0, {"key": "Authorization", "value": "Bearer {{access_token}}"})
    return {
        "id": stable_id(page),
        "name": meta.get("title") or op.get("summary") or humanise(page),
        "request": request,
    }


def callback_request(page, meta, text):
    body = re.search(r"\*\*Body:?\*\*.*?```json\n(.*?)```", text, re.S) \
        or re.search(r"### Request.*?```json\n(.*?)```", text, re.S)
    if not body:
        return None
    raw = body.group(1).strip()
    try:
        raw = json.dumps(json.loads(raw), indent=2)
    except ValueError:
        pass  # Keep the page's JSON as written, comments included.
    return {
        "id": stable_id(page),
        "name": meta.get("title") or humanise(page),
        "request": {
            "method": "POST",
            "auth": {"type": "noauth"},
            "header": [
                {"key": "Eka-Webhook-Signature", "value": "{{webhook_signature}}"},
                {"key": "Content-Type", "value": "application/json"},
            ],
            "url": {"raw": "{{webhook_url}}", "host": ["{{webhook_url}}"]},
            "body": {"mode": "raw", "raw": raw, "options": {"raw": {"language": "json"}}},
            "description": "Callback Eka sends to your webhook URL. Send it to your own "
                           "receiver to test how you handle it.\n\nDocs: %s%s" % (DOCS_BASE, page),
        },
    }


def build_items(pages, ops, seen):
    items = []
    for page in pages:
        if isinstance(page, dict):
            if page.get("hidden"):
                continue
            children = build_items(page.get("pages", []), ops, seen)
            if children:
                items.append({"id": stable_id("group", page["group"], *[c["id"] for c in children[:1]]),
                              "name": page["group"], "item": children})
            continue
        source = ROOT / (page + ".mdx")
        if page in seen or not source.exists():
            continue
        text = source.read_text()
        meta = frontmatter(text)
        if meta.get("openapi") and not str(meta["openapi"]).startswith("3."):
            item = api_request(page, meta, ops)
            if item:
                seen.add(page)
                items.append(item)
        elif "/webhooks/" in page:
            item = callback_request(page, meta, text)
            if item:
                seen.add(page)
                items.append(item)
    return items


def rename_callback_folders(items):
    for item in items:
        if "item" in item:
            if item["name"] == "Webhooks":
                item["name"] = "Callbacks (Webhooks)"
            rename_callback_folders(item["item"])


def count(items):
    return sum(count(i["item"]) if "item" in i else 1 for i in items)


def find_group(node, name):
    if isinstance(node, dict):
        if node.get("group") == name:
            return node
        node = list(node.values())
    if isinstance(node, list):
        for child in node:
            found = find_group(child, name)
            if found:
                return found
    return None


def main():
    docs = json.loads((ROOT / "docs.json").read_text())
    ops = load_specs()
    group = find_group(docs["navigation"], "ABDM Connect")

    auth = build_items([
        "api-reference/authorization/client-login",
        "api-reference/authorization/refresh-token-v2",
    ], ops, set())
    items = [{"id": stable_id("group", "Authentication"), "name": "Authentication", "item": auth}]
    items += build_items(group["pages"], ops, set())
    rename_callback_folders(items)
    total = count(items)

    collection = {
        "info": {
            "_postman_id": stable_id("collection"),
            "name": "Eka ABDM Connect",
            "description": (
                "Every ABDM Connect API and callback, in the order of the docs sidebar "
                "(%d requests).\n\n"
                "1. Import the sandbox environment and fill in client_id and client_secret.\n"
                "2. Run Authentication > Connect Login. It saves access_token for every other request.\n"
                "3. Work through a milestone top to bottom. Each response's txn_id, request_id, "
                "order_id, provider_id and X-token (token) are saved for the steps after it.\n\n"
                "Callback requests post the payload Eka sends to {{webhook_url}}, so you can "
                "test your own receiver.\n\nDocs: %sapi-reference/user-app/abdm-connect/overview"
            ) % (total, DOCS_BASE),
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        "auth": {"type": "bearer", "bearer": [{"key": "token", "value": "{{access_token}}", "type": "string"}]},
        "event": [{"listen": "test", "script": {"type": "text/javascript", "exec": CAPTURE_SCRIPT.split("\n")}}],
        "variable": [
            {"key": "txn_id", "value": ""},
            {"key": "request_id", "value": ""},
            {"key": "order_id", "value": ""},
            {"key": "provider_id", "value": ""},
            {"key": "x_token", "value": ""},
        ],
        "item": items,
    }
    environment = {
        "id": stable_id("environment"),
        "name": "Eka ABDM Connect - Sandbox",
        "values": [{"key": k, "value": v, "type": t, "enabled": True} for k, v, t in ENVIRONMENT],
        "_postman_variable_scope": "environment",
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    COLLECTION_FILE.write_text(json.dumps(collection, indent=2, ensure_ascii=False) + "\n")
    ENVIRONMENT_FILE.write_text(json.dumps(environment, indent=2) + "\n")
    print("%d requests -> %s" % (total, COLLECTION_FILE.relative_to(ROOT)))

    missing = sorted(k for k in ops if k[1].startswith("/abdm") and k not in INCLUDED)
    if missing:
        print("Spec operations not in the ABDM Connect sidebar (left out):")
        for method, path in missing:
            print("  %s %s" % (method.upper(), path))


if __name__ == "__main__":
    main()

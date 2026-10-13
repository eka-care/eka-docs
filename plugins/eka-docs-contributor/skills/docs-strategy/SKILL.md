---
name: docs-strategy
description: The binding structure of product documentation on developer.eka.care, the product ladder. Ten page types every product carries in a fixed order, three extra types that are allowed, the frontmatter each needs, the product.yaml manifest, and the rules docs-check enforces. Use whenever deciding where a page goes, what a product is missing, what type a page is, why docs-check failed, or before scaffolding anything.
---

# Docs Strategy: the product ladder

## Why

A product's docs used to be a pile of endpoint pages. A reader could not tell what the product was for, who used it, or which calls made up a real workflow. The ladder fixes the shape so every product answers the same questions in the same order, and so a Claude Code plugin can be scaffolded from the pages.

## The ladder

One top-level folder per product (`ekascribe/` is the model). In reading order:

| Rung | `type` | Answers | Count |
|---|---|---|---|
| 1 | `overview` | What is this, who is it for, what can I build, key concepts | 1 |
| 2 | `journey` | A real person's end-to-end story through the product, in product terms | 1+ |
| 3 | `quickstart` | First successful call in under ten minutes | 1 |
| 4 | `workflow` | One journey step as an ordered sequence of API calls | 1+ per journey |
| 5 | `reference` | One page per operation, generated from OpenAPI (implicit: any page with `openapi:` frontmatter) | 1 per operation |
| 6 | `webhooks` | Every event the product emits, payload, when it fires, which workflow consumes it | 1 |
| 7 | `errors` | Every error code, its meaning, what the integrator should do | 1 |
| 8 | `testing` | Sandbox, credentials, test data, the happy paths to run before go-live | 1 |
| 9 | `build-with-ai` | How to install the product's plugin and MCP, what each skill does | 1 |
| 10 | `changelog` | Dated entries, newest first | 1 |

Allowed but never required: `sdk` (a client library page), `resource` (FHIR structure, ngrok, IP allowlisting), `guide` (explanatory and none of the above).

Authentication is shared and lives once under `api-reference/authorization/`. Quickstarts link to it; they do not repeat it.

Rungs 1, 2 and 4 are the functional knowledge that is usually missing. Rung 5 is what usually exists. Rungs 1, 2, 4 and 7 are mandatory before a product counts as documented.

## Folder layout

```
<product>/
  product.yaml
  overview.mdx                 type: overview
  quickstart.mdx               type: quickstart
  journeys/<slug>.mdx          type: journey
  workflows/<slug>.mdx         type: workflow
  api-reference/openapi.yaml
  api-reference/<tag>/<operation>.mdx   openapi: "..."
  webhooks.mdx                 type: webhooks
  errors.mdx                   type: errors
  testing.mdx                  type: testing
  build-with-ai.mdx            type: build-with-ai
  changelog.mdx                type: changelog
  sdks/*.mdx                   type: sdk
  resources/*.mdx              type: resource
```

A product that has not moved yet (ABDM Connect lives under `api-reference/user-app/abdm-connect/`) uses the `root` key in its manifest. Do not move a product's folder as a side effect of another task; it is its own project with redirects.

## Frontmatter

Every page: `title`, `description` (Mintlify needs both), and `type` (unless it has `openapi:`). Mintlify ignores unknown keys, so the machine fields cost nothing.

Quickstart pages add `workflow` (the slug of the one workflow the quickstart walks through; see `writing-quickstart`). Workflow pages add `product`, `journey` (the journey page's file slug), `operations` (list of `METHOD /path`, must exist in the spec), `webhooks` (event names, must exist in the spec's `webhooks`). Full shape in `writing-workflows`.

## The manifest

`<product>/product.yaml`:

```yaml
slug: abdm-connect
name: ABDM Connect
owner: abdm-team
audiences: [HIS vendors, labs, insurers, PHR apps]
root: api-reference/user-app/abdm-connect   # only if the folder is not the manifest's own
openapi:
  - registration.yml                         # relative to root; several allowed
plugin: abdm-connect                         # the product plugin's name, once it exists
enforce: false                               # true once the product passes the check
```

It is the registry: which products exist, where the spec is, whether the check blocks. Nothing else is derived from it.

## The check

`npm run docs:check [slug] [--fix]`, source `scripts/docs-check.mjs`, runs on every pull request. Exit code 1 only when a product with `enforce: true` fails.

Fail

- Operations exist but no `journey` page, or no `workflow` page
- A workflow `operations` entry the spec does not define, or a `journey` that does not exist
- A page with no `type`, or a type outside the thirteen
- A reference page whose operation is not in the spec
- No `overview` or `errors` page
- `<ParamField>` or `<ResponseField>` on a reference page (a hand-written schema)

Warn

- An operation no workflow names; a journey no workflow points at
- An error code on the errors page absent from every response example
- No `testing` or `build-with-ai` page
- A bare `openapi: METHOD /path` that matches more than one spec in the repo
- A stale or missing "Used in" block
- A quickstart that demonstrates no workflow: no `workflow:` frontmatter naming a workflow page, and no call to any workflow's operation in its body

`--fix` writes the "Used in" block on every reference page (between `{/* used-in:start */}` and `{/* used-in:end */}`, never edited by hand), rewrites bare `openapi:` to the file-prefixed form, and creates a bare page for every operation that has none.

## Placing a thing

| Proposal | Where |
|---|---|
| A new endpoint | The spec first, then `/api-sync` creates its page |
| A sequence of calls that achieves something | A workflow page |
| Who uses this and why | The overview (short) or a journey (long) |
| A gotcha about one endpoint | Notes under that reference page's frontmatter |
| An error code | The spec's response example and the errors page |
| A client library | `sdks/`, type `sdk` |
| Something for the agent only | The product plugin, pointing at the page that holds the fact |

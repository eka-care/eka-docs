---
name: mintlify-nav
description: How developer.eka.care's docs.json navigation works and how a product's ladder maps onto it, plus icons, redirects, the contextual menu and what Mintlify renders or ignores. Use when adding a product group, reordering pages, moving a page and keeping its old URL alive, changing the AI contextual menu, or when a page exists but does not appear in the sidebar.
---

# Mintlify navigation

`docs.json` at the repo root is the whole navigation. A page not listed there still renders at its URL (hidden page) but has no sidebar entry.

## Shape

```
navigation.anchors[]      "Documentation", "API Reference", ... (left rail)
  .tabs[]                 top tabs inside an anchor
    .groups[]             sidebar sections
      .pages[]            page paths without extension, or nested { group, pages, icon }
```

Paths are repo-relative with no leading slash and no `.mdx`: `ekascribe/overview`.

## A product's group

One group per product, in ladder order. Journeys and workflows are nested groups so the sidebar reads like the ladder:

```json
{
  "group": "ABDM Connect",
  "icon": "id-card",
  "pages": [
    "abdm-connect/overview",
    { "group": "Journeys", "icon": "route", "pages": ["abdm-connect/journeys/register-walk-in-patient"] },
    "abdm-connect/quickstart",
    { "group": "Workflows", "icon": "diagram-project", "pages": ["abdm-connect/workflows/create-abha-aadhaar-otp"] },
    { "group": "API Reference", "icon": "code", "openapi": "abdm-connect/api-reference/openapi.yaml",
      "pages": [ { "group": "Registration", "pages": ["abdm-connect/api-reference/registration/aadhaar-init"] } ] },
    "abdm-connect/webhooks",
    "abdm-connect/errors",
    "abdm-connect/testing",
    "abdm-connect/build-with-ai",
    "abdm-connect/changelog"
  ]
}
```

`/product-new` writes this skeleton. The reference sub-groups mirror the spec's tags.

## Icons

`icons.library` is `fontawesome`. Use a Font Awesome name that says what the page is about: `route` for journeys, `diagram-project` for workflows, `code` for reference, `bell` for webhooks, `triangle-exclamation` for errors, `flask` for testing, `robot` for build with AI, `clock-rotate-left` for changelog. One icon per concept across products, so the sidebar stays consistent.

## Redirects

Moving a page means a redirect, in the same pull request, in the top-level `redirects` array:

```json
{ "source": "/api-reference/user-app/abdm-connect/overview", "destination": "/abdm-connect/overview", "permanent": true }
```

A `:slug*` wildcard covers a folder. The existing array has examples for EkaScribe's move.

## The contextual menu

`contextual.options` renders a dropdown beside the page title. Current: `copy`, `view`, `chatgpt`, `claude`. Other built-ins: `assistant`, `mcp`, `add-mcp`, `cursor`, `vscode`, `download-spec`. A custom option is `{ title, description, icon, href }` where `href` may be `{ base, query: [{ key, value }] }` with `$path`, `$page`, `$mcp` placeholders. It is a dropdown, not an inline row; an inline row would need a React snippet imported on every page.

## What Mintlify does and does not do

- Renders every `.mdx` in the repo, listed or not. Does not serve `.md` (the root `README.md` is a 404 on the live site). Keep non-page files `.md`.
- Ignores unknown frontmatter keys, which is why `type`, `operations`, `journey` are safe.
- Uploads every `.yaml` and `.json` as a spec candidate. See `api-referencing` for why that matters.
- Supports `<Steps>`, `<Card>`, `<CardGroup>`, `<Note>`, `<Warning>`, `<Tabs>`, `<Accordion>`, mermaid code fences. Prefer `<Steps>` for workflows and plain tables for errors.
- A broken MDX expression (`{` or `<` outside a component) in any `.mdx` fails the whole deploy. The pull request preview shows the error.

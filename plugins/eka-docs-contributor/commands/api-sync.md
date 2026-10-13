---
description: Sync a product's reference pages with its OpenAPI spec, create missing pages, write Used in blocks, list orphans
argument-hint: <product-slug>
---

Bring one product's reference pages in line with its spec. Load `api-referencing`. Arguments: $ARGUMENTS

1. Run `npm run docs:check <product-slug>` first and show the `[reference]` and `[coverage]` lines, so the person sees what will change before it changes.
2. Run `npm run docs:check <product-slug> --fix`. Report what it did: pages created (with their paths), "Used in" blocks written, `openapi:` values rewritten to the file-prefixed form.
3. For every created page, add it to the right reference sub-group in `docs.json` (sub-groups mirror spec tags; create the sub-group if the tag is new).
4. For every reference page whose operation is **not in the spec** (the check fails these), do not delete the page. List them with the operation, and ask whether the operation belongs in this product's spec (then add it to the spec from the page's content, converting per `api-referencing`), belongs to another product (then it is a move with a redirect), or is retired (then the page goes, with a redirect to the nearest replacement).
5. For every page that still carries `<ParamField>` or `<ResponseField>`, offer to convert it per `api-referencing`, one page at a time, showing the spec diff before writing.
6. Finish with the check run again and the remaining `[reference]` lines, if any.

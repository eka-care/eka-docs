---
description: Show a product's ladder as a checklist, which rungs exist, which are stubs, what the check says
argument-hint: <product-slug>
---

Report where one product stands. Load `docs-strategy`. Arguments: $ARGUMENTS

1. Read `product.yaml` (find it by slug). Run `npm run docs:check <slug> --json` and keep the result.
2. Walk the product's folder and classify every `.mdx` by `type` (or `reference` if it has `openapi:`). A page is a **stub** if any section body is only an italic placeholder line or the page has fewer than 80 words outside frontmatter.
3. Print the ladder as a table: rung, type, required or optional, count of pages, how many are stubs, and the pages by title. Then journeys with the workflows pointing at each, and workflows with their operation counts.
4. From the check result: failures and warnings by rule, counts only, with the three most useful lines under each.
5. End with: `enforce` value, whether the product would pass if enforced, and the single next action that moves it furthest (usually the first missing journey or workflow).

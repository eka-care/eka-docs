---
description: Interview for one journey and write its page
argument-hint: <product-slug> <journey-slug> [notes]
---

Write one journey page. Load `docs-strategy`, `writing-journeys` and `writing-style`. Arguments: $ARGUMENTS

1. Read the product's `product.yaml`, its overview page, and every existing journey and workflow page, so the new journey links to workflows that exist and does not duplicate one that does.
2. Ask, in one batch: the persona in one line; the trigger (where they are, what just happened); what they want in their own words; the steps in order, marking which are human actions and which need the API; what they hold at the end; the branches. If they give a flow diagram or a Slack thread instead, derive the answers from it and show them for confirmation.
3. Write `<root>/journeys/<journey-slug>.mdx` with the frontmatter and the five sections from `writing-journeys`. Every API step links to a workflow page. For a workflow that does not exist yet, create a stub with `/workflow-new`'s frontmatter and section headings, and say so.
4. Add the page to the product's Journeys group in `docs.json`.
5. Run `npm run docs:check <product-slug>` and show the lines that mention this journey. Finish by listing the workflows this journey needs and which are still stubs.

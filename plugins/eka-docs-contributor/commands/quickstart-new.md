---
description: Pick the product's representative workflow and draft the quickstart page from it
argument-hint: <product-slug> [workflow-slug to use instead of the proposed one]
---

Write or rewrite one product's quickstart. Load `docs-strategy`, `writing-quickstart`, `writing-workflows` and `writing-style`. Arguments: $ARGUMENTS

1. Read `product.yaml`, the overview, every journey page and every workflow page (frontmatter and the Steps, State and Test it sections), the testing page, and the spec's examples for the operations involved. If the product has no workflow page yet, stop: a quickstart walks a workflow, so write one with `/workflow-new` first.
2. Propose the representative workflow by the rules in `writing-quickstart`: count how many journeys link each workflow, drop any that needs a webhook, a second party or a prior workflow, prefer the one that ends in the product's core artefact, prefer three to five calls. Show the ranking in a short table and the pick, and ask for a yes or a different slug. Skip the question if the slug was given in the arguments.
3. Ask, in one batch, only what the pages cannot tell you: the sandbox base URL if the testing page lacks it, the test values to use, and which SDK language to show beside `curl` if the product has SDK pages.
4. Draft `<root>/quickstart.mdx` with the frontmatter (`workflow:` set) and the five sections from `writing-quickstart`. Build each request from the spec's example for that operation, each response from the spec's success example, trimmed to the fields the next step needs. Where the spec has no example for an operation, write the request from its schema and mark the response `<!-- TODO: paste a scrubbed sandbox response -->`, and list those operations in the report.
5. Confirm every operation the quickstart calls is in the named workflow's `operations`. If one is not, say so and offer to add it to the workflow page rather than silently widening the quickstart.
6. Add or keep the page as the third entry in the product's `docs.json` group. Run `npm run docs:check <slug>` and show any `[quickstart]` lines. Finish with the word count outside code blocks and the TODOs left.

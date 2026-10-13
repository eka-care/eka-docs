---
description: Interview against the spec and write one workflow page with its sequence diagram, steps, state, failures and test
argument-hint: <product-slug> <workflow-slug> [notes, e.g. "journey register-walk-in-patient" or operation ids]
---

Write one workflow page. Load `docs-strategy`, `writing-workflows`, `api-referencing` and `writing-style`. Arguments: $ARGUMENTS

1. Read `product.yaml` and parse the spec(s). List the operations grouped by tag as `METHOD /path  summary`, and the spec's webhooks. Read the journey pages so you can offer the right `journey`.
2. Ask, in one batch: which journey this belongs to (offer the list); which operations, in order (offer them by tag; accept ids, paths or summaries); which webhooks it waits for; what the integrator must have before starting; the decisions (any response field that changes the next call, and the condition); the async waits (poll what, until what, or which webhook); the test data for sandbox.
3. Derive from the spec, do not ask: the fields each response carries that the next call needs (that is the "State you must persist" table), and the error codes from each operation's error responses (that is the start of the "When it fails" table). Show both tables and ask only what the spec cannot tell you: how long to keep each field, and what to do on each error.
4. Write `<root>/workflows/<workflow-slug>.mdx` with the full frontmatter and the seven sections from `writing-workflows`. The sequence diagram has one arrow per operation labelled `METHOD /path`. Each `<Step>` links its reference page by URL.
5. Add the page to the product's Workflows group in `docs.json`.
6. Run `npm run docs:check <product-slug> --fix` so the reference pages get their "Used in" lines, then run it without `--fix` and show anything that mentions this workflow. A workflow that names an operation not in the spec is a failure; fix the spec or the page before finishing, never by deleting the operation from the frontmatter.

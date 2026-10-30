---
name: eka-docs-index
description: Router for all work on developer.eka.care documentation. Use FIRST whenever anyone asks about documenting a product or API on eka-docs, adding a page, writing a journey or workflow, referencing an OpenAPI spec, fixing a docs-check failure, scaffolding a product's integration plugin, or where something belongs in the site. Triggers include "document this API", "new product docs", "write a workflow", "the ladder", "docs-check failed", "where does this page go", "scaffold the plugin", "Used in block", "product.yaml". Route from here rather than guessing.
---

# Eka Docs Index

The repo is `eka-care/eka-docs`, a Mintlify site. The binding structure is the **product ladder** in `docs-strategy`. Read that skill once before anything else.

## Route by request

| They ask | Go to |
|---|---|
| What must a product's docs contain, where does page X go | `docs-strategy` |
| Write a journey (who the person is, what they do, in product terms) | `writing-journeys`, then `/journey-new` |
| Write a workflow (ordered API calls for one journey step) | `writing-workflows`, then `/workflow-new` |
| Write the quickstart, or pick which workflow represents the product | `writing-quickstart`, then `/quickstart-new` |
| Document an endpoint, webhook, error code; move a hand-written schema into the spec; `openapi:` frontmatter | `api-referencing`, then `/api-sync` |
| Tone, sentence shape, what words to avoid, word budgets, In short | `writing-style` |
| `docs.json` groups, icons, redirects, contextual menu | `mintlify-nav` |
| A new product from scratch | `/product-new` (it runs the interview and scaffolds the ladder) |
| Which rungs a product has, what is missing | `/product-status` |
| Run or explain the check | `/docs-check`; the rules are in `docs-strategy` section "The check" |
| What a product's Claude Code plugin looks like, or build one | `product-plugins`, then `/plugin-scaffold` |
| Review a pull request's pages | agent `docs-reviewer` |
| Audit a whole product before restructuring it | agent `gap-finder` |
| Prove a product plugin and its docs work end to end | agent `integration-tester` |
| Record a change for readers | `/changelog-entry` |

## Three rules that apply everywhere

1. The OpenAPI spec is the only place a request or response schema is written. A reference page is `openapi:` frontmatter plus optional notes.
2. A product with operations and no journey or workflow page is not documented, however complete its reference is. The check fails it once the product is enforced.
3. Nothing in a skill or plugin states a fact that is not on a page. Skills point at pages; they do not copy them.

## What is deliberately not here

No atoms, no compiler, no sequencing rules, no Gantt, no standup. If someone asks for one of those by name, they are thinking of the ABDM Developer Portal's contributors assistant, which is a different project.

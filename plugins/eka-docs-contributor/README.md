# Eka Docs Contributor

The Claude Code plugin for writing product documentation on developer.eka.care.

It exists because a product's docs used to be a pile of endpoint pages. This plugin makes every product carry the same **ladder**: overview, journeys, quickstart, workflows, API reference, webhooks, errors, testing, build with AI, changelog. The OpenAPI spec is the only place a schema lives. A check fails a product that has APIs but no journey or workflow.

## Install

```sh
claude plugin marketplace add eka-care/eka-docs
claude plugin install eka-docs-contributor@eka-docs
```

Restart Claude Code. Working on the plugin itself: add your checkout as the marketplace and run `claude plugin marketplace update eka-docs` after each change. Validate before committing:

```sh
claude plugin validate ./plugins/eka-docs-contributor --strict
```

## What is in here

Skills

- `eka-docs-index` routes any docs request to the right skill, command or agent. Start here.
- `docs-strategy` the ladder, page types, frontmatter, `product.yaml`, the check's rules
- `writing-journeys` a person's end-to-end story in product terms
- `writing-quickstart` the one representative workflow, first call to real response in under ten minutes
- `writing-workflows` one journey step as an ordered sequence of calls; the unit a product plugin executes
- `api-referencing` the spec as the only schema, `openapi:` pages, webhooks, errors, the generated "Used in" block
- `writing-style` the voice
- `mintlify-nav` `docs.json`, icons, redirects, the contextual menu
- `product-plugins` what a product's integration plugin looks like and the rule that keeps it honest

Commands

- `/product-new` interview and scaffold a whole product
- `/journey-new`, `/workflow-new` one page each, interviewed against the spec
- `/quickstart-new` picks the representative workflow and drafts the quickstart from it
- `/api-sync` reference pages in line with the spec, "Used in" blocks written
- `/docs-check` run the check and explain each finding
- `/product-status` the ladder as a checklist
- `/plugin-scaffold` a product plugin skeleton from the pages
- `/changelog-entry` one dated entry

Agents

- `docs-reviewer` reviews a pull request's pages
- `gap-finder` audits a product before it moves onto the ladder
- `integration-tester` runs a product plugin's workflow against sandbox and turns every guess into a docs finding

## The check

```sh
npm ci
npm run docs:check            # every product
npm run docs:check ekascribe  # one product
npm run docs:check ekascribe --fix
```

Source: `scripts/docs-check.mjs`. Runs on every pull request. Blocks only on products whose `product.yaml` says `enforce: true`.

## What is deliberately not here

No atoms, no compiler, no word budgets, no "In short" blocks, no sequencing rules, no Gantt, no standup, no source watcher. Those belong to the ABDM Developer Portal's contributors assistant, which this plugin is modelled on and stripped from.

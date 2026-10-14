# Contributing to developer.eka.care

Every product on the site carries the same ladder, in this order:

| Rung | Page | What it answers |
|---|---|---|
| 1 | Overview | What is this, who is it for, what can I build |
| 2 | Journeys | A real person's end-to-end story, in product terms |
| 3 | Quickstart | First successful call in under ten minutes |
| 4 | Workflows | One journey step as an ordered sequence of API calls |
| 5 | API reference | One page per operation, generated from the OpenAPI spec |
| 6 | Webhooks | Every event, when it fires, who consumes it |
| 7 | Errors | Every code, its meaning, what to do |
| 8 | Testing | Sandbox, credentials, test data, happy paths |
| 9 | Build with AI | Install the product's plugin and MCP |
| 10 | Changelog | Dated entries, newest first |

Three rules:

1. A request or response schema is written once, in the spec. Reference pages are `openapi:` frontmatter plus notes.
2. A product with APIs and no journey or workflow page is not documented. The check fails it once the product is enforced.
3. Every page has `title`, `description` and `type` in its frontmatter.

## Tools

Install the contributor plugin for Claude Code and let it do the scaffolding and the interviews:

```sh
claude plugin marketplace add eka-care/eka-docs
claude plugin install eka-docs-contributor@eka-docs
```

Then `/product-new <slug>` for a new product, `/workflow-new` for a workflow, `/docs-check` before you open a pull request. The full guide is in `plugins/eka-docs-contributor/README.md`.

Without the plugin, run the check by hand:

```sh
npm ci
npm run docs:check
```

It runs on every pull request and blocks only on products whose `product.yaml` has `enforce: true`.

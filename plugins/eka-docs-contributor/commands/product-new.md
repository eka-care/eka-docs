---
description: Interview for a new product and scaffold its full documentation ladder, manifest and navigation group
argument-hint: <product-slug> [notes, e.g. "spec at path/openapi.yaml" or "HIS vendors, two journeys"]
---

Scaffold a new product's docs on developer.eka.care. Load `docs-strategy`, `writing-journeys`, `writing-workflows`, `api-referencing` and `mintlify-nav` first. Arguments: $ARGUMENTS

## 1. Discover

Before asking anything: check whether `<slug>/` or a `product.yaml` with this slug already exists (stop and say so if it does), find any OpenAPI file that looks like this product's (search `*.yaml`, `*.yml`, `*.json` for its paths), and read `docs.json` to see where the group will go. Summarise in five lines.

## 2. Interview, in one batch

Ask all of this at once, numbered, and wait:

1. One sentence: what the product does, in the reader's terms.
2. Who integrates it (the audiences, two to five), and who the end user is in each case.
3. The journeys: for each audience, the one or two end-to-end stories, each as "a <persona> wants to <outcome>".
4. The workflows inside each journey: name each, and the API calls it makes in order (operation ids or paths are fine; you will match them to the spec). Note any webhook a workflow waits for.
5. Where the spec is, or that there is none yet. If none, ask for the endpoints as a list and say you will write the spec skeleton.
6. Sandbox: how to get credentials, any test data that must be used.
7. Owner (team or person) for `product.yaml`.

If they answer "just guess" to any item, draft it from the spec and mark it `<!-- TODO: confirm -->`.

## 3. Scaffold

Create, from the answers, exactly the ladder in `docs-strategy`:

- `<slug>/product.yaml` with every field filled, `enforce: false`.
- `overview.mdx`, `quickstart.mdx`, `webhooks.mdx`, `errors.mdx`, `testing.mdx`, `build-with-ai.mdx`, `changelog.mdx`: correct `type`, a real `title` and `description`, every section heading the skill names, and one italic line under each heading saying what goes there. Never an empty file.
- One `journeys/<slug>.mdx` per journey and one `workflows/<slug>.mdx` per workflow, with full frontmatter (`journey`, `operations`, `webhooks` filled from the interview and matched against the spec), section headings, and the sequence diagram drafted from the operations.
- If there is no spec: `api-reference/openapi.yaml` with `openapi: 3.1.0`, `info`, `servers`, `securitySchemes`, and one path item per endpoint named, each with `operationId`, `summary`, `tags`, and empty request and response placeholders.
- Run `npm run docs:check <slug> --fix` to create the reference pages and the "Used in" blocks.
- Add the product group to `docs.json` per `mintlify-nav`, in ladder order, reference sub-groups by tag.

## 4. Report

Run `npm run docs:check <slug>` and show the report. List every file created, then the gaps in ladder order: which pages are stubs, which operations no workflow names. Finish with the next command to run (usually `/workflow-new` for the first workflow) and the reminder that `enforce` flips to true only when the check is clean.

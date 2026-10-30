# Eka Docs Contributor: documentation strategy and contributor plugin

Date: 2026-10-13
Status: draft for review
Repo: eka-care/eka-docs (Mintlify site at developer.eka.care)

## 1. Intent

When a team ships a product or a set of APIs today, they paste the endpoint pages into `api-reference/` and stop. There is no story: nobody writes what the product is for, who uses it, which calls make up a real workflow, or what to do when a call fails. A developer, or an AI agent, has to reverse engineer the product from raw endpoints.

This project builds the thing that stops that: a **documentation strategy** (what every product's docs must contain, and in what shape) and a **contributor plugin** for Claude Code that walks an Eka engineer through producing it, and checks the result. The same structure feeds a later project: one **product plugin per product** that an external developer installs to integrate end to end, and that Eka devs run to test that the docs are complete.

It is modelled on the ABDM Developer Portal's contributors assistant, stripped to the parts that are about content and API reference. Atoms, the compiler, word budgets, "In short" blocks, sequencing rules, Gantt, standup, DPG governance and the source watcher are all left out.

## 2. Goals, non-goals, anti-goals

Goals

- Every product section on developer.eka.care carries functional knowledge (what, who, journeys) and technical knowledge (workflows, reference, errors, testing) in one fixed shape, so a reader always knows where to look.
- The OpenAPI spec is the only place a request or response schema is written. Reference pages are generated from it.
- A contributor can go from "we have a new product" to a complete, checked page set in one guided session.
- A check catches a product that has APIs but no journey or workflow, a workflow that names an endpoint the spec does not have, and an endpoint no workflow uses.
- The docs are AI-ready: the structure is regular enough that a product plugin can be scaffolded from it, and every workflow page is something an agent can execute step by step.

Non-goals (this project)

- Rewriting ABDM Connect or any other product's content. That is the next project, run with this plugin.
- Building any product plugin. Project three. This project only defines the shape and ships the scaffolder.
- An MCP server, a compiler, or any generated prose.
- Changing the Mintlify theme or site chrome beyond the contextual menu.

Anti-goals (would make this a failure even if it works)

- A plugin so heavy that engineers route around it. If writing a workflow page takes a two-hour interview, nobody will do it.
- Rules that fight Mintlify. Everything must render on the existing site with no custom build step.
- A second copy of any fact. No facts in skills that are not on a page.

## 3. The documentation strategy

### 3.1 Product ladder

Every product gets one top-level folder (EkaScribe already follows this: `ekascribe/`). ABDM Connect, EMR, MedAssist, Console and the rest move to the same shape over time, one product per project. The folder carries this ladder, in this reading order:

| Rung | Page type | What it answers | Count |
|---|---|---|---|
| 1 | `overview` | What is this, who is it for, what can I build, key concepts | 1 |
| 2 | `journey` | A real person's end-to-end story through the product, in product terms, not API terms. Example: "A clinic registers a walk-in patient's ABHA" | 1 or more |
| 3 | `quickstart` | First successful call in under ten minutes | 1 |
| 4 | `workflow` | One journey step as an ordered sequence of API calls: prerequisites, sequence diagram, each step linked to its endpoint, state to persist, what fails and what to do | 1 or more per journey |
| 5 | `reference` | One page per operation, generated from OpenAPI | 1 per operation |
| 6 | `webhooks` | Every event the product emits, payload, when it fires, which workflow consumes it | 1 |
| 7 | `errors` | Every error code the product returns, meaning, and what the integrator should do | 1 |
| 8 | `testing` | Sandbox, credentials, test data, the happy paths to run before go-live | 1 |
| 9 | `build-with-ai` | How to install the product's Claude Code plugin and MCP, and what each skill does | 1 |
| 10 | `changelog` | Dated entries, newest first | 1 |

Authentication is shared across products and lives once under `api-reference/authorization/`; every product's quickstart links to it rather than repeating it.

Three further page types sit outside the ladder and are allowed but never required: `sdk` (a client library page, like `ekascribe/sdks/`), `resource` (a supporting reference such as a FHIR structure, an ngrok guide or IP allowlisting) and `guide` (anything explanatory that is none of the above). The check accepts them and never asks for them. The ladder is closed otherwise: a page under a product folder must carry one of the thirteen types.

Rungs 1, 2, 4 are the functional and workflow knowledge that is missing today. Rung 5 is what exists. The check in 3.5 makes 1, 2, 4, 7 mandatory before a product is considered documented.

### 3.2 The workflow page

This is the unit that turns an API dump into documentation, and the unit a product skill executes. Its shape:

```
---
title: Create an ABHA with Aadhaar OTP
description: One sentence.
product: abdm-connect
type: workflow
journey: register-walk-in-patient
operations:
  - POST /abdm/na/v1/registration/aadhaar/init
  - POST /abdm/na/v1/registration/aadhaar/verify
  - POST /abdm/na/v1/registration/aadhaar/create
webhooks:
  - abha.abha_created
---
## When to use this
## Before you start          (auth, roles, config, prior workflows)
## Sequence                  (mermaid sequenceDiagram)
## Steps                     (<Steps>, one per call, linking the reference page, naming the fields that carry state between calls)
## State you must persist    (txn_id, oid, ...)
## When it fails             (table: situation, error code, what to do, link to errors page)
## Test it                   (the sandbox happy path, link to testing page)
```

`operations` and `webhooks` in the frontmatter are the machine half. Mintlify ignores unknown frontmatter keys, so they cost nothing at render time, and the check reads them.

### 3.3 API referencing

- One OpenAPI 3.x file per product at `<product>/api-reference/openapi.yaml` (EkaScribe already has this). Several files are allowed if the product has independent API surfaces, listed in the manifest.
- Every reference page is `openapi:` frontmatter and nothing hand-written about the schema. The canonical form is file-prefixed, `openapi: "<spec path> <METHOD> <path>"`, because Mintlify resolves the bare `<METHOD> <path>` form by scanning every spec in the repo and taking the first match in alphabetical filename order, which breaks the moment two specs share a path (as they will while a product migrates). The check accepts the bare form on existing pages and warns when it is ambiguous across specs; `--fix` always writes the file-prefixed form. Prose that belongs to an endpoint but not to the spec (a note, a gotcha) goes in the page body under the frontmatter, which Mintlify renders alongside the generated content.
- Webhooks are described in the same spec as OpenAPI 3.1 `webhooks`, and the webhooks page links to them.
- Error codes live in the spec's response examples and on the errors page. The check cross-references: a code on the errors page that no response example carries is a warning.
- Every operation page carries a generated "Used in" block listing the workflows whose `operations` name it. The check writes it; a person never edits it.
- A request or response schema written by hand in MDX is a check failure once a product is enforced.

### 3.4 The product manifest

One small file at `<product>/product.yaml`:

```yaml
slug: abdm-connect
name: ABDM Connect
owner: team-or-person
audiences: [HIS vendors, labs, insurers, PHR apps]
openapi:
  - api-reference/openapi.yaml
plugin: abdm-connect          # name of the product plugin, once it exists
enforce: false                # true once the product passes the check; then the check blocks CI
```

It is the registry the plugin reads: which products exist, where their spec is, whether the check should block. Nothing else is derived from it.

### 3.5 The check

`scripts/docs-check.mjs`, run as `npm run docs:check [product]`. Reads every `product.yaml`, the spec(s), and every page's frontmatter under the product folder. Rules:

Fail (when `enforce: true`; otherwise reported)

- A product with one or more operations and no `journey` page, or no `workflow` page.
- A workflow whose `operations` names a method and path the spec does not define.
- A workflow whose `journey` names a journey page that does not exist.
- A page under a product folder with no `type`, or a `type` not in the ladder or the three extra types.
- A reference page whose `openapi:` operation is not in the spec.
- Missing `overview`, `errors` page.
- A hand-written request or response schema on a reference page.

Warn (always)

- An operation no workflow names.
- A journey with no workflow pointing at it.
- An error code on the errors page absent from every response example.
- A product with no `testing` or `build-with-ai` page.

Fix (`--fix`)

- Writes the "Used in" block on every operation page.
- Creates a bare `openapi:` page for every operation in the spec that has no page, and lists pages whose operation has left the spec.

Output is a per-product report, grouped by rule. The check runs in GitHub Actions on every pull request; it blocks only on products with `enforce: true`. Today that is none, so turning it on changes nothing until the ABDM Connect project flips the flag.

### 3.6 Navigation and the AI menu

- `docs.json` navigation per product follows the ladder order. The plugin's nav skill knows how to add a product group, and `/product-new` writes it.
- The contextual menu gets a custom "Install AI tools" option pointing at a single page `ai-tools/build-with-ai` (query `path=$path`), which lists every product's install commands. The existing `copy`, `view`, `chatgpt`, `claude` options stay. Mintlify renders this as a dropdown, not an inline row.

### 3.7 Voice

One short writing skill, no lint: second person, present tense, say what the API does rather than what the team did, one idea per sentence, no marketing adjectives, code and field names in backticks. No word budgets, no banned-word lists, no em dash rule.

## 4. The contributor plugin

Lives in this repo at `plugins/eka-docs-contributor/`. A `.claude-plugin/marketplace.json` at the repo root makes eka-docs a marketplace, so install is:

```
claude plugin marketplace add eka-care/eka-docs
claude plugin install eka-docs-contributor@eka-docs
```

Product plugins land under `plugins/<product>/` in project three, in the same marketplace.

### 4.1 Skills

| Skill | What it carries |
|---|---|
| `eka-docs-index` | Router. Given any docs request, names the skill, command or agent to use. Installed first. |
| `docs-strategy` | Sections 3.1 to 3.6 of this document as the binding reference: the ladder, page types, frontmatter per type, where a thing goes. |
| `writing-journeys` | How to write a journey page: who the person is, the trigger, the steps in product terms, where each step hands off to a workflow. With a worked example. |
| `writing-workflows` | The workflow page shape in 3.2, how to derive the sequence from the spec, how to name state, how to write the failure table. With a worked example. |
| `api-referencing` | Section 3.3: spec as source, `openapi:` pages, webhooks as spec webhooks, error examples, what may and may not be hand-written. How to turn a hand-written endpoint page into spec plus a one-line page. |
| `writing-style` | Section 3.7. |
| `mintlify-nav` | `docs.json` groups, icons, redirects, the contextual menu, what Mintlify renders and ignores. |
| `product-plugins` | What a product plugin is (overview, auth, one skill per workflow, testing, debugging, a debugger agent, `/integrate-<workflow>` commands), the rule that a skill fetches the page before each call and never copies a schema, and the phases a command runs (discover, interview, plan, build, test, report). Used by the scaffolder and by project three. |

### 4.2 Commands

| Command | Does |
|---|---|
| `/product-new <slug>` | Interviews in one batch (what, who, journeys, workflows and the calls in each, spec location), then scaffolds `product.yaml`, the full ladder with every page stubbed and its frontmatter filled, and the `docs.json` group. Never leaves an empty file: each stub carries its section headings and a one-line prompt per section. |
| `/journey-new <product> <slug>` | Interview, then one journey page. |
| `/workflow-new <product> <slug>` | Interview against the spec (offers the operations by tag), then one workflow page with the sequence diagram drafted from the chosen operations. |
| `/api-sync <product>` | Runs the check's `--fix` for one product: creates missing operation pages, writes "Used in" blocks, lists orphans. |
| `/docs-check [product]` | Runs the check and explains each finding with the fix. |
| `/product-status <product>` | The ladder as a checklist: which rungs exist, which are stubs, what the check says. |
| `/plugin-scaffold <product>` | Generates `plugins/<product>/` from the product's pages: one skill per workflow, overview from the overview page, testing from the testing page, commands per workflow. Marks every generated file as generated. Project three fills it in. |
| `/changelog-entry <product>` | Adds a dated entry to the product's changelog from a short description. |

### 4.3 Agents

| Agent | Does |
|---|---|
| `docs-reviewer` | Reviews a pull request's changed pages against `docs-strategy`, `writing-workflows` and `api-referencing`, and returns findings with the page and the fix. Runs the check first. |
| `gap-finder` | Audits one product: which journeys and workflows exist, which operations have no story, where functional material is buried in the reference tree, and what the move to the ladder would involve. Produces a gap list with a proposed page tree. This is what the ABDM Connect project starts with. |
| `integration-tester` | Takes a product plugin and a workflow, runs it against sandbox as an external developer would, and reports every point where it had to guess because the docs did not say. Each guess becomes a docs finding. Project three uses it; it ships here so the contract is fixed. |

### 4.4 Repo additions

- `plugins/eka-docs-contributor/` (skills, commands, agents, `.claude-plugin/plugin.json`, README)
- `.claude-plugin/marketplace.json`
- `scripts/docs-check.mjs`, `package.json` with `yaml` and `gray-matter` only
- `.github/workflows/docs-check.yml`
- `ai-tools/build-with-ai.mdx` and the contextual menu entry in `docs.json` (deferred: Sam will give the go-ahead on the page's content separately; not in the first build)
- `CONTRIBUTING.md` at the root: the ladder in one screen and the install commands

Two existing products get a `product.yaml` with `enforce: false` so the check has something real to report on: `ekascribe/` (the best-shaped product today, one spec) and `api-reference/user-app/abdm-connect/` (the pilot, its spec at `registration.yml`). The manifest therefore carries a `root` key naming the product's folder, since ABDM Connect has not moved yet. No page under either folder is edited; pages without a `type` are reported, not failed, while `enforce` is false.

Mintlify serves every unlisted `.mdx` in the repo at its path (checked: `changelog1.mdx` is not in `docs.json` and answers 200 on developer.eka.care) but does not serve `.md` (the root `README.md` answers 404). So every file under `plugins/`, `docs/` and the root `CONTRIBUTING.md` is `.md`, never `.mdx`, and the first deploy after the plugin lands is watched once in the Mintlify dashboard to confirm no `.md` is parsed as a page.

## 5. Constraints

- Mintlify is the renderer. No custom build step; every page must render from the repo as is.
- Node only for scripts, two dependencies. The site repo has no toolchain today and should not grow one beyond this.
- Plugin layout follows Claude Code's default discovery (`skills/`, `commands/`, `agents/`), validated with `claude plugin validate --strict`. Skills and commands share a namespace: no skill may share a name with a command.
- The ABDM Developer Portal plugins (`abdm-contributors-assistant`, `abdm-connect`) are reference material, not dependencies. Nothing here imports from them.

## 6. Decided, and left to the builder

Decided (by the conversation)

- Pilot product is ABDM Connect; it is the next project, not this one.
- Product plugins serve external developers first and Eka devs for testing.
- The AI capabilities mirror the ABDM portal's structure: a contributor plugin, a marketplace, product plugins with skills and commands.

My calls (Sam's to overturn)

- Product plugins and the contributor plugin live in eka-docs, not in `abdm-utility`. The docs are the source; the plugins sit beside them.
- The check blocks CI per product behind `enforce: true`, so it can land today without breaking anything.
- Machine fields live in page frontmatter and one `product.yaml`, not in a separate catalogue.
- "Used in" blocks are generated and committed, so they render on Mintlify without a build step.
- The "Install AI tools" menu entry goes to one site-wide page rather than per product, because the contextual menu cannot route per product.
- Three non-ladder page types (`sdk`, `resource`, `guide`) exist so EkaScribe's SDK and resources pages have a home; the ladder stays closed otherwise.
- The canonical `openapi:` frontmatter is the file-prefixed form; bare forms are accepted and warned on when ambiguous.
- `product.yaml` carries a `root` key, and this project adds manifests for EkaScribe and ABDM Connect without touching their pages.
- Plugin, spec and contributing files are `.md` so Mintlify does not serve them.

Admin dependency: "blocks CI" holds only once the `docs-check` workflow is a required status check in branch protection on `eka-care/eka-docs`. The builder cannot set that; the Mintlify GitHub app deploys on push to `main` regardless.

Left to the builder

- Exact frontmatter keys for each page type beyond those in 3.2, and the stub text in scaffolds.
- The report format of the check and the GitHub Actions wiring.
- The interview questions in each command, as long as they are batched.
- Worked examples inside skills: use ABDM Connect or EkaScribe content as the example, whichever reads better.

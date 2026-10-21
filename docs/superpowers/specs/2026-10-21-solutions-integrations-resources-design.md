# Portal restructure: Solutions, Integrations, Resources

Status: decisions answered by Abha on 2026-10-21; DPDP wording still open. Supersedes the four-family navigation in
`2026-10-15-landing-products-restructure-design.md` where they differ.

## Intent

A developer should understand the portal in one look: **Solutions** is what you build
with, **Integrations** is how you connect the Eka products you already use, and
**Resources** is what every product shares. Every product's sidebar has the same
sections in the same order, and that includes a **Build with AI** section listing the
MCP servers, plugins and skills for that product.

This comes from feedback round 2 (the portal working session) and Abha's corrections on 2026-10-21:

- Scribe also produces medical records, so "Medical Record API" is not a separate family.
  The medical record is what Scribe and document parsing both output.
- Integrations is a way of grouping things. Where an integration uses the same API as a
  solution, it links to that solution's docs instead of copying them.
- The top navigation has three families: Solutions, Integrations, Resources.
- Solutions covers every product a developer uses to build their own tools on Eka's APIs,
  MCP servers and SDKs.
- AI tools sit with the product they belong to, in a Build with AI section in that
  product's left sidebar. That page follows the structure of the Build with AI page on
  docs.abdm.gov.in.

## Goals

1. Three families in `docs.json` `navigation.products` and in the landing page's nav menus.
2. Every product item has the same tabs: **Documentation | APIs & SDKs | Changelog**.
   The product's overview is the first page of Documentation.
3. Every product's Documentation sidebar ends with a **Build with AI** group.
4. Spotlight is reachable from the menus and the landing page. Today it is buried.
5. Nothing is lost. Every page listed today still appears exactly once (`build-nav.py --check`), and every moved URL redirects.

## Non-goals

- The "What are you building?" agent, the Mintlify agent, changelog automation, Fern and
  the community plan. These come out of the meeting but are separate pieces of work.
- Rewriting product content. Pages are moved, regrouped and linked, not rewritten. The
  exception is the new Build with AI pages.
- Changing any API or spec file.

## Anti-goals (what would count as failure even if it builds)

- A developer finds the same API documented in two places with different text.
- A Build with AI section that lists only "coming soon" rows. With reference skills, every product has at least one real tool.
- A landing page with more tiles than it has today.
- A page that 404s because its URL moved without a redirect.

## Information architecture

### Solutions (build your own tools)

| Item | Comes from | Notes |
|---|---|---|
| Scribe | AI > Scribe | Voice to structured medical record |
| Document Parsing | AI > Models (parsing, codification) | Reports to structured medical record |
| Agents | AI > Agents | MedAssist, Echo Agent Kit, Synapse SDKs |
| Medical Knowledge | AI > Datasets | Drugs, labs, protocols; the MedAI Tools MCP lives here |
| ABDM Connect | ABDM > HIE-CM | ABHA, linking, consent. A major Eka solution |
| NHCX (ABDM) | ABDM > NHCX | Claims |
| UHI (ABDM) | ABDM > UHI | |
| Patient Experiences | `docs/products/patient-experiences` (exists today) | A cluster: one overview page that links to Agents, EMR appointments, Billing payments and Health Records. It has no pages of its own beyond the overview |

Clinical Intelligence is not a product of its own any more. Its pieces become Document
Parsing and Medical Knowledge. The research part (Spotlight) moves to Resources.

ABDM sits inside Solutions (Abha, 2026-10-21: ABDM Connect is a major Eka solution).
On the landing page, the ABDM items keep an "ABDM" label as their own group.

*My call:* the menu label is "ABDM Connect". Folders and URLs stay `hie-cm`.

### Integrations (for people already using an Eka product)

| Item | Comes from |
|---|---|
| Eka EMR | Integrations > EMR (EMR MCP server moves here) |
| IPD | Integrations > IPD |
| Billing | Integrations > Billing |
| Health Records | Integrations > Health Records |

The Integrations overview page is how the grouping shows up. It is a page of cards
organised by the Eka product the reader uses. A card for an integration that has its own
API (for example EMR webhooks) links to that item. A card for an integration that uses a
Solutions API (for example "add Scribe to Eka EMR" or "ABHA for your clinic") links to
that solution's page. Nothing is copied.

### Resources (shared by every product)

Get started, Auth, Encryption, All APIs, **Research (Spotlight)**, and Changelog (all
products). Discord and GitHub stay as links on the navbar and in the footer.

Webhooks and SDKs are not Resources items (Abha, 2026-10-21). Each page moves into the
"APIs & SDKs" tab of the product it serves:

| Page | Goes to |
|---|---|
| Webhooks: register, list, delete, signature, samples, glossary, Webhook SDK | Eka EMR (its events are appointment, prescription and receipt). Scribe's docs link to it for `v2rx.completed` |
| Android EkaScribe SDK | Scribe |
| Android Records SDK | Health Records |
| TypeScript SDK (appointments, patients, medications) | Eka EMR |
| Python SDK (`ekacare`) | Eka EMR. *My call:* most of its modules are EMR |
| `api-sdk/sdks/sdks/ekacare-mcp` (a stub) | Folded into the MedAI Tools MCP pages |

Page URLs stay the same. Only the navigation changes.

### Where Spotlight is today

`docs/models/spotlight.mdx` exists and is the first page of the "Eka MedAI research"
group, at AI > Models > Documentation. It is not on the landing page and has no menu item.
The plan moves the group (Spotlight, Open Assets, Technologies) into Resources as
**Research** and adds it to the landing page's Resources menu. The page URLs stay the same,
so no redirects are needed.

## Product sidebar shape

The same order for every product. A section with nothing in it is left out.

1. **Overview** (root of the first group)
2. **Get started**: quickstart, authentication
3. **Guides**: journeys, workflows, concepts (what the product has today, regrouped)
4. **Webhooks** (where the product has them)
5. **Build with AI**
6. **Resources**: glossary, limits, examples

Tabs: **Documentation | APIs & SDKs | Changelog**. "APIs & SDKs" stays one tab (Abha,
2026-10-21). "Release Notes" goes back to "Changelog", which is the word the meeting used.
A product with no changelog has no Changelog tab.

## Build with AI

### Structure (from docs.abdm.gov.in, adapted for Mintlify)

The sidebar group is called **Build with AI**. Its first page is the overview. Each tool
that exists gets its own page under it.

Overview page `docs/<product>/build-with-ai.mdx`:

1. One line on what the section is for, plus a note to check generated code against the docs and in sandbox.
2. Cards: one per tool type this product actually has (MCP server, plugin, skills, CLAUDE.md).
3. **Learn how to use AI**: what you need (an assistant, a paid plan, your project open in it) and the order to follow.
4. **Connect the MCP server** (if one exists): install snippets for Claude, Cursor and VS Code, as Mintlify `CodeGroup` tabs.
5. **Install the plugin and skills** (if they exist): the one-line install, with each skill and what it does.
6. **Prompting an agent for this product**: a table of "Tell it" and "Because", with the mistakes an agent makes against this API.
7. **Read these docs as an agent**: `llms.txt`, `llms-full.txt`, and the page contextual menu (copy as Markdown, open in Claude or ChatGPT).

The ABDM site's interactive pickers (SkillPicker, McpInstall, AgentSetup) are Docusaurus
React components. Mintlify gets the same content as static `CodeGroup`, `Tabs` and `Card`
components. *My call:* no custom JS for this.

### What each product has today

| Product | MCP server | Plugin / skills | Other | Build with AI pages |
|---|---|---|---|---|
| Scribe | none | none | CLAUDE.md (`docs/scribe/api-integration`) | Overview, CLAUDE.md file |
| Document Parsing | none | none | none | Overview only |
| Agents | none of its own | none | Echo Agent Kit (its own guides) | Overview (points to the EMR and MedAI MCP servers as tools for agents) |
| Medical Knowledge | MedAI Tools MCP (`docs/agents/medai-tools-mcp/*`) | none | none | Overview, MCP server pages |
| ABDM Connect | eka-abdm-connect-mcp (M1 only; the page says so, more milestones coming) | abdm-connect plugin (integrate-m1 to m4, abdm-debug) | none | Overview, MCP server, plugin and skills |
| NHCX, UHI | none | none | none | Overview only |
| Eka EMR | Eka EMR MCP (`docs/agents/mcp-server/*`) | none | none | Overview, MCP server pages |
| IPD, Billing, Health Records | none | none | none | Overview only |

### Reference skills, one per product

The same shape as the NHA portal's reference skills (`abdm-docs/scripts/build-skills.mjs`).
Each product gets one skill. It is a short map, with one file per job beside it. An
agent opens a job file only when it needs it.

```
plugins/eka-<product>/
  .claude-plugin/plugin.json
  skills/eka-<product>/
    SKILL.md              the map: what the product does, before-anything-else rules, the job files
    references/
      integrate.md        now: hosts, auth and headers, every operation grouped by tag, one full request
      scaffold.md         later: needs the product's workflow pages
      debug.md            later: needs recorded error codes
      test.md             later: needs a test matrix
```

**Integrate is built now, for every product.** A generator script, `scripts/build-skills.mjs`,
reads the product's "APIs & SDKs" tab in `docs.json`. That tab is already the per-product
list of operations, and 413 reference pages carry `openapi:` frontmatter. The script
resolves each page to its operation in the spec and writes:
- hosts from `servers`
- auth and required headers from the security schemes and header parameters
- a table of operations per tag, each linking to its page on developer.eka.care
- one request written out in full

The skill's `SKILL.md` says it is a snapshot and gives the URL to fetch again. The job
files that don't exist yet are not listed, so there are no empty "later" rows.

**Scaffold, debug and test come later.** Each one is added for a product when the
material it is built from exists: workflow pages, error codes, a test matrix. The
generator adds the file and its line in `SKILL.md` without hand-editing.

**Before-anything-else rules** in `SKILL.md` come from the product's auth and overview pages
(token type, required headers, environment hosts). Rules that only a person who knows
the API could state are left for that person. None are invented.

**Distribution.** Mintlify does not serve `.md` files, so the skills are not on
developer.eka.care. The repo is already a plugin marketplace (`.claude-plugin/marketplace.json`).
Each product plugin is added there, and its Build with AI page shows:
- `/plugin marketplace add eka-care/eka-docs` and `/plugin install eka-<product>@eka-docs` for Claude
- the raw GitHub URL of `SKILL.md` for Cursor, Codex and other agents

**ABDM Connect** keeps its existing `abdm-connect` plugin (the `eka-abdm` marketplace),
which already has integrate skills for M1 to M4. *My call:* no second, generated ABDM
Connect skill, so the two can't disagree.

Generated files start with a `generated by scripts/build-skills.mjs` line. CI runs the
generator and fails if the output differs from what is committed, so a skill can't fall
behind its spec.

### Page moves (each with a redirect)

- `docs/agents/mcp-server/*` → `docs/emr/build-with-ai/mcp-server/*`
- `docs/agents/medai-tools-mcp/*` → `docs/datasets/build-with-ai/mcp-server/*`
- `docs/scribe/api-integration` → `docs/scribe/build-with-ai/claude-md`
- `docs/agents/mcp-for-emr` → folded into the EMR MCP server pages, then redirected.
- `docs/agents/mcp-for-indian-treatment-protocol-search` → folded into the MedAI Tools MCP
  pages, then redirected. Folding means any fact on the old page that the new pages
  lack is carried across before the redirect goes in.

The Agents sidebar's "Tools" group then holds only Echo Agent Kit and Synapse.

## Landing page

- Nav menus: Solutions, Integrations, Resources. Same items as `docs.json`.
- Product grid: Solutions only, grouped as AI (Scribe, Document Parsing, Agents, Medical
  Knowledge, Patient Experiences) and ABDM (ABDM Connect, NHCX, UHI). Tiles go from about 15 to 8.
- Integrations strip: four tiles (EMR, IPD, Billing, Health Records). EMR's tile says it has an MCP server.
- One trust line under the hero: DPDP compliant, hosted in India. **Open item:** the
  wording is not settled, so this line ships only after Abha confirms it.
- Resources menu: the "Learn" column goes (its Docs, API reference, Cookbook and SDKs
  links each landed on one product's page). It has two columns. **Platform** holds Auth
  and Encryption. **Stay current** holds Changelog, Under the hood, Research (Spotlight),
  Developer Discord and Open source. *My call:* Research sits in Stay current because
  Spotlight is a page of releases.
- Integrations menu: the Platform column goes. It lists the Integrations items only.
- Footer: a proper footer block with Solutions, Integrations, Resources and Community
  columns, in the landing page and in `docs.json` `footer.links`.
- Patient Experiences is one Solutions tile. Its overview page links to the products in
  the cluster.

## Also from round 2, still standing

- Code samples in Python, TypeScript, Java, C# and Ruby. Mintlify generates request examples
  from the OpenAPI files. The builder checks whether `docs.json` can set the language list,
  then sets it. Hand-written `CodeGroup` blocks are out of scope.
- Preview deploy for internal feedback (Raghu, Sankalp, Neha) before go-live this week.
- The Ask AI widget stays as it is (mock transport) until the custom agent's backend exists.

## How it is built

- `scripts/build-nav.py` produces the navigation. Families and items change there, not by
  hand in `docs.json`, and `--check` confirms no page is dropped.
- `scripts/route-map.json` and `docs.json` `redirects` cover every moved URL.
- The landing page source is `landing/source.html`, then `node scripts/build-landing.mjs`.
- Page rules: the eka-docs-contributor plugin (word budgets, no em dashes, icons on every row).

## Verification

- `python3 scripts/build-nav.py --check` passes.
- `mint broken-links` shows no new broken links.
- `scripts/docs-check.mjs` passes on new pages.
- Local preview: each family and one product per family, screenshots of sidebar and tabs,
  the landing page at desktop and phone widths, both themes.
- Every old MCP and Spotlight URL resolves.

## Order

1. Navigation: three families, "Release Notes" back to "Changelog", Spotlight to Resources, redirects.
2. Reference skills: `scripts/build-skills.mjs`, one plugin per product with SKILL.md and integrate.md, added to the marketplace, and the CI drift check.
3. Build with AI: overview page template, then each product's page (skill install, MCP server where one exists, CLAUDE.md for Scribe).
4. Integrations overview page with cross-links.
5. Landing page: menus, grid, trust line, footer.
6. Code sample languages.
7. Preview deploy.

## Calls made after the builder check (mine, for Abha to check)

- **API pages per item.** Document Parsing takes the Models API tab: parsing,
  codification and the Models SDKs. Medical Knowledge takes the whole Datasets API tab.
  Agents keeps its MedAssist APIs.
- **SDKs.** They stay in each product's "APIs & SDKs" tab. Resources > SDKs stays as the
  cross-product SDK list.
- **Eka EMR.** Every existing EMR page stays where it is. Only the MCP pages join it.
- **Get started.** It becomes Resources > Get started. Its Release Notes feed (weekly
  updates, Under the Hood) becomes Resources > Changelog. All APIs stays in Resources.
- **URLs.** `docs/models/*`, `docs/datasets/*` and Spotlight keep their URLs. Only the
  navigation changes. Redirects are needed only for the page moves listed above.
- **Prompting tables.** ABDM Connect's table comes from the abdm-connect skills and the existing
  HIE-CM pages. Scribe's comes from its CLAUDE.md and API pages. A product with no known
  agent mistakes gets no table instead of an invented one.

## Decisions (answered 2026-10-21)

1. ABDM inside Solutions: yes. ABDM Connect is a major solution.
2. Patient Experiences: one Solution that groups other products.
3. Older MCP pages: fold them in and redirect.
4. ABDM Connect MCP server and plugin: list them, and say clearly that they cover M1 only for now.
5. DPDP and India-hosted wording: **open item**.
6. SDKs: keep "APIs & SDKs" as one tab.

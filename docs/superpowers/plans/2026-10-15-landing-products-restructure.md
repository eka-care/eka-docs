# Landing products restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regroup developer.eka.care around five products, present EMR, IPD and Billing as Integrations, and move the solution pages to product pages, without redesigning the landing page.

**Architecture:** The landing page is edited only in `landing/source.html` and built into `snippets/landing.jsx`. Lighting and journey clicks key on docs item names (`plName`), so the regroup adds a landing-group map on top of the generated journey data `const J` instead of renaming items. The sidebar family rename goes through `scripts/build-nav.py`, which is idempotent on this tree (verified: a run on the unchanged branch produces no diff).

**Tech Stack:** Mintlify (`mint@4.2.1018`), plain JS and CSS in one HTML source, Python nav builder, Node checks.

**Spec:** `docs/superpowers/specs/2026-10-15-landing-products-restructure-design.md`

## Global Constraints

- Never hand-edit `snippets/landing.jsx`; run `node scripts/build-landing.mjs`.
- Every docs.json page appears exactly once; check by hand (`build-nav.py --check` does not enforce it here).
- `npm test` and `npm run docs:check` exit 0 (baseline: both pass, docs:check exit 0).
- No em dashes; second person, present tense; no marketing.
- Nothing deleted: moves carry redirects. The only new page is `docs/products/agents.mdx`.
- "In your app" never appears on the Integrations strip, its menu column, or the tooltip for an item in that strip.

## Review Focus

- Saved Assemble state in localStorage from the old page (`eka-assemble-<scene>`) must still restore, so scene keys `mr px ci abdm all` stay unchanged. Pinned by keeping the keys; checked in Task 4 by clipping parts, reloading, and seeing them restored.
- A part clipped in a scene must light every grid item with that product name, in both a product cell and the Integrations strip, with the badge text right for each. Checked in Task 4.
- A grid item whose docs item has no journey (no `J` entry) must keep its plain link behaviour. Checked in Task 4 by clicking an item mapped to a missing journey.
- Old `/docs/solutions/...` URLs, bookmarked or linked from outside, must land on the moved page. Checked in Task 1.
- Phone width: the seven-group journey picker and the Integrations strip must not overflow horizontally. Checked in Task 4 at 375px.

---

### Task 1: Product pages, redirects and get-started pages

**Files:**
- Move: `docs/solutions/patient-experiences-and-agents.mdx` to `docs/products/patient-experiences.mdx`
- Move: `docs/solutions/clinical-intelligence.mdx` to `docs/products/clinical-intelligence.mdx`
- Move: `docs/solutions/abdm.mdx` to `docs/products/abdm.mdx`
- Create: `docs/products/agents.mdx`
- Modify: `docs/solutions/scribe-and-medical-records.mdx` (title "Scribe with medical records", heading changes only)
- Modify: `docs.json` (redirects; Get started "Solutions" group becomes "Products")
- Modify: `docs/get-started/overview.mdx` ("Pick a solution" section), `docs/get-started/eka-products.mdx` (regroup headings)

**Interfaces:**
- Produces: URLs `/docs/products/{agents,patient-experiences,clinical-intelligence,abdm}`, used by Task 3's nav menu and grid.

- [ ] **Step 1:** `git mv` the three pages. In each, "## Products in this solution" becomes "## What you build with".
- [ ] **Step 2:** Rewrite the Patient experiences intro around the three stories: a doctor's website that books appointments, a patient-facing agent that triages, books and advises, and the patient's medical records. Title "Patient experiences". Cards: Agents (link `/docs/products/agents`), EMR appointments, Billing, Health Records, Models (health quiz). Steps unchanged.
- [ ] **Step 3:** Write `docs/products/agents.mdx`, `type: overview`, icon `robot`, title "Agents". Intro: an Eka agent is one you build and configure for a purpose; MedAssist is one ready-made agent. Cards: Echo Agent Kit, EMR MCP server, MedAI Tools MCP server, MedAssist, Synapse client SDK. Link to Patient experiences for the patient-facing agent. Same section shape as the other product pages; under 600 prose words.
- [ ] **Step 4:** Add redirects for the three moved URLs. Rename the sidebar group to "Products" and list: the three moved pages, `docs/products/agents`, `docs/solutions/scribe-and-medical-records`.
- [ ] **Step 5:** `overview.mdx`: "Pick a product" with five cards (Scribe to `/docs/scribe/overview`, the other four to `/docs/products/...`), then one paragraph "Connect your tools" linking EMR, IPD and Billing. `eka-products.mdx`: regroup existing cards under Scribe, Agents, Patient experiences, Clinical intelligence, ABDM, Integrations, Platform. Remove no cards.
- [ ] **Step 6: Verify.** `grep -rn "docs/solutions/\(patient\|clinical\|abdm\)" --include=*.mdx --include=*.json . | grep -v redirects` shows only redirect sources. Page-once check script (Task 2 Step 3) passes. On the dev server, each old URL redirects and each new URL returns the page.
- [ ] **Step 7: Commit** "Docs: solutions become product pages, and Agents gets an overview".

### Task 2: Information Management becomes Integrations in the sidebar

**Files:**
- Modify: `scripts/build-nav.py:120-121` (family name and description)
- Regenerated: `docs.json`, `api-sdk/index.mdx`, `api-reference-link.js`, `landing/source.html` (`const J` key)
- Modify: `snippets/glossary/emr.mdx` (anchor `#integrations`), `docs/get-started/glossary.mdx` (heading and description), `styles.css:239` (comment)

**Interfaces:**
- Produces: `J["Integrations"]` with items EMR, IPD, Billing, Health Records. Task 3 reads it.

- [ ] **Step 1:** Family `'Integrations'`, description "Read patients, visits, admissions and payments from Eka's EMR into your own tools." Leave the icon.
- [ ] **Step 2:** `python3 scripts/build-nav.py`. Expect the diff limited to the family name, its description, the `## Integrations` heading in the API index, and the `const J` key.
- [ ] **Step 3: Page-once check.** Run a one-off Python snippet that walks `docs.json` navigation pages and asserts no duplicates and that the page set equals the set before this task plus Task 1's changes.
- [ ] **Step 4:** Update the glossary heading, its description line, the EMR glossary anchor, and the stylesheet comment.
- [ ] **Step 5:** `npm test` and `npm run docs:check` exit 0.
- [ ] **Step 6: Commit** "Docs: Information Management becomes Integrations".

### Task 3: Landing page regroup

**Files:**
- Modify: `landing/source.html` (CSS tints and strip near lines 361-370 and 500-507; nav markup near 552; Assemble lede line 565; products section 588-631; `SCENES` names, `who` and `journey`; unlock block near 1230; journey block near 1250; nav menus near 1290)
- Regenerated: `snippets/landing.jsx`

**Interfaces:**
- Consumes: `J` keyed by docs family then item (Task 2); product page URLs (Task 1).
- Produces: `GROUPS`, an ordered object from landing group name to `[[docsFamily, item, label?], ...]`; `GROUP_OF`, cell id to group name; `plName(a)` returns `a.dataset.item` when set, else the bold text.

- [ ] **Step 1: Grid markup.** Section heading "What you can build", lede on building with the five products and connecting your tools. Cells, two per row, ids and items:
  - `#p-scribe` Scribe: Scribe.
  - `#p-agents` Agents: Agents (data-item Agents, label "Agent Kit and MCP servers"), MedAssist label linking `/docs/agents/medassist` with data-item Agents.
  - `#p-px` Patient experiences: Appointments (data-item EMR, link `/docs/emr/appointments`), Payments (data-item Billing), Health Records, Agents (label "Patient agent").
  - `#p-ci` Clinical intelligence: Models, Datasets.
  - `#p-abdm` ABDM: HIE-CM, NHCX, UHI (unchanged items).
  - `#p-platform` Platform: unchanged items.
  - `#integrations` strip spanning both columns, below the grid: EMR, IPD, Billing, with badge text "Connected" and a one-line promise about reading data into a CRM or dashboard.
  Sketches: reuse `fam_ai` for Scribe and Clinical intelligence, `fam_im` for Integrations, `fam_abdm`, `fam_platform`; Agents and Patient experiences reuse `fam_ai` and `fam_im` unless a new sketch is quick. Rows become three: `.xn` at 0, 33.333%, 66.667%, 100%; `.gnode` at the same; two `.fmid` lines.
- [ ] **Step 2: CSS.** Per-cell `--fam` tints, light and dark, in all three theme blocks: Scribe `#7C5CFF`/`#A08CFF`, Agents `#0E9F8E`/`#3CC9B6`, Patient experiences `#D6407A`/`#F27BA6`, Clinical intelligence `#5B6CFF`/`#8C98FF`, ABDM and Platform unchanged, Integrations `#215FFF`/`#6B93FF`. `.fstrip` spans both columns, centred items laid out in a row, stacks at the existing narrow breakpoint.
- [ ] **Step 3: Scenes.** `mr` name "Scribe", `px` "Patient experiences", `ci` and `abdm` unchanged, `all` unchanged. `journey` values become landing group names: `["Scribe","Scribe"]`, `["Patient experiences","Agents"]`, `["Clinical intelligence","Models"]`, `["ABDM","HIE-CM"]`, `["Platform","Get started"]`. Assemble lede distinguishes building parts from connecting EMR data.
- [ ] **Step 4: Lighting.** `whyOf(p, connected)` returns `Connected: …` when `connected` is true. `markWhy` passes `!!el.closest("#integrations")`. `.live` text comes from markup, so no script change.
- [ ] **Step 5: Journey.** `render()` lists `Object.keys(GROUPS)` in `.jfam`; items are `GROUPS[group]` filtered to entries whose `J[fam][item]` exists; tabs show `label || item` and carry `data-prod=item`. `journeyGo(group, item)`. Grid clicks use `GROUP_OF[cell.id]`. Keep `const J` untouched so `build-nav.py` keeps writing it.
- [ ] **Step 6: Nav.** Button "Solutions" becomes "Products", listing `all` plus the five products with `SCENE_SVG` icons for the four scenes and the bot icon for Agents; links to Scribe overview and `/docs/products/...`. Button "Products" becomes "Integrations", built from `#integrations` and `#p-platform` only. Update the block comments.
- [ ] **Step 7:** `node scripts/build-landing.mjs`. Expect no error.
- [ ] **Step 8: Commit** "Landing: products first, Integrations as their own strip".

### Task 4: Verify in the browser

- [ ] **Step 1:** Dev server, landing page, no new console errors.
- [ ] **Step 2:** Screenshots light and dark at desktop and 375px; no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 3:** Clip the appointment part in Patient experiences: Appointments in `#p-px` shows "In your app", EMR in `#integrations` shows "Connected", tooltips match. Reload: parts restore.
- [ ] **Step 4:** Click each nav item, carousel tile, grid item and journey group; every link returns a page.
- [ ] **Step 5:** `grep -o "In your app" snippets/landing.jsx` appears only inside product cells; none inside the `#integrations` block.

# Landing page: products first, Information Management as integrations

Date: 2026-10-15
Status: draft for review
Repo: eka-care/eka-docs (Mintlify site at developer.eka.care)
Source files: `landing/source.html` (built into `snippets/landing.jsx` by `scripts/build-landing.mjs`), `docs.json` (rebuilt by `scripts/build-nav.py`, which also writes the landing journey data `const J` into the source), `docs/solutions/*.mdx`, `docs/get-started/overview.mdx`, `docs/get-started/eka-products.mdx`.

## 1. Intent

A developer landing on developer.eka.care should see two things at a glance: what Eka offers them to build, and how to connect the tools they already have to Eka. Today the page's primary grouping is by internal product family (AI, Information Management, ABDM, Platform), and the four "solutions" are a secondary menu. The CEO's direction, relayed by the docs owner:

- What the site calls solutions are really the products. They become the primary grouping.
- The Information Management side (EMR, IPD, Billing) is not something an outside developer builds an EMR on top of. A developer pulls that data into their own tools: a CRM showing a patient's details, a dashboard counting the day's prescriptions. Treat these as integrations, not construction blocks.
- One exception: the appointment API is genuinely build-with. A clinic on Eka's EMR can build a website that books appointments through it. It belongs under Patient experiences.
- Patient experiences means: a doctor's website that books appointments, a patient-facing agent that triages, books and advises, and storing and managing the patient's medical records.

## 2. Goals

1. The landing page's primary grouping is five products: Scribe, Agents, Patient experiences, Clinical intelligence, ABDM.
2. EMR, IPD and Billing appear under a second, clearly separate promise: connect your tools to Eka's data.
3. The four solution pages become the product overview pages, with their old URLs redirected.
4. Everything the page already does (constellation hero, Assemble carousel and stage, family grid sketches, journey panel, nav mega menus, dark mode, reduced motion) keeps working. This is a regroup and relabel, not a redesign.

## 3. Non-goals

- No new visual design, no new sections, no new CSS system. Existing components are reused with new content.
- No change to any product's documentation ladder or API reference.
- No restructuring of the docs sidebar beyond the one rename in section 6 (if approved). The docs.json product switcher keeps its four families for this project.
- No new user-visible pages except one: the Agents overview at `/docs/products/agents`, approved by the owner. The other product overview pages are the existing solution pages, moved.

## 4. Anti-goals

- The hero or any tile implying a developer can build their own EMR on Eka. "In your app" must not appear on the Integrations tier (the EMR, IPD and Billing cards, their mega menu column, and the `whyOf` tooltip for `im` parts, which says "Connected:" instead). Inside the Patient experiences cell, the appointment and payment-link items are build-with and do carry "In your app".
- A nav that still says Solutions. The word goes.
- Breaking the Assemble scenes: they are the page's proof that the parts fit together and must keep their EMR parts, relabelled.
- Deleting content. The scribe-and-medical-records page is kept (section 7), not removed.

## 5. The new structure

### 5.1 Tier one: Products ("What are you building?")

| Product | Promise (one line) | Landing link | Docs items it draws on |
|---|---|---|---|
| Scribe | Consultations become structured notes | `/docs/scribe/overview` | Scribe |
| Agents | Agents you build and configure for a purpose, with Agent Kit, MCP servers and MedAssist | `/docs/products/agents` (new page, approved by the owner on 2026-10-15) | Agents |
| Patient experiences | A doctor's site that books, a patient agent that triages and advises, records the patient keeps | `/docs/products/patient-experiences` | Agents (Agent Kit, MedAssist), EMR appointments, Billing payment links, Health Records |
| Clinical intelligence | Parsing, codification, assessments and medical datasets | `/docs/products/clinical-intelligence` | Models, Datasets |
| ABDM | ABHA, consent and record exchange, plus claims and UHI | `/docs/products/abdm` | HIE-CM, NHCX, UHI |

The Agents and Patient experiences overlap is settled as: the patient-facing agent is a Patient experiences story; Agents is the toolkit it is built with. Each page links to the other.

### 5.2 Tier two: Integrations ("Connect your tools to Eka")

| Item | Promise | Link |
|---|---|---|
| EMR | Read patients, visits and prescriptions into your CRM or dashboard | `/docs/emr/patients` |
| IPD | Admissions, beds and discharges | existing IPD link |
| Billing | Charges, invoices and payments | `/docs/billing/payments` |

Health Records moves out of this tier into Patient experiences. The appointment API is reachable from Patient experiences; the EMR integration card may mention it but does not claim it.

### 5.3 Tier three: Platform

Unchanged: keys, auth, webhooks, encryption, SDKs, all APIs.

## 6. Changes by surface

### 6.1 Nav (landing page's own nav in `landing/source.html`)

- Menu "Solutions" is renamed "Products" and lists the five products plus "The whole platform" (wide item, as today). Links per 5.1.
- Menu "Products" is renamed "Integrations" and shows two columns: Integrations (EMR, IPD, Billing) and Platform (the existing Platform column).
- Menu "Resources" is unchanged.
- The menus are built by script from the family grid today (`prod.innerHTML` mirrors `.fgrid .fcell`). The builder keeps that mirroring or replaces it with a small static list; either is fine as long as the result matches this section.

### 6.2 Hero carousel and Assemble stage

- Scene tiles become the five products plus "The whole platform". Scene keys stay (`mr` becomes Scribe, `px` Patient experiences, `ci`, `abdm`, `all`). Names and `who` lines update to the promises in 5.1.
- The `mr` scene is renamed "Scribe" and keeps its parts; its EMR and Health Records parts stay in the scene.
- The `px` scene is renamed "Patient experiences". Its parts stay (appointments, payments, reports, agent), which already matches the CEO's definition.
- Every part whose family is `im` (EMR, IPD, Billing) keeps its product tag but any badge or caption that says "In your app" changes to "Connected" for integration items. Health Records parts carry the Patient experiences product label, not Information Management. My call: "Connected". The builder may pick a shorter word if the badge wraps.
- The lede under "What are you building?" changes from "Each part is one Eka API: clip it into the app" to wording that distinguishes building (the product's parts) from connecting (the EMR parts). One sentence each.

### 6.3 "Where each part lives" grid

- Heading becomes "What you can build" (my call; builder may adjust to match the voice of the page).
- Cells: the five products and Platform fill three rows of the existing two-column grid (Scribe, Agents / Patient experiences, Clinical intelligence / ABDM, Platform). Integrations is one full-width strip below the grid, reusing the cell styles but spanning both columns. My call: spanning is what makes it read as a different tier, and it keeps the tether nodes and `xn` markers on whole rows (three rows instead of two).
- Sketches: `fam_ai` is reused for Clinical intelligence, `fam_im` for Integrations, `fam_abdm` for ABDM, `fam_platform` for Platform. Scribe, Agents and Patient experiences get new sketches in the same hand-drawn style, or the builder reuses a scene icon at sketch size if drawing three new sketches is out of budget. Builder's call; say which in the PR.
- Each product cell lists the docs items it draws on (5.1, last column) as `.pl` links, which is what the journey panel and the Integrations mega menu read.
- `.live` badge text: "In your app" on product cells, "Connected" on the Integrations strip.
- Colour: each product cell gets its own `--fam` tint in light and dark, five new values in the same saturation range as the existing four, set per cell id as today. Integrations keeps the Information Management blue, Platform keeps its tint. My call: adding tint tokens is not a new CSS system; three purple cells would make the products indistinguishable. Builder picks the values. Assemble parts keep their family colour, so an `im` part inside the Patient experiences scene stays blue.

### 6.4 Journey panel ("Your path, step by step")

- Today the first picker is the docs.json family (`FAM_OF`), the second is the item, and `const J` is written by `scripts/build-nav.py` from docs.json.
- `const J` stays as it is, keyed by docs.json family and item. The landing adds one static map from landing group to docs items, for example Patient experiences to `[["AI","Agents"],["Information Management","EMR"],["Information Management","Health Records"]]`. The first picker shows the seven landing groups; the second shows the mapped items. `build-nav.py` is not changed for this, so the journey data keeps regenerating from the sidebar.
- The lede "Pick a product. Its steps follow its docs" still holds.

### 6.5 Solution pages become product pages

- `docs/solutions/patient-experiences-and-agents.mdx` moves to `docs/products/patient-experiences.mdx`, title "Patient experiences". Its intro is rewritten to the CEO's three stories (booking site, patient agent, the patient's records). "Products in this solution" becomes "What you build with" and lists Agents, EMR appointments, Billing payment links, Health Records.
- `docs/solutions/clinical-intelligence.mdx` moves to `docs/products/clinical-intelligence.mdx`. Same heading change.
- `docs/solutions/abdm.mdx` moves to `docs/products/abdm.mdx`. Same heading change.
- New page `docs/products/agents.mdx`, title "Agents", in the same shape as the other product pages. Its intro says what an Eka agent is: something you build and configure to suit a purpose, not MedAssist alone. "What you build with" lists Echo Agent Kit, the MCP servers (EMR, MedAI tools), MedAssist and its client SDKs. It links to Patient experiences for the patient-facing agent story, and Patient experiences links back. This page is named in the PR body as the one new page.
- `docs/solutions/scribe-and-medical-records.mdx` is kept at its URL as a worked example ("Scribe with medical records") and linked from the Scribe overview page. It is not a product page and not in the Products menu. Reason: Scribe already has its own overview at `/docs/scribe/overview`, and the page's value is showing Scribe writing into the record.
- Redirects in `docs.json` from each old `/docs/solutions/...` URL to the new one.
- The "Solutions" group in the Platform > Get started sidebar (docs.json around line 5448) is renamed "Products" and lists the three moved pages, the new Agents page and the kept scribe-and-medical-records page. The Scribe overview is not added there, since it is already listed under AI > Scribe and every page appears once. Note: `build-nav.py --check` does not enforce the once-only rule on this repo (it skips the check when `products` already exists), so the builder checks by hand.

### 6.6 Get-started pages

- `docs/get-started/overview.mdx` section "Pick a solution" becomes "Pick a product" with five cards matching 5.1, followed by a short "Connect your tools" paragraph linking EMR, IPD and Billing.
- `docs/get-started/eka-products.mdx` regroups its cards under the same seven headings as the landing grid (five products, Integrations, Platform) instead of Health AI / MCP / Core EMR / Interoperability. No cards are removed.

### 6.7 docs.json product switcher

The sidebar's four families stay for this project. Approved by the owner on 2026-10-15: "Information Management" is renamed "Integrations" in `scripts/build-nav.py` (the family is defined there, around line 120) and regenerated into docs.json, with its description changed from "kept in one record your system reads and writes" to a reading-data-out promise. Health Records stays in that family in the sidebar (moving it would need a sidebar restructure that is out of scope); only the landing page presents it under Patient experiences. `FAM_OF` and the landing group map in 6.4 use the new family name.

## 7. Constraints

- The landing page is edited in `landing/source.html` only, then built. `snippets/landing.jsx` is never hand-edited.
- `python3 scripts/build-nav.py --check` must pass: every page listed today appears exactly once afterwards.
- `npm run docs:check` and `npm test` pass.
- Mintlify dev server renders the landing page with no new console errors, in light and dark mode, at phone width.
- Writing style per the repo's eka-docs-contributor writing-style skill: second person, present tense, no marketing, no em dashes.
- Nothing is deleted. Moves are moves with redirects.

## 8. Left to the builder

- Exact wording of ledes, cell copy and badge text, within the promises in section 5.
- Whether to draw three new sketches or reuse icons (6.3).
- Whether the nav mega menus stay generated from the grid or become a static list (6.1).
- The order of the five products in the carousel and grid. Default: Scribe, Agents, Patient experiences, Clinical intelligence, ABDM.
- How the Integrations cell is visually distinguished from product cells (a different tagline colour, or the existing `--fam` tint). It should read as a different kind of thing without a new component.

## 9. Verification

- Screenshot of the landing page top to bottom in light and dark, desktop and phone, attached to the PR.
- Click through: each nav item, each carousel tile, each grid link, each journey step resolves to a 200 page on the dev server.
- Old solution URLs redirect.
- `grep "In your app"` on the built landing shows the badge only on product cells and the Patient experiences items, never on the Integrations strip or its menu column.

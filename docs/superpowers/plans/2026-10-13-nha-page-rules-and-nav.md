# NHA page rules, quick-win quickstart, glossary, clickable sections, icons

**Goal:** Bring the ABDM portal's page rules (word budgets, In short, sentence limits) into the contributor plugin and the check, apply them to the 36 ABDM Connect pages, rebuild the quickstart as a quick win like docs.abdm.gov.in's "first fifteen minutes", add a glossary, make section titles the pages themselves, and give every sidebar item an icon.

This reverses one call from the first design: word budgets and "In short" were stripped at the start; they come back now at the user's request.

## Rules adopted (from abdm-contributors-assistant page-authoring)

| Rule | Limit | Check tier |
|---|---|---|
| Prose budget: overview 600; journey, workflow, quickstart, testing, guide 700; reference, errors, webhooks, changelog none | counted over prose only | warn |
| `## In short`, 3 to 5 bullets, answer first | required above 300 prose words, banned below | warn |
| Sentence length | 25 words warn, 35 words fail | warn / fail |
| Sentences per paragraph | 5 | warn |
| Em dash | none | fail |
| First heading called Introduction or Overview | not allowed | fail |

Over budget means too wide: split the page or move scope to an existing page; never compress sentences to fit. A split that creates a new page is proposed, not done, because new pages need the user's OK.

## Baseline (2026-10-13)

7 of 36 pages over budget (create-abha-aadhaar-otp 998, hip-discovery-and-link 788, phr-patient-aggregates-records 787, uhi-book-consultation 775, manage-profile-and-kyc 741, hiu-request-consent 721, phr-act-on-consent 703); 33 need In short; 5 sentences over 35 words; 63 over 25; 0 em dashes.

## Tasks

1. Plugin and check (main session): skills `docs-strategy`, `writing-style`, `writing-journeys`, `writing-workflows`, `writing-quickstart`; `scripts/docs-check.mjs` rules `budget`, `in-short`, `sentence`, `em-dash`, `first-heading` with tests; plugin 0.2.0.
2. Navigation (main session): `scripts/build-nav.py` sets a group's `root` to its landing page (removed from `pages`), and gives every group and every non-endpoint page an icon (endpoint pages keep Mintlify's method badge).
3. Content, three writers in parallel: In short on every page above 300 words, sentences over 35 words split, scope moved off over-budget pages; split proposals reported.
4. Quickstart writer: rebuilt on the first-fifteen-minutes shape using the Mintlify Try it playground (the pattern `docs/scribe/authenticate-and-try.mdx` already uses).
5. Glossary writer: `docs/get-started/glossary.mdx`, terms and definitions only from repo pages, linked from Platform > Get started and HIE-CM.
6. Verify: check, MDX compile, preview; commit.

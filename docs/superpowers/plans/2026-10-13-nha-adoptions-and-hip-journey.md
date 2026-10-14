# NHA portal adoptions and the first ABDM Connect journey

**Goal:** Fold four structural borrowings from docs.abdm.gov.in into the contributor plugin, then write the first ABDM Connect journey page with its workflow stubs so the ladder has a real rung 2 and rung 4.

**Spec:** `docs/superpowers/specs/2026-10-13-eka-docs-contributor-design.md`; audit `docs/superpowers/audits/2026-10-13-abdm-connect-gap-report.md`; the comparison with docs.abdm.gov.in in the session of 2026-10-13.

**Constraints:** No new page types. No "In short" blocks, no word budgets. Plugin files stay `.md`. Every workflow stub's `operations` must exist in `registration.yml` or the check fails. Branch `feat/eka-docs-contributor`.

## Task 1: Plugin adoptions (version 0.1.2)

- `skills/writing-journeys/SKILL.md`: section 1 "Who and when" gains a mandatory "Already in place" line: the role the integrator plays and the journeys that must have run. Rule added: a journey that depends on another names it there, never silently. Worked example updated.
- `skills/docs-strategy/SKILL.md`: overview rung description gains "a one-patient narrative across the journeys, I-want-to goal cards linking each journey, a role to journeys table". Errors rung gains "and a By symptom section". A "Build it well" page is named as a recommended `guide`.
- `skills/api-referencing/SKILL.md`: errors page section describes "By symptom": symptom, likely cause, what to check, codes involved.
- `commands/product-new.md`: scaffold text for overview (narrative, goal cards, role table) and errors (By symptom heading).
- Bump `plugin.json` to 0.1.2. Validate. Commit. `claude plugin marketplace update eka-docs && claude plugin update eka-docs-contributor`.

Check: `claude plugin validate --strict` passes; `grep -l "Already in place"` finds the skill.

## Task 2: Journey page and workflow stubs

- Create `docs/hie-cm/journeys/hip-register-patient-and-link-visit.mdx`, type `journey`, persona "Clinic receptionist", with the five sections, role and prerequisite stated, every API step linking a workflow.
- Create stubs under `api-reference/user-app/abdm-connect/workflows/` for: `login-abha`, `create-abha-aadhaar-otp`, `create-abha-mobile-otp`, `create-abha-face-auth`, `link-care-context-hip`, `serve-data-on-fetch`, `hip-scan-and-share`, `hip-discovery-and-link`. Each: full frontmatter (`journey`, `operations` from the audit table using the spec's exact paths, `webhooks` from the spec's keys), the seven section headings, one italic placeholder line each. The two that belong to other journeys (`hip-discovery-and-link`, `hip-scan-and-share`) point `journey` at this one for now with a TODO comment, since their journeys do not exist yet.
- `docs.json`: under the ABDM Connect group, add "Journeys" (icon `route`) and "Workflows" (icon `diagram-project`) groups after Overview.
- Overview page: add a "Journeys" section with the role to journeys table (HIP, HIU, PHR app, facility admin) linking the one journey that exists and the M2/M3/M4 guide pages otherwise, and three "I want to…" cards.

Check: `npm run docs:check abdm-connect` shows 0 failures; the `[workflow]` rule reports nothing; `[journey]` reports nothing for this journey. Commit.

## Task 3: Report

Branch commits, check numbers before and after, and the next command (`/workflow-new abdm-connect create-abha-aadhaar-otp`).

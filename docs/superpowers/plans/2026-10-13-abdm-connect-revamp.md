# ABDM Connect revamp: content

**Goal:** Every journey and workflow in the gap report written to the ladder, plus quickstart, webhooks, testing, changelog and errors-by-symptom, with `docs-check abdm-connect` at 0 failures.

**Sources:** `docs/superpowers/audits/2026-10-13-abdm-connect-gap-report.md` (sections 2, 3, 6), plugin skills `writing-journeys`, `writing-workflows`, `writing-quickstart`, `api-referencing`, `writing-style`, the spec `api-reference/user-app/abdm-connect/registration.yml`, and the existing guide pages each workflow absorbs.

**Out of scope (separate project):** moving the product folder, regrouping the 105 reference pages by tag, redirects, retiring the old guide pages. Old pages stay live and unchanged; the new pages link to them where useful.

## Rules every writer follows

- Facts come only from the spec and existing pages in this repo. Where a fact is missing (retention time, retry rule, sandbox test value, what to do on an error), write `{/* TODO: confirm: <question> */}` in place and list it in the report. Never invent a code, field, interval or test value.
- Workflow `operations` use the spec's exact `METHOD /path`; `webhooks` use the spec's event keys. Run `node scripts/docs-check.mjs abdm-connect` (never `--fix`) and fix any line naming your files.
- Links are site paths: `/api-reference/user-app/abdm-connect/...`. Reference pages are linked by their existing path.
- MDX safety: no bare `{` or `<` in prose; code and placeholders in backticks.
- Write only your own files. Do not edit `docs.json`, the spec, or any page outside your list.

## Tasks (parallel)

| Group | Journey pages | Workflow pages |
|---|---|---|
| A. M1 identity | (journey exists) | create-abha-aadhaar-otp, create-abha-mobile-otp, create-abha-face-auth, login-abha, hold-gateway-session, manage-profile-and-kyc |
| B. M2 HIP | hip-answer-discovery | link-care-context-hip, serve-data-on-fetch, hip-scan-and-share, hip-discovery-and-link |
| C. M3 consent | hiu-fetch-records-with-consent | hiu-request-consent, hiu-receive-data, phr-act-on-consent, set-up-health-locker |
| D. PHR | phr-patient-aggregates-records | phr-discover-and-link, phr-list-records, phr-scan-and-share |
| E. M4 registry | facility-onboard-to-abdm | create-hpr-id, hpr-mobile-login, register-hfr |
| F. UHI | uhi-book-physical-consultation, uhi-scan-and-pay | uhi-book-consultation, scan-and-pay, blood-bank-search |

## Then (sequential, after A)

- G. `quickstart.mdx` (walks create-abha-aadhaar-otp), `webhooks.mdx`, `testing.mdx`, `changelog.mdx`, errors page "By symptom" section.
- H. `docs.json` groups, overview journey table and cards updated to the real journeys, `docs-check --fix` for Used in blocks (raw-text writer), review by `docs-reviewer`, commit.

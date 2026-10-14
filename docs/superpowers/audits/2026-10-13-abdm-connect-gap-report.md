# ABDM Connect gap report

Date: 2026-10-13. Product: `abdm-connect`. Root: `api-reference/user-app/abdm-connect/`. Manifest: `api-reference/user-app/abdm-connect/product.yaml` (`enforce: false`, `openapi: [registration.yml]`). Nothing was changed.

`npm run docs:check abdm-connect --json`: **54 fail** (4 ladder, 48 type, 2 reference), **120 warn** (2 ladder, 118 coverage).

## 1. The product in five lines

1. ABDM Connect is Eka's API layer over India's ABDM gateway: ABHA identity (M1), care-context linking and data serving (M2), consent and data fetch (M3), HPR/HFR registries (M4), plus a PHR-app track and three UHI services (blood bank, scan and pay, physical consultation).
2. 142 `.mdx` pages: 94 reference (bare `openapi:` form), 18 hand-written webhook pages, 4 milestone flow pages, 8 PHR guide pages, 16 sub-folder overviews/intros, 1 overview, 1 errors page. 141 of 142 are in `docs.json`.
3. One spec, `registration.yml` (OpenAPI 3.1, 105 operations, 2 servers, `authApiKey`). No other spec in the repo contains an `/abdm/` path; the two unresolved `openapi:` pages exist in no spec. The spec has **no `tags`, no `operationId`, no `webhooks` block**, and summaries on 23 of 105 operations.
4. Overview exists at `overview.mdx` (1,189 words, no `type`): good on ecosystem, roles, milestones, what to build; it links to the four flow pages and the PHR map. It is the right rung-1 page once typed.
5. Biggest gap: the functional knowledge exists, scattered across 28 untyped prose pages, and none of it is a `journey` or `workflow`; every operation is "in no workflow", and `webhooks:` frontmatter cannot resolve until the 16 events enter the spec.

## 2. Journeys, found and implied

No page has `type: journey`. These are implied by `overview.mdx` ("What Can You Build"), `phr/overview.mdx` ("The patient journey") and the flow pages.

| Journey slug (new) | Persona | Outcome | Source | Workflows it links |
|---|---|---|---|---|
| `hip-register-patient-and-link-visit` | Clinic/hospital receptionist on an HMS that is a HIP | Walk-in patient leaves with an ABHA, visit linked as a care context | `overview.mdx` M1+M2 cards; `flows/m1.mdx`; `flows/m2.mdx`; `care-contexts/getting-started.mdx` | create-abha-aadhaar-otp, create-abha-mobile-otp, create-abha-face-auth, login-abha, link-care-context-hip, serve-data-on-fetch, hip-scan-and-share |
| `hip-answer-discovery` | HIP integration engineer | Patient finds and claims the facility's old records from any PHR app | `care-contexts/discover/introduction.mdx` (HIP flow) | hip-discovery-and-link |
| `hiu-fetch-records-with-consent` | Insurer / specialist platform (HIU) | Patient's FHIR records arrive after consent | `overview.mdx` M3 card; `flows/m3.mdx`; `consents/getting-started.mdx` | hiu-request-consent, hiu-receive-data |
| `phr-patient-aggregates-records` | Patient using a PHR app | ABHA created, records from every facility pulled, consent managed, profile shared at counters | `phr/overview.mdx` stages 1-8 and all `phr/*.mdx` | create-abha-*, login-abha, hold-gateway-session, manage-profile-and-kyc, every `phr-*` workflow, set-up-health-locker |
| `facility-onboard-to-abdm` | Facility admin / HMS vendor onboarding a clinic | Doctor has HPR ID, facility has HFR ID, facility onboarded to Eka Bridge | `flows/m4.mdx`; `nhpr-abdm/getting-started.mdx`; `nhpr-abdm/onboarding-overview.mdx` | create-hpr-id, hpr-mobile-login, register-hfr, onboard-facility-to-eka |
| `uhi-book-physical-consultation` | Consumer app using UHI | Appointment booked and tracked | docs.json group "UHI > Physical Consultation" and 6 booking webhooks; no prose page | uhi-book-consultation (inferred) |
| `uhi-scan-and-pay` | Patient at a facility counter | Open bill selected and paid | `scan-and-pay/getting-started.mdx` | scan-and-pay (inferred) |

Blood bank is a single search, not a journey.

## 3. Workflows, found and implied

Operation lists use the spec's exact paths. "Lacks" is measured against the seven sections in `writing-workflows` (when/before/sequence/steps/state/fails/test). Every existing source lacks frontmatter `operations`, state table, failure table and test checklist unless noted.

| Slug (new) | Operations in order | Source page | What it lacks |
|---|---|---|---|
| `create-abha-aadhaar-otp` | POST /abdm/na/v1/registration/aadhaar/init → …/aadhaar/verify → (branch `mobile_linked` false) …/aadhaar/mobile/verify → …/aadhaar/create-phr; resends …/aadhaar/resend, …/aadhaar/mobile/resend; branch to …/aadhaar/auto-login when `skip_state=abha_create` and `abha_profiles` non-empty | `registration/intro.mdx` (Steps), `flows/m1.mdx` (flowchart), `phr/abha-onboarding.mdx` (table) | Has steps and the decision; no diagram, state, failures, test |
| `create-abha-mobile-otp` | POST /abdm/na/v1/registration/mobile/init → …/mobile/verify → …/mobile/create-phr; resend …/mobile/resend; helpers GET /abdm/na/v1/registration/suggest, POST /abdm/na/v1/registration/phr/check | same three pages | Same |
| `create-abha-face-auth` | POST /abdm/na/v1/face-auth/init → poll …/face-auth/capture until `Verified` → …/face-auth/verify → then create-phr | `enrollment/face-auth/intro.mdx` (Steps + sequenceDiagram) | Closest to done; lacks state, failures, test, hand-off to create |
| `login-abha` | POST /abdm/na/v1/profile/login/methods → …/login/init → …/login/verify → …/login/phr (mobile route) or …/registration/aadhaar/auto-login (Aadhaar route) | `registration/intro.mdx`, `flows/m1.mdx` (three variants) | Three variants to merge as branches |
| `hold-gateway-session` | GET /abdm/v1/session/status → POST /abdm/v1/session/init → POST /abdm/v1/session/verify; `491` re-auth rule | `session/getting-started.mdx` | Prose only |
| `manage-profile-and-kyc` | GET/PATCH/DELETE /abdm/v1/profile, GET /abdm/v1/profile/asset/qr, …/asset/card, POST /abdm/v1/profile/search; KYC: POST /abdm/v1/profile/kyc/init → kyc/verify (kyc/resend) | `profile/getting-started.mdx`, `phr/profile.mdx` | Inferred; only KYC is a sequence |
| `phr-scan-and-share` | POST /abdm/v2/profile/share → GET /abdm/v2/profile/share/{request_id} | `scan-and-share/getting-started.mdx`, `phr/scan-and-share.mdx` (sequenceDiagram) | Poll interval and terminal state unspecified |
| `hip-scan-and-share` | webhook `abha.hip_profile_share` → POST /abdm/v1/hip/patient/profile/on-share | `webhooks/hip-scan-and-share.mdx` only | No flow page at all |
| `link-care-context-hip` | POST /abdm/v1/care-contexts/link → webhook `abha.link_care_context`; optional POST /abdm/v1/care-contexts/sms/notify | `care-contexts/getting-started.mdx`, `flows/m2.mdx` | Has the "data stored by Eka?" decision; no diagram, state, failures |
| `serve-data-on-fetch` | webhook `abha.hip_data_fetch` → (encrypt with `care-contexts/ecdh-encryption.mdx` or POST /abdm/v1/ecdh/encrypt) → POST /abdm/v1/hip/care-context/data/on-fetch | `care-contexts/getting-started.mdx`, `webhooks/hip-data-fetch.mdx` | ECDH endpoints have no page and are never mentioned |
| `hip-discovery-and-link` | webhook `abha.care_context_discover` → POST /abdm/v1/care-contexts/on-discover → webhook `abha.care_context_discover_link_init` → POST …/discover/link/on-init → webhook `abha.context_discover_link_confirm` → POST …/discover/link/on-confirm | `care-contexts/discover/introduction.mdx` (two Steps blocks) | Best prose in the product; lacks diagram, state, failures, test |
| `phr-discover-and-link` | GET /abdm/v1/providers (or GET /abdm/v1/provider/{hip_id}) → POST /abdm/v1/care-contexts/discover → …/discover/link/init → …/discover/link/confirm | `phr/discover-and-link.mdx` (sequenceDiagram), `discover/introduction.mdx` PHR flow | Diagram exists; lacks state (`txn_id`), failures, test |
| `phr-list-records` | GET /abdm/v1/care-contexts/providers → GET /abdm/v1/care-contexts/linked | `phr/records.mdx`, `care-contexts/getting-started.mdx` | Short; fine |
| `hiu-request-consent` | PATCH /abdm/v1/hiu/keyset (once) → POST /abdm/v1/consents/create → POST /abdm/v1/consents/list → POST /abdm/v1/consents/details → wait `abha.consent_update` | `consents/getting-started.mdx`, `flows/m3.mdx` | Keyset step prose-only; no diagram |
| `hiu-receive-data` | webhook `abha.hiu_data_push` → decrypt (`/abdm/v1/ecdh/decrypt` or library) → POST /abdm/v1/hiu/care-context/data/on-push; alternative GET /health/api/v1/fhir/retrieve (records product) | `consents/getting-started.mdx`, `phr/records.mdx`, `webhooks/hiu-data-push.mdx` | Cross-product call; link, do not list |
| `phr-act-on-consent` | GET /abdm/v1/requests → GET /abdm/v1/request → POST /abdm/v1/consents/approve or …/deny; later …/revoke | `consents/getting-started.mdx`, `phr/consents.mdx`, `patient-requests/getting-started.mdx` | Consent PIN operations (7, no pages) are an undocumented precondition |
| `set-up-health-locker` | GET /abdm/v1/consents/auto-approval → PATCH /abdm/v1/consents/auto-approval → webhooks `abha.locker_created`, `abha.subscription_notify`, `abha.subscription_modified` | `phr/consents.mdx` | Inferred; prose only |
| `create-hpr-id` | POST /abdm/nhpr/v1/hpr/aadhaar/init → …/aadhaar/verify → …/aadhaar/demo/verify → …/aadhaar/check/exist → (if none) …/aadhaar/suggest → …/aadhaar/create | `flows/m4.mdx`, `nhpr-abdm/getting-started.mdx` | Flowchart only; no paths, state, failures |
| `hpr-mobile-login` | POST /abdm/nhpr/v1/hpr/aadhaar/mobile/init → …/mobile/verify → …/aadhaar/check/available | `flows/m4.mdx` | Same |
| `register-hfr` | GET /abdm/nhpr/v1/hfr/search/{hfrId} → (if absent) POST /abdm/nhpr/v1/hfr/onboard → POST /abdm/nhpr/v1/hfr/link | `flows/m4.mdx`, `nhpr-abdm/getting-started.mdx` | Same |
| `onboard-facility-to-eka` | portal steps → POST /abdm/v1/hip/onboard | `nhpr-abdm/onboarding-overview.mdx` | One call; fold into `register-hfr` |
| `uhi-book-consultation` (inferred from paths) | POST /abdm/uhi/v1/physical-consultation/search/doctors → GET …/search/doctors (webhook `doctor.search.results`) → POST …/search/doctors/slots → GET …/slots (`doctor.slot.search.results`) → POST …/booking/init → GET …/booking/init (`booking.init`) → POST …/booking/confirm → GET …/booking/confirm (`booking.confirm`) → POST/GET …/booking/order-status (`booking.status`) → POST …/booking/update; cancel POST/GET …/booking/cancel (`booking.cancel`) | none | Everything; status pages use `/booking/status`, spec has `/booking/order-status` |
| `scan-and-pay` (inferred) | POST /abdm/v1/profile/scan-and-pay/patient-select → GET …/patient-select/{request_id} → POST …/open-order → GET …/open-order/{request_id} → GET …/transaction-details/{request_id} | `scan-and-pay/getting-started.mdx` (four generic steps, no links) | Steps name no endpoints; "Make Payment" has no operation |
| `blood-bank-search` (inferred) | POST /abdm/uhi/v1/blood-bank/search → GET …/search/{request_id} | `blood-bank/getting-started.mdx` | Links to a non-existent `bloodbank/` folder |

## 4. Orphans

**Operations with no page (13):** GET+POST /abdm/uhi/v1/physical-consultation/booking/order-status; POST /abdm/v1/consents/pin/{set,verify,change,reset,forgot/init,forgot/verify} and GET /abdm/v1/consents/pin/exists; POST /abdm/v1/ecdh/encrypt, POST /abdm/v1/ecdh/decrypt, GET /abdm/v1/ecdh/keys; POST /abdm/v1/profile/share (v1; v2 has pages).

**Pages whose operation is in no spec (2):** `phys-cons/order-status.mdx`, `phys-cons/get-order-status.mdx` (`/booking/status`; spec says `/booking/order-status`). Rename the `openapi:` line or the spec path; nothing else in the repo serves them.

**Operations in no flow description (beyond the 13 above):** POST /abdm/v1/profile/search, GET /abdm/v1/registration/pincode/{pincode}, POST /abdm/uhi/v1/physical-consultation/booking/update, GET /abdm/v1/provider/{hip_id} (mentioned only as a table row). `docs-check` reports all 105 as uncovered because no `workflow` page exists.

**Pages in no docs.json group (1):** `enrollment/aadhaar/getting-started.mdx` (also empty: zero words, no title).

**Hand-written schemas:** none (`<ParamField>`/`<ResponseField>` absent). The 18 `webhooks/*.mdx` pages each carry a hand-written JSON payload and headers; they are the only description of 16 distinct events (names in each page's `"event"` field; `abha.*`, `doctor.*`, `booking.*`). The spec's `webhooks` block is empty, so any `webhooks:` frontmatter on a workflow would warn today.

**Spec quality:** no `operationId` on any operation and no `tags`, so `docs-check --fix` would create the 13 missing pages under `endpoints/` with slugs like `post-abdm-v1-consents-pin-set`. Add tags and operationIds before the first `/api-sync`.

**Stale specs:** none. `registration.yml` is the only spec with ABDM paths; its filename is misleading for a 105-operation product surface.

**Broken outbound links:** `blood-bank/getting-started.mdx` → `/api-reference/user-app/bloodbank/*` (no such folder). `flows/m1.mdx` → `/api-sdk/auth/client-login` labelled "Session API" (it is the partner token, not the ABHA session).

**Untyped pages:** all 48 non-reference pages (every page without `openapi:`).

## 5. Proposed tree

Product stays at `api-reference/user-app/abdm-connect/` (manifest gains `root:` if the check needs it; the folder move is its own project). Paths below are relative to the root. "→" is an existing page's new path; every move needs a redirect in `docs.json`.

```
overview.mdx                        type: overview   (existing; add type)
quickstart.mdx                      type: quickstart NEW
journeys/
  hip-register-patient-and-link-visit.mdx   NEW
  hip-answer-discovery.mdx                  NEW
  hiu-fetch-records-with-consent.mdx        NEW
  phr-patient-aggregates-records.mdx        NEW  (absorbs phr/overview.mdx)
  facility-onboard-to-abdm.mdx              NEW  (absorbs nhpr-abdm overviews)
  uhi-book-physical-consultation.mdx        NEW
  uhi-scan-and-pay.mdx                      NEW
workflows/
  create-abha-aadhaar-otp.mdx     ← registration/intro.mdx (Aadhaar section) + flows/m1 + phr/abha-onboarding
  create-abha-mobile-otp.mdx      ← registration/intro.mdx (mobile section)
  create-abha-face-auth.mdx       ← enrollment/face-auth/intro.mdx  (move + type: workflow)
  login-abha.mdx                  ← registration/intro.mdx (login section) + flows/m1
  hold-gateway-session.mdx        ← session/getting-started.mdx
  manage-profile-and-kyc.mdx      ← profile/getting-started.mdx + phr/profile.mdx
  phr-scan-and-share.mdx          ← scan-and-share/getting-started.mdx + phr/scan-and-share.mdx
  hip-scan-and-share.mdx          NEW
  link-care-context-hip.mdx       ← care-contexts/getting-started.mdx (linking section) + flows/m2
  serve-data-on-fetch.mdx         ← care-contexts/getting-started.mdx (data section)
  hip-discovery-and-link.mdx      ← care-contexts/discover/introduction.mdx (HIP half)
  phr-discover-and-link.mdx       ← phr/discover-and-link.mdx (+ PHR half of discover/introduction)
  phr-list-records.mdx            ← phr/records.mdx + providers/getting-started + patient-requests/getting-started
  hiu-request-consent.mdx         ← consents/getting-started.mdx (HIU section) + flows/m3
  hiu-receive-data.mdx            ← consents/getting-started.mdx (data section)
  phr-act-on-consent.mdx          ← consents/getting-started.mdx (PHR section) + phr/consents.mdx
  set-up-health-locker.mdx        ← phr/consents.mdx (auto-approval section)
  create-hpr-id.mdx               ← flows/m4.mdx (HPR) + nhpr-abdm/getting-started.mdx
  hpr-mobile-login.mdx            ← flows/m4.mdx
  register-hfr.mdx                ← flows/m4.mdx (HFR) ; fold onboard-facility-to-eka in, or keep separate
  uhi-book-consultation.mdx       NEW
  scan-and-pay.mdx                ← scan-and-pay/getting-started.mdx
  blood-bank-search.mdx           ← blood-bank/getting-started.mdx
api-reference/
  openapi.yaml                    ← registration.yml (rename; update product.yaml; rewrite 94 openapi: lines to file-prefixed form)
  <tag>/<operation>.mdx           ← the 94 reference pages, regrouped by the tags added to the spec
                                    (registration, login, face-auth, session, profile, scan-and-share, scan-and-pay,
                                     care-contexts, discovery, consents, consent-pin, ecdh, hip, hiu, providers,
                                     requests, hpr, hfr, uhi-consultation, blood-bank); 13 NEW pages via /api-sync
webhooks.mdx                      type: webhooks  NEW index; the 18 webhooks/*.mdx payloads move into the spec's
                                    webhooks block and the pages become one-line spec references or redirect here
errors.mdx                        type: errors    (existing; add type; add "what to do" column)
testing.mdx                       type: testing   NEW
build-with-ai.mdx                 type: build-with-ai  NEW (deferred per memory)
changelog.mdx                     type: changelog NEW
resources/
  ecdh-encryption.mdx             ← care-contexts/ecdh-encryption.mdx  type: resource
guides/  (type: guide, keep as redirect targets or delete)
  flows/m1..m4.mdx                → redirect to the matching journey; diagrams move into workflows
  phr/overview.mdx                → redirect to journeys/phr-patient-aggregates-records
  phr/webhooks.mdx                → redirect to webhooks.mdx
  enrollment/aadhaar/getting-started.mdx → delete (empty, unlisted), redirect to create-abha-aadhaar-otp
```

Redirects: 4 flows, 8 phr, 15 getting-started/intro, 18 webhook pages (if folded), 94 reference pages if regrouped, 1 empty page. Mintlify serves unlisted `.mdx`, so old reference paths stay live until the redirect PR lands.

## 6. Order of work

Prerequisite PR, no page changes: add `tags` and `operationId` to all 105 operations and a `webhooks` block with the 16 events in `registration.yml`; fix `/booking/status` vs `/booking/order-status`; set `type:` on the 48 untyped pages (overview, errors, 4 flows → guide, 16 getting-starteds → guide, 18 webhook pages → guide, 8 phr → guide). That alone clears 50 of 54 fails.

The three that unlock the most:

1. `/journey-new abdm-connect hip-register-patient-and-link-visit` — the HMS persona in `product.yaml`'s first audience; stubs seven workflows.
2. `/workflow-new abdm-connect create-abha-aadhaar-otp` — the worked example in both skills, richest existing source, and the first operations every integrator calls.
3. `/workflow-new abdm-connect link-care-context-hip` — M2 in one page plus the first `webhooks:` entry (`abha.link_care_context`), which proves the spec webhooks block.

Then, grouped by journey: M1 (`create-abha-mobile-otp`, `login-abha`, `hold-gateway-session`, `create-abha-face-auth`, `manage-profile-and-kyc`); M2 HIP (`serve-data-on-fetch`, `/journey-new hip-answer-discovery`, `hip-discovery-and-link`, `hip-scan-and-share`); M3 (`/journey-new hiu-fetch-records-with-consent`, `hiu-request-consent`, `hiu-receive-data`); PHR (`/journey-new phr-patient-aggregates-records`, `phr-discover-and-link`, `phr-act-on-consent`, `phr-list-records`, `phr-scan-and-share`, `set-up-health-locker`); M4 (`/journey-new facility-onboard-to-abdm`, `create-hpr-id`, `register-hfr`, `hpr-mobile-login`); UHI last (`/journey-new uhi-book-physical-consultation` + `uhi-book-consultation`, `/journey-new uhi-scan-and-pay` + `scan-and-pay`, `blood-bank-search`).

`/api-sync abdm-connect` runs once after the spec PR (creates the 13 pages, rewrites 94 `openapi:` lines, resolves the two `/booking/status` pages) and again after the last workflow (writes every "Used in" block). Write `webhooks.mdx`, `testing.mdx`, `changelog.mdx` by hand after step 3; `build-with-ai.mdx` stays deferred. Flip `enforce: true` when the check shows zero fails; coverage warnings on `profile/search`, `pincode`, `booking/update` and the consent PIN set are acceptable or need one more workflow (`consent-pin`).

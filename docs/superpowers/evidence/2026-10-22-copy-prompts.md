# Copy prompts: docs-only runs, 2026-10-22

No sandbox credentials were available, so each scene's full prompt (every part clipped) was walked through by the `eka-docs-contributor:integration-tester` agent using only the docs on this branch, with no API calls. This does not meet the spec's "run end to end against sandbox" gate.

## ABDM-enabled HIS (round 1): verdict "mostly"

- Prompt pages `docs/hie-cm/flows/m1`, `m2`, `m3` and `scan-and-share/getting-started` are diagrams or the patient-app (PHR) side. The buildable pages are the workflow pages in `docs/hie-cm/workflows/` (`login-abha`, `hip-scan-and-share`, `link-care-context-hip`, `serve-data-on-fetch`, `hiu-request-consent`, `hiu-receive-data`).
- The insurance claim link skips the setup chain on `docs/nhcx/getting-started`.
- The prompt doesn't say whether the HIS is a HIP, an HIU or both.
- Docs gaps that need Eka engineering to answer (left as TODOs on the pages):
  - `otp_system` per method;
  - which headers are required;
  - which `transaction_id` to echo, the checksum algorithm and the `dh_public_key` field;
  - the consent status values;
  - the units of `token.expires_at`;
  - integer vs string error codes;
  - whether webhook registration is self-service or "share the URL with Eka";
  - whether the signature header is always sent;
  - NHCX `auth_type` values and required headers;
  - no sandbox test data (test ABHA, HIP ID, approving a consent).
- Live `llms.txt` has no HIE-CM or NHCX entries.
- No broken links across the 18 pages read.

## Medical records from any source (round 1): verdict "mostly"

- Every call's method, path and auth is stated. The guesses sit in the joins and the callbacks.
- Prompt-level issues:
  - "Structured note" points at List Templates, but the note comes from Get Session (`templates[]`).
  - "Medical record" points at step 2 (`upload-records`) and skips `obtain-authorization`.
  - There is no Patient step, yet both record calls need `X-Pt-Id`.
  - "Sandbox credentials" is used with no sandbox host.
- Docs gaps:
  - which host takes sandbox credentials (`api.eka.care` vs `api.dev.eka.care`);
  - where a patient OID comes from;
  - whether `v2/docs?task=smart` also files the report on the record;
  - the parse-result in-progress response;
  - no Scribe webhook page (only legacy `v2rx.completed` in samples);
  - the `event_names` enum misses `rec.srp`, `rec.uploaded` and `v2rx.completed`;
  - the smart-report example lacks `data.data.fhir` and has a trailing comma;
  - `image/jpg` vs `image/jpeg`;
  - no signed-upload form example;
  - no Build with AI coverage for codification.
- Live `llms.txt` is stale (old `api-reference` paths, no document parsing entries).
- `upload-report.mdx` links create-overview for files over 10 MB, which isn't a Request Upload page.

## Patient experiences (round 1): verdict "no"

- Prompt-level issues:
  - "Reminders" points at `api-sdk/emr/notify/notify`, a push to the doctor's app. Patient reminders are the `appointment-reminder-instant` and `appointment-followup-reminder-instant` webhooks.
  - "Payments" points at a lone inbound webhook, with no outbound "create payment link" call.
  - "Patient agent" points at MedAssist, which the docs pitch as a doctor-facing LLM chat.
  - Five Build with AI links pull in large ABDM scope.
  - "Handle every callback" covers 20+ events and needs to name them.
- Docs gaps:
  - `docs/emr/appointment-api/getting-started.mdx` lists endpoint paths that exist in no spec (`/dr/v1/business/...`, check-in), and gives two different reschedule operations and an unnamed `{{HOST}}`;
  - auth header rules differ by product (`auth` vs `Authorization: Bearer` vs `x-agent-id`);
  - post_webhooks pages don't link registration, signing or retries;
  - the event list misses `receipt_payment.requested`;
  - notify's 200 response is a copy error;
  - list-records `offset` says nextPageToken but the field is `next_token`;
  - the agents host differs across the cURL, SDK and WebSocket pages;
  - PHR "share your endpoint with Eka" doesn't say how.
- Live `llms.txt` has no appointment, PHR or Build with AI entries.
- No broken links.

## Clinically intelligent HIS (round 1): verdict "mostly" for Scribe and knowledge search, "no" for MedAssist and the webhook

- Prompt-level issues:
  - "Ambient scribe" pointed at an overview.
  - "EMR agent" pointed at a consumer MCP setup page, not a build path (Agent Kit MCP integration).
  - The Build with AI lines added no facts.
  - "Handle every callback" was unbounded.
  - "Sandbox credentials" hides that three credentials are needed: a Bearer token, a MedAssist `agent-id`, and an EMR MCP login.
  - No page says how the four parts form one product.
- Docs gaps:
  - sandbox host unnamed (`api.dev.eka.care` appears only in specs);
  - `auth` vs `Authorization: Bearer`;
  - no Scribe webhook page, with two payload shapes and a legacy fetch path;
  - webhook status code, retries and `t=` tolerance unstated;
  - where MedAssist `x-agent-id` comes from;
  - MedAssist hosts inconsistent (`matrix` vs `api`, `api-ws` vs `matrix-ws`);
  - no MedAssist server-to-client message schemas;
  - `EndSessionRequest` body unclear;
  - medications search has no prose or valid combinations;
  - `EKA_API_KEY` optional or required.
- The plugin marketplace (`plugins/` and `.claude-plugin/marketplace.json`) 404s on `main` today, so Build with AI install steps fail until this branch merges.

## ABDM-enabled HIS (round 2): verdict "mostly"

- Fixed: the workflow pages replace the diagram and PHR pages, and the claim link reaches the NHCX getting-started chain.
- Not fixed: the prompt never says the HIS acts as a HIP and an HIU. It has no "serve records" step (`docs/hie-cm/workflows/serve-data-on-fetch`), which an HIS holding its own FHIR data needs.
- New docs findings:
  - the replay example on `docs/webhooks/webhook-signature.mdx` calls an undefined `generate_signature` and signs the current time, not the received `t`;
  - stale "No testing page exists yet" TODO comments on `hiu-request-consent` and `hiu-receive-data`;
  - "setup" is undefined on `docs/nhcx/getting-started`.

## Clinically intelligent HIS (round 2): verdict "mostly"

- Fixed:
  - the Scribe quickstart gives all five calls;
  - the Build with AI lines are removed;
  - the webhook line is bounded.
- The EMR agent target is fixed, but the MCP auth header `x-eka-jwt-payload` has no defined value. It also conflicts with `Authorization: Bearer` on `docs/agents/agent-kit/tools.mdx` and with browser OIDC on `remote-mcp.mdx`.
- The MedAssist link (`docs/agents/medassist`) is a concept page. The calls are on `/api-sdk/agents/overview`.
- New docs findings:
  - the `GenericAgent` snippet on `docs/agents/agent-kit/mcp-integration.mdx` lacks imports and runs `await` at top level;
  - the replay example on `docs/webhooks/webhook-signature.mdx` is broken (also found in the ABDM run);
  - `docs/emr/build-with-ai/mcp-server/authentication.mdx` uses a third auth endpoint and a different staging host (`api-dev.eka.care`).

## Medical records from any source (round 2): verdict "mostly"

- Fixed: "Structured note" now opens `get-session`, and "Medical record" now starts at `obtain-authorization`.
- Not fixed:
  - there is no Patient step, though `X-Pt-Id` is required;
  - the sandbox host is unnamed.
- New findings:
  - `api-sdk/health-records/obtain-authorization.mdx` has no link to step 2 (`docs/health-records/upload-records`);
  - no prompt page names the smart-report or record-uploaded webhooks;
  - the replay snippet on `docs/webhooks/webhook-signature.mdx` would reject every valid webhook, and the page never says to sign the raw body;
  - `split('=')` is fragile.

## Patient experiences (round 2): verdict "no"

- Fixed: Reminders now opens the reminder webhook, and the webhook line is bounded.
- Not fixed:
  - no API creates a payment link;
  - "Patient agent" still opens doctor-facing MedAssist, while the recipe says Echo Agent Kit;
  - the PHR link pulls in the whole PHR track.
- New findings:
  - Appointments skips Get Appointment Slots and Add Patient;
  - `docs/products/patient-experiences.mdx` still says notify and Billing;
  - the reminder and payment-link webhook specs don't name their triggers;
  - the Book Appointment example has a bad `video_connect.vendor` and an ambiguous epoch unit;
  - `event_names` misses the instant reminder events.

## Outcome after two rounds

- ABDM-enabled HIS, Medical records from any source and Clinically intelligent HIS: "mostly". Their prompts ship. What's left is docs gaps that need facts from Eka engineering, listed above.
- Patient experiences: "no". It ships no prompt. The panel links its Cookbook recipe until the payment-link API and the patient-facing agent are documented.
- None of this was run against sandbox. No credentials were available.

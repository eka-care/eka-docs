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

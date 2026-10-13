# ABDM Connect: open questions

346 questions. Every `{/* TODO: confirm: ... */}` left in the ABDM Connect pages, grouped by page. Answer one by editing the page at that spot and deleting the comment. Regenerate with:

```sh
grep -o 'TODO: confirm: [^*]*' api-reference/user-app/abdm-connect/{*.mdx,journeys/*.mdx,workflows/*.mdx}
```

## Ladder pages

### `quickstart.mdx` (7)

- [ ] the sandbox test Aadhaar number and OTP to use here, and link the testing page section that lists them.
- [ ] replace with a scrubbed sandbox response
- [ ] replace with a scrubbed sandbox response
- [ ] replace with a scrubbed sandbox response
- [ ] replace with a scrubbed sandbox response
- [ ] whether ABHA_ADDRESS includes the "@abdm" suffix on phr/check and create-phr. The create-phr schema example is "shyam.eka@abdm".
- [ ] replace with a scrubbed sandbox response

### `webhooks.mdx` (4)

- [ ] whether ABDM Connect events are registered through Register a webhook or by sharing the URL with Eka, and which event names or scopes to subscribe to.
- [ ] Eka's retry schedule, how many times it retries, and what happens after the last retry.
- [ ] whether the envelope's transaction_id stays the same across retries of one event, so you can use it to ignore a repeated delivery.
- [ ] the source description says booking.init carries the response of the order status API, but links Booking Init. Confirm it fires for Init.

### `errors.mdx` (10)

- [ ] the order of causes by frequency; support data was not available, so causes are listed in the order the workflow pages give them.
- [ ] how long to wait before offering resend.
- [ ] how many wrong attempts are allowed before ABDM-1100.
- [ ] other causes of 401 on ABDM Connect, such as a client not enabled for ABDM Connect, or a production token used against sandbox.
- [ ] how long a gateway session lasts, so you can renew it before it expires.
- [ ] poll interval and timeout.
- [ ] how long to wait for any event before treating it as lost.
- [ ] the status values Consent List and abha.consent_update return, and how long a request stays open before it expires.
- [ ] how a HIP learns that the HIU failed to decrypt or verify the checksum.
- [ ] the values data.error takes on ERRORED, what data.retry_count means, and whether Eka retries the link itself.

### `testing.mdx` (5)

- [ ] whether the same console client works against https://api.dev.eka.care, or sandbox needs separate credentials; and how a client is enabled for ABDM Connect.
- [ ] how a sandbox facility gets a HIP ID for testing, and whether Eka provides one.
- [ ] sandbox test values for each journey: Aadhaar numbers and their OTPs, mobile numbers, an existing ABHA address and ABHA number for login, a facility HFR ID, an HPR test professional, HIP and HIU ids for consent, and a UHI test doctor. None are published in these docs yet.
- [ ] how to approve a sandbox consent request as the patient, for example through the sandbox PHR app or a PHR app built on ABDM Connect.
- [ ] the go-live process for ABDM Connect: who signs off, whether ABDM certification is required for each milestone, and how production credentials are issued.

### `changelog.mdx` (1)

- [ ] whether /booking/status was ever served, so integrators know whether they must change anything.

## Journeys

### `journeys/facility-onboard-to-abdm.mdx` (1)

- [ ] does an HFR registered through the onboard API also wait for approval, and how does the HMS learn it was approved?

### `journeys/hip-answer-discovery.mdx` (1)

- [ ] when every record is already linked, should on-discover return an error or an empty patients list?

### `journeys/phr-patient-aggregates-records.mdx` (2)

- [ ] which workflow covers a PHR app reading record contents (raising a consent as HIU and receiving the FHIR data); the PHR slugs assigned to this journey do not include one.
- [ ] which workflow covers patient uploads through the Medical Records APIs; none exists in ABDM Connect.

### `journeys/uhi-book-physical-consultation.mdx` (4)

- [ ] does a UHI booking need the patient's ABHA session at all, or only the partner token? The spec lists X-Pt-Id, X-Partner-Pt-Id and X-Hip-Id as optional headers on every UHI call.
- [ ] is there an onboarding or registration step before an app can call the UHI physical consultation APIs?
- [ ] where and when does the patient pay for the consultation? The booking returns a payment status and type, but no payment call exists in the spec.
- [ ] does an initiated booking that is never confirmed expire on its own, or must the app cancel it?

### `journeys/uhi-scan-and-pay.mdx` (3)

- [ ] what must the facility's HMS have in place to answer Scan and Pay requests, and which journey covers that side?
- [ ] how does the facility counter learn that the payment succeeded: from Eka, from the payment provider, or from its own HMS?
- [ ] can the patient retry with the same request, or must they scan again?

## Workflows

### `workflows/blood-bank-search.mdx` (14)

- [ ] this workflow needs its own journey. Blood bank search is not a step or branch of booking a physical consultation; it points at uhi-book-physical-consultation only because every workflow must name a journey. Who is the persona, and is it a journey of its own?
- [ ] are X-Pt-Id, X-Partner-Pt-Id or X-Hip-Id needed for blood bank search? The spec marks all three optional. Does the user need to be logged in with an ABHA?
- [ ] the search_type value for a district search (the spec gives only location as an example).
- [ ] the accepted values for blood_group and blood_component.
- [ ] poll interval and timeout, and which status means the results are ready. No webhook is documented for blood bank search.
- [ ] where in message.catalog the name, address, contact, availability, distance and last-updated time sit.
- [ ] how long a request_id stays valid
- [ ] code
- [ ] code
- [ ] what causes FAILURE and what to do
- [ ] code
- [ ] how an empty result appears
- [ ] code and retry rule
- [ ] is blood bank search available on sandbox, and which state, district, blood group and component return results?

### `workflows/create-abha-aadhaar-otp.mdx` (18)

- [ ] does the abha.created webhook's data.partner_patient_id and data.hip_id echo the X-Partner-Pt-Id and X-Hip-Id headers sent on these calls? If so, say the headers are needed to match the webhook to the patient.
- [ ] how long to wait before offering resend, and how many resends are allowed before ABDM-1100.
- [ ] which call follows abha_select in the Aadhaar registration flow, auto-login with the chosen address or something else?
- [ ] can aadhaar/verify return abha_end directly, and in what case?
- [ ] the address format to send to phr/check and create-phr. The create-phr example is "shyam.eka@abdm"; confirm whether the "@abdm" suffix is required, optional or added by Eka.
- [ ] the skip_state value Auto Login returns on success (flows/m1 implies abha_end).
- [ ] does the integrator need to store or send token, refresh_token or eka.min_token on any later call, or does Eka hold the gateway session itself?
- [ ] the skip_state value Create returns on success (flows/m1 implies abha_end).
- [ ] Eka's webhook retry schedule and how many times it retries.
- [ ] how long a txn_id stays valid.
- [ ] whether transaction_id is the key to deduplicate webhook retries.
- [ ] which codes each operation in this workflow returns; the spec has no error examples for them, so the rows below are matched by the meaning on the errors page.
- [ ] how many wrong attempts are allowed before ABDM-1100.
- [ ] retry interval for ABDM-1022.
- [ ] what the integrator should do when EKA-1002 is returned.
- [ ] retry interval and whether the same txn_id can be reused after a 5XX.
- [ ] how long to wait for abha.created before treating it as lost.
- [ ] sandbox test Aadhaar numbers and OTPs, and link the ABDM Connect testing page once it exists.

### `workflows/create-abha-face-auth.mdx` (12)

- [ ] which create call follows face-auth/verify. The spec and pages do not say. Evidence for aadhaar/create-phr: face-auth/verify returns the same txn_id, skip_state, abha_profiles and eka shape as aadhaar/verify, and flows/m1 draws "Verify, then Mobile linked with Aadhaar?, then Create ABHA" for face auth exactly as for Aadhaar OTP. Confirm the endpoint, and whether the mobile branch uses aadhaar/mobile/verify and aadhaar/mobile/resend; if so, add them to operations.
- [ ] what the patient needs on the device (app, camera, network) and whether the device must be the patient's own.
- [ ] whether url is the QR payload to render or a link to open, and how long it stays valid.
- [ ] the poll interval, the maximum time to poll before giving up, and the status values for a failed or expired face authentication.
- [ ] whether aadhaar/auto-login accepts the face-auth txn_id to log in to one of them.
- [ ] when face-auth/verify returns confirm_mobile_otp, given it takes no mobile, and which mobile verify call follows.
- [ ] how long a face-auth txn_id stays valid.
- [ ] which codes face-auth init, capture and verify return, including the code or status for a face that does not match; the spec has no error examples for them.
- [ ] the timeout.
- [ ] the code returned by face-auth/verify when the Aadhaar does not match.
- [ ] retry interval for ABDM-1022.
- [ ] whether face authentication can be completed on sandbox at all, with which test Aadhaar and device, and link the ABDM Connect testing page once it exists.

### `workflows/create-abha-mobile-otp.mdx` (10)

- [ ] how long to wait before offering resend, and how many resends are allowed.
- [ ] when abha_profiles is non-empty after mobile/verify, which call logs the patient in to the chosen address with this txn_id, or must login start again from login/init? Also confirm which skip_state values mobile/verify returns and what each means here.
- [ ] the address format to send to phr/check and create-phr, with or without the "@abdm" suffix.
- [ ] the skip_state value Create returns on success, and whether token, refresh_token or eka.min_token must be stored for later calls.
- [ ] what data.abha_number holds on abha.created for a mobile-created address, which has no ABHA number.
- [ ] how long a txn_id stays valid.
- [ ] which codes each operation in this workflow returns; the spec has no error examples for them, so the rows below are matched by the meaning on the errors page.
- [ ] retry interval for ABDM-1022.
- [ ] retry interval and whether the same txn_id can be reused after a 5XX.
- [ ] sandbox test mobile numbers and OTPs, and link the ABDM Connect testing page once it exists.

### `workflows/create-hpr-id.mdx` (15)

- [ ] which of X-Pt-Id, X-Partner-Pt-Id and X-Hip-Id are required on NHPR calls, given the facility has no HIP ID yet at this point?
- [ ] where an integrator gets the valid values for hp_category_code, hp_sub_category_code, role, id_type, source_type and domain_name
- [ ] is the txn_id returned by verify the same as the one from init, or does it replace it?
- [ ] when demo/verify returns hpr.hprId or suggested_hpr_ids, can the integrator skip check/exist or suggest?
- [ ] which field decides that an HPR ID exists: a non-empty hpr_id, or new being false?
- [ ] should the integrator call POST /abdm/nhpr/v1/hpr/aadhaar/check/available on a handle the professional types before calling create?
- [ ] how long an NHPR transaction stays valid
- [ ] which later calls need the professional's HPR ID
- [ ] what the token from check/exist is for, and how long to keep it
- [ ] which call consumes it
- [ ] do the NHPR endpoints return the ABDM and MIS codes below, or their own codes? None of the spec's NHPR operations carry an error example.
- [ ] how many OTP attempts before the transaction must restart from init
- [ ] the code create returns for a taken hprId
- [ ] retry interval and limit for NHPR calls
- [ ] sandbox Aadhaar numbers and OTPs for HPR creation, and the testing page to link

### `workflows/hip-discovery-and-link.mdx` (14)

- [ ] which identifiers must match for a record to count as the patient's (mobile alone, or mobile plus name, gender and year of birth), and what to return when several patients match
- [ ] hi_type sits on each patients entry, not on each care context; do you send one patients entry per hi_type when a patient's care contexts have different types?
- [ ] the error.code and message to send when no patient matches; error.code is an integer and the errors page lists string codes
- [ ] the deadline for the on-discover reply after the webhook
- [ ] the format of otp_expiry (ISO 8601 timestamp or a duration) and any required OTP length or validity window
- [ ] is each care_contexts reference_number the care context ref_num you sent in on-discover?
- [ ] is the ref_num sent in on-init the value that comes back as linkRefNumber in the confirm webhook?
- [ ] what to do if the selected reference_number values include care contexts you did not return in on-discover, or that are already linked
- [ ] how to match the confirm webhook to the pending link, since it carries no txn_id (by linkRefNumber?)
- [ ] the error.code to send for a wrong or expired OTP, and whether the patient can retry the OTP or must start linking again
- [ ] are care contexts linked through on-confirm always served through abha.hip_data_fetch, or can the HIP send their FHIR data to Eka afterwards?
- [ ] how long a discovery transaction stays open on ABDM's side, which bounds how long to keep txn_id and the pending OTP
- [ ] which of these codes Eka returns to the HIP's replies and which only reach the PHR app, and what the HIP should do on ABDM-1026, ABDM-1038 and ABDM-1048
- [ ] how to trigger discovery against your HIP on sandbox (which PHR app or test ABHA, and test patient data on your side); there is no testing page for ABDM Connect yet

### `workflows/hip-scan-and-share.mdx` (9)

- [ ] where the facility gets its Health Facility QR code, and where each counter's hip_code is configured
- [ ] does the webhook carry the patient's name, gender, year of birth and mobile, as "share their ABHA profile" suggests, or only the identifiers in the example? If only identifiers, how does the HIP get the demographics to register a new patient?
- [ ] when partner_patient_id is filled in (only for a patient already known to you?), and what it is when the patient is new
- [ ] that request_id in on-share is the webhook's data.req_id (the names differ)
- [ ] the unit of token.expires_at (epoch seconds or milliseconds)
- [ ] which error.code values to send, since error.code is an integer and the errors page lists string codes
- [ ] the deadline for the on-share reply after the webhook, and what the patient sees if it is missed
- [ ] which of these codes on-share returns, and what an integrator should do on ABDM-1049 and ABDM-1050
- [ ] how to produce a facility QR and trigger abha.hip_profile_share on sandbox, and which test ABHA to share; there is no testing page for ABDM Connect yet

### `workflows/hiu-receive-data.mdx` (14)

- [ ] whether one consent can produce several abha.hiu_data_push events (one per HIP, or paged entries), and how to tell when the last one has arrived.
- [ ] how to deduplicate a retried delivery: by the top-level transaction_id or by data.transaction_id.
- [ ] the webhook page describes key_information.dh_public_key as the HIU's public key, while the keyset page says the HIP's public key is shared for decryption. Which is it? The mapping above assumes the HIP's key.
- [ ] how to verify entries[].checksum (which hash, over the encrypted or the decrypted content).
- [ ] whether to reject an entry when key_information.dh_public_key.expiry has passed.
- [ ] what happens to an entry reported with success false; does Eka or the HIP resend it?
- [ ] the deadline for calling on-push after the webhook arrives.
- [ ] retention period
- [ ] whether the HIU must delete records when the consent's expiry or erase_at passes, or on revoke
- [ ] retry count and schedule
- [ ] which call returns ABDM-1061 in this workflow
- [ ] which transaction_id on-push expects
- [ ] whether the HIU can trigger a re-fetch for one HIP, or must raise a new consent
- [ ] a sandbox HIP that pushes test records, and how to trigger a push in sandbox. No testing page exists yet.

### `workflows/hiu-request-consent.mdx` (19)

- [ ] which onboarding step registers a facility as HIU rather than HIP, and which page documents it?
- [ ] where an HIU gets the clinic_id and d_oid it sends in the hiu object, and whether both are required.
- [ ] how an integration chooses between "you store the data" and "Eka stores the data", and whether it is a per-account setting.
- [ ] whether the keyset expects the raw public_key from GET /abdm/v1/ecdh/keys or the x509_public_key form that the abdm-ecdh library returns.
- [ ] whether records already in flight under an old keyset still decrypt with the old private key after a rotation, and how long to keep old private keys.
- [ ] whether hip_identifier and care_contexts are optional, and what the request covers when they are left out.
- [ ] the spec documents the success response as 204 with a body carrying consent_init_id; is the status 200 or 204?
- [ ] the list of values data.notification.status takes (granted, denied, expired, revoked?) and their exact case.
- [ ] whether consentRequestId equals the consent_init_id from Create or the consent_id from List.
- [ ] whether you should poll Consent List if the webhook never arrives, and at what interval.
- [ ] the values of status in Consent List, and whether consent_id is empty until the patient grants.
- [ ] retention period after rotation
- [ ] retention period
- [ ] retention period
- [ ] which rules make a date range invalid, such as a future to date or an expiry before to
- [ ] which call returns ABDM-1039
- [ ] rate limit and the back-off to use
- [ ] whether Eka retries the HIP fetch itself, and when the integrator should retry
- [ ] sandbox test patient (ABHA address), HIP id, clinic_id and d_oid to use, and how to approve the request as the patient in sandbox. No testing page exists yet.

### `workflows/hold-gateway-session.mdx` (10)

- [ ] how often to call session/status, for example once per screen or once per patient visit, and whether its result can be cached.
- [ ] which mobile receives the session OTP, the one linked to the ABHA address or another, and whether a resend call exists for session/init.
- [ ] whether the integrator must send token on later patient-scoped calls (and in which header), or Eka holds the session against the oid; whether token is the user_x_token that profile/kyc/init and profile/kyc/verify take; and whether refresh_token can renew the session without a new OTP.
- [ ] how long a session txn_id stays valid.
- [ ] the session lifetime and whether token must be stored at all.
- [ ] what token is used for.
- [ ] how long to keep refresh_token.
- [ ] what refresh_token is used for.
- [ ] which codes the session operations return; the spec has no error examples for them, so the rows below are matched by the meaning on the errors page.
- [ ] how to force a session to expire on sandbox to test the 491 path, sandbox OTPs, and link the ABDM Connect testing page once it exists.

### `workflows/hpr-mobile-login.mdx` (12)

- [ ] what this flow gives the integrator at the end (a session, a token, the HPR profile), and what the integrator does with it
- [ ] which of these headers are required on NHPR calls
- [ ] where the hprId for check/available comes from in this flow; mobile/verify returns only txn_id, mobile_num and hint
- [ ] is txn_id sent on mobile/init, and if so, from which earlier call?
- [ ] is the mobile/init response wrapped in data like the other NHPR responses?
- [ ] what available true means for a returning professional (the ID is free, or the ID is found and active), and what the integrator does in each case
- [ ] how long the transaction stays valid
- [ ] do the NHPR endpoints return the ABDM and MIS codes below, or their own codes? None of the spec's NHPR operations carry an error example.
- [ ] the code mobile/init returns for a mobile with no HPR account
- [ ] attempt limit before restarting from mobile/init
- [ ] retry interval and limit
- [ ] a sandbox mobile with an HPR ID, its OTP, and the testing page to link

### `workflows/link-care-context-hip.mdx` (9)

- [ ] which of the X-Pt-Id, X-Partner-Pt-Id and X-Hip-Id headers are required on this call, and do they duplicate oid and partner_user_id in the body?
- [ ] is there a maximum number of entries in care_contexts per call, or a maximum size for the base64 data field?
- [ ] is data.care_context_id in the webhook the same care_context_id you sent in the link request? The example shows a UUID.
- [ ] does Eka retry linking itself after ERRORED (what retry_count counts), or must you call the link API again, and after how long?
- [ ] how long after the 202 the webhook normally arrives, and how long to wait before treating it as lost
- [ ] when to call sms/notify. Is it for patients without an ABHA (so they can later discover the record), after a LINKED status, or both? Does the patient receive an SMS, and from whom?
- [ ] is there a retention requirement for the FHIR data you keep yourself, or for data Eka stores on your behalf?
- [ ] which of these codes the link API actually returns, and the retry interval and limit for rate limits and gateway outages
- [ ] sandbox test ABHA address, HIP ID and a sample FHIR bundle to use; there is no testing page for ABDM Connect yet

### `workflows/login-abha.mdx` (11)

- [ ] the possible values in auth_methods and blocked_methods, and how each maps to the method and otp_system values on login/init.
- [ ] that login/init's "search api response" means POST /abdm/v1/profile/search, and which skip_state login/verify returns on the search route.
- [ ] which call completes login on the abha_number route after login/verify.
- [ ] which otp_system to send for each method.
- [ ] the skip_state login/verify returns on the mobile route (abha_select is expected).
- [ ] whether the login txn_id can continue into aadhaar/create-phr when abha_profiles is empty, or the patient must start Create an ABHA with Aadhaar OTP from the beginning.
- [ ] how long a login txn_id stays valid.
- [ ] whether these must be stored and what they are used for.
- [ ] which codes each login operation returns; the spec has no error examples for them, so the rows below are matched by the meaning on the errors page.
- [ ] retry interval for ABDM-1022.
- [ ] sandbox test identifiers and OTPs, and link the ABDM Connect testing page once it exists.

### `workflows/manage-profile-and-kyc.mdx` (10)

- [ ] the accepted values of the format query parameter.
- [ ] the image content type returned.
- [ ] the error returned when a locked field is changed on a KYC-verified ABHA.
- [ ] where user_x_token comes from (the token from session/verify, create or login?) and whether it is required.
- [ ] which mobile receives the KYC OTP for each method.
- [ ] that kyc_verified and abha_number on GET /abdm/v1/profile reflect the completed KYC immediately.
- [ ] how long a KYC txn_id stays valid.
- [ ] which codes each profile and KYC operation returns; the spec has no error examples for them, so the rows below are matched by the meaning on the errors page.
- [ ] what the integrator should do when ABDM-1043 is returned during KYC.
- [ ] sandbox test identifiers and OTPs for KYC, and link the ABDM Connect testing page once it exists.

### `workflows/phr-act-on-consent.mdx` (13)

- [ ] whether X-Pt-Id or the oid query parameter is required, and what X-Partner-Pt-Id and X-Hip-Id should carry for a PHR app.
- [ ] whether approve, deny and revoke fail without a verified consent PIN, or whether the PIN is optional. The spec says pin/verify is used "to approve/revoke consents" but does not say what approve checks.
- [ ] PIN format (length, digits only). The spec example is four digits.
- [ ] the values of scope in the verify body, and which scope approve and revoke each need.
- [ ] how long a verified PIN stays valid, and whether deny needs it too.
- [ ] whether the patient may narrow duration or hi_types below what the HIU asked for, or only remove items.
- [ ] whether a PHR app receives abha.consent_update for requests the patient acts on, or only HIUs do.
- [ ] whether you may cache the exists result, or must ask Eka each time
- [ ] error code for a wrong consent PIN, and the attempt limit
- [ ] the order of the forgot-PIN calls and whether reset needs the txn_id from forgot init
- [ ] which code approve returns for an expired request
- [ ] retry rule
- [ ] a sandbox patient with a pending consent request, and how to raise one from a sandbox HIU. No testing page exists yet.

### `workflows/phr-discover-and-link.mdx` (14)

- [ ] which of the `X-Pt-Id` header and the `oid` query parameter is required on these calls; the spec marks neither as required.
- [ ] which of these five operations need a live ABHA gateway session and return HTTP `491` without one.
- [ ] providers/getting-started says Provider Details returns the care contexts available to the user, but the spec response (`ProviderResponseType2`) carries only `hip_id`, `hip_name`, `city` and `state`. Which is right?
- [ ] how long discover waits for the facility to answer, and what it returns when the facility does not answer in time.
- [ ] that `patient_ref_id` is `patient[].id` and `cc_ref_id` is `patient[].care_contexts[].id` from the Discover response.
- [ ] `cc_ref_id` is a single string. How does the patient link several care contexts from one facility: one Link Init per care context, or one call with a list?
- [ ] whether a 200 from Link Confirm means the link is final, or whether a later event reports it.
- [ ] how long a Discover `txn_id` stays valid.
- [ ] how long the link OTP and its `txn_id` stay valid.
- [ ] which of these codes these five operations actually return, and whether the ABDM code arrives in `source_error.code`; the spec has no error examples for them.
- [ ] how many OTP attempts are allowed and whether link OTP can be resent.
- [ ] retry rule and backoff when the HIP is unavailable.
- [ ] the rate limit and how long to wait.
- [ ] a sandbox facility name and `hip_id` that answers discovery with test care contexts, and how the sandbox delivers the link OTP. There is no ABDM Connect testing page yet.

### `workflows/phr-list-records.mdx` (9)

- [ ] which workflow to link for reading a record's contents from a PHR app.
- [ ] which of the `X-Pt-Id` header and the `oid` query parameter is required; the spec marks neither as required.
- [ ] whether these two operations return HTTP `491` without a live gateway session.
- [ ] what `status` holds for a care context that is linked but has had no consent raised yet, and what each value means for what the app shows.
- [ ] whether either list is paginated; the spec has no paging parameters.
- [ ] whether caching the provider list is safe, or whether it must be fetched each time.
- [ ] which codes these two operations return; the spec has no error examples for them.
- [ ] retry rule for 5XX on these calls.
- [ ] a sandbox patient with linked care contexts to list. There is no ABDM Connect testing page yet.

### `workflows/phr-scan-and-share.mdx` (12)

- [ ] which of the `X-Pt-Id` header and the `oid` query parameter is required; the spec marks neither as required.
- [ ] whether these two operations return HTTP `491` without a live gateway session, and whether `user_x_token` in the request body is that session token.
- [ ] what the QR code encodes and how to extract `hip_id` and `counter_id` from it.
- [ ] the request body also accepts an optional `request_id` and `user_x_token`. When should you send each, and where does `user_x_token` come from?
- [ ] the poll interval and the maximum time to keep polling before giving up.
- [ ] that `success` and `failed` are the only terminal states. The spec writes the enum values as `" processing"` and `" failed"` with a leading space; is that what the API returns?
- [ ] phr/scan-and-share.mdx says the response carries HIP details and whether to display the token, but the spec response (`ScanandshareResponse`) has neither. Which is right?
- [ ] what `token_number` holds when the facility shares no token, since returning one is optional for the facility.
- [ ] which codes these two operations return; the spec has no error examples for them.
- [ ] whether a failed share can be retried with the same `request_id` or needs a new share.
- [ ] the limit.
- [ ] a sandbox facility QR code, or a test `hip_id` and `counter_id`, whose counter answers with a token. There is no ABDM Connect testing page yet.

### `workflows/register-hfr.mdx` (15)

- [ ] which of these headers are required on HFR calls, and whose OID goes in X-Pt-Id (the authorizing professional's?)
- [ ] what search returns when the facility is not in HFR (a 4XX, or success with empty data), and what facilityStatus values mean the facility can be linked
- [ ] the onboard request body; the guide says it needs the facility name, address and the authorizing doctor's OID, but the spec schema has only clinic_id and hfr_id
- [ ] does this call replace the Software Linkage step on the ABDM portal, or must the admin still enter the Eka Bridge ID there?
- [ ] is the hip_id sent here the facility's HFR ID, or a different identifier, and what is hip_code used for
- [ ] that the X-Hip-Id header takes this hip_id
- [ ] what hip_code is used for
- [ ] that scan_share_url is the URL to encode in the counter QR
- [ ] do the HFR and onboard endpoints return the ABDM codes below, or their own codes? None of these operations carries an error example in the spec.
- [ ] the response search gives for an unknown hfrId
- [ ] that onboard HFR returns ABDM-1053 for a duplicate facility
- [ ] the code returned when linking or onboarding a facility whose HFR registration is pending approval
- [ ] retry interval and limit
- [ ] a sandbox HFR ID to search and link, the values to use for a new facility, and the testing page to link
- [ ] is onboarding idempotent, or does a second call fail

### `workflows/scan-and-pay.mdx` (21)

- [ ] which of X-Pt-Id, X-Partner-Pt-Id and X-Hip-Id are required here? The spec marks all three optional.
- [ ] the QR code's format, and how to read hip_id and counter_id from it.
- [ ] the spec writes every value after the first with a leading space (" PROCESSING_OPEN_ORDER"). Is that in the API response, or a spec typo?
- [ ] poll interval and timeout for each GET, and which status means each result is ready.
- [ ] the status that means the open orders are ready to read.
- [ ] does the response's request_id equal the one you sent, or is it new?
- [ ] how your app learns the patient has finished on the payment page (redirect, deep link, or polling transaction details).
- [ ] which request_id this call takes: the one from Open Orders or from Patient Select?
- [ ] the values data.status can take, and which one means paid.
- [ ] how long a request_id stays valid
- [ ] retention
- [ ] code
- [ ] that Scan and Pay returns this code
- [ ] that Scan and Pay returns these
- [ ] the list of data.error codes
- [ ] values
- [ ] can the patient retry with the same request_id?
- [ ] that Scan and Pay returns this code
- [ ] wait time
- [ ] is Scan and Pay available on sandbox, and which test hip_id and counter_id return open orders?
- [ ] sandbox payment method

### `workflows/serve-data-on-fetch.mdx` (13)

- [ ] which transaction_id to send in on-fetch, the top-level webhook transaction_id or data.transaction_id? The webhook page says "the transaction_id from this webhook", and the example shows data.transaction_id as an empty string.
- [ ] should the bundle contain only the resources matching hi_types, or the whole care context?
- [ ] what to do if dh_public_key.expiry has already passed when the webhook arrives
- [ ] generate a new key pair for every fetch request, or reuse one across requests?
- [ ] is public_key from GET /abdm/v1/ecdh/keys in the X.509 SubjectPublicKeyInfo encoding the library calls x509_public_key?
- [ ] which checksum algorithm the checksum field expects (the spec says only "checksum of the non encrypted plain text fhir data")
- [ ] is dh_public_key.key_value in the push your public_key from GET /abdm/v1/ecdh/keys or key_to_share from POST /abdm/v1/ecdh/encrypt? What expiry and parameters values should you send?
- [ ] when to split a response across pages, what page_number starts at, and whether each page is a separate on-fetch call with the same transaction_id
- [ ] the deadline for the push after the webhook arrives, and whether Eka reports delivery success or failure back to you
- [ ] can the same transaction_id be served twice (for a retry), and should your private key be discarded once the push is accepted?
- [ ] which of these codes on-fetch actually returns, and the retry interval and limit for each
- [ ] how you learn that an HIU failed to decrypt or verify the checksum
- [ ] how to trigger abha.hip_data_fetch on sandbox (which test HIU, consent and ABHA to use); there is no testing page for ABDM Connect yet

### `workflows/set-up-health-locker.mdx` (14)

- [ ] the spec's PATCH body has only oid. How does the caller choose enabled or disabled, and which HIUs, HIPs or record types the policy covers?
- [ ] whether the patient must verify their consent PIN before this call.
- [ ] what to do if abha.locker_created never arrives after Update returns enabled.
- [ ] whether a consent raised for care contexts under an active subscription is approved automatically by the auto-approval policy, so the patient sees no prompt.
- [ ] the full list of subscription status values, and what each means for the locker (for example, whether a revoked subscription also turns auto-approval off).
- [ ] what the DATA and LINK categories each cover.
- [ ] what to do with it when auto-approval is turned off
- [ ] retention period
- [ ] whether event_id is unique per notification
- [ ] which code auto-approval returns for an unknown oid
- [ ] when ABDM-1054 occurs in this workflow and what to do
- [ ] retry count and schedule
- [ ] retry rule
- [ ] a sandbox patient to enable the locker for, and a sandbox HIP that can link a care context to trigger abha.subscription_notify. No testing page exists yet.

### `workflows/uhi-book-consultation.mdx` (20)

- [ ] which of X-Pt-Id, X-Partner-Pt-Id and X-Hip-Id are required on UHI calls? The spec marks all three optional.
- [ ] which party Eka forwards each request to (UHI gateway, provider), so the diagram can show it.
- [ ] poll interval and timeout for every GET in this workflow, and which response tells you the result is not ready yet.
- [ ] does the webhook envelope's transaction_id equal the txn_id from the POST, so you can match a webhook to its request?
- [ ] which search fields are required together, for example whether radius_km needs latitude and longitude.
- [ ] the spec gives Get Doctors no query parameters. How does it know which search to return?
- [ ] is provider_id here the one from the Search Doctors response? The spec describes it as the doctor's identifier, and the doctor results carry no provider_id.
- [ ] how does the patient's acceptance of the terms reach the provider? Confirm takes only provider_id and transaction_id.
- [ ] when payment.status is not paid, where and when does the patient pay? No payment operation exists in the spec.
- [ ] the list of values state can take, and which one means confirmed.
- [ ] how do you learn the update's result? Update has no GET and no webhook in the spec. Is it Order Status? Does it need a fresh slot search first?
- [ ] how long a txn_id stays valid
- [ ] retention
- [ ] the ABDM or UHI code returned
- [ ] code for an expired txn_id
- [ ] interval and timeout
- [ ] code
- [ ] retry rule
- [ ] is there a rate limit on UHI calls?
- [ ] is UHI physical consultation available on sandbox, and which test doctors, facilities and time windows return results?

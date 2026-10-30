---
name: writing-quickstart
description: How to write a product's quickstart page on developer.eka.care, the one representative workflow taken from a token to a real response in under ten minutes, copy-pasteable, with no branches. Covers how to choose the representative workflow, the page shape, what stays out, and the quickstart frontmatter the check reads. Use when creating or reviewing a quickstart, when a product's quickstart is a stub or a feature list, or when deciding which workflow best proves what the product does.
---

# Writing a quickstart

A quickstart is the page that proves the product works, to a developer with ten minutes and a terminal. It walks one workflow, start to real response, with nothing to decide along the way. It is not an overview, not a feature list, and not a tour of the API.

## Choosing the representative workflow

Pick the workflow that most journeys pass through and that ends in something the reader can see. Rules of thumb:

- It produces the product's core artefact: an ABHA number, a structured note, a linked care context.
- It needs nothing the reader does not already have after getting a token. No webhook endpoint, no second party, no prior workflow.
- It completes against sandbox with published test data.
- It is short: three to five calls. If the only candidate is longer, stop the quickstart at the first visible result and link the workflow for the rest.

EkaScribe: create session, upload audio, end session, poll, read the note. ABDM Connect: create an ABHA with Aadhaar OTP, using the sandbox Aadhaar and OTP. When two workflows tie, take the one whose journey the overview leads with.

## Frontmatter

```yaml
---
title: Quickstart
description: Create your first ABHA against sandbox in under ten minutes.
type: quickstart
product: abdm-connect
workflow: create-abha-aadhaar-otp
---
```

`workflow` names the workflow page the quickstart walks. The check warns on a quickstart that has neither `workflow:` nor a call to any workflow's operation in its body, so a stub cannot pass as a quickstart.

## The shape

Follow docs.abdm.gov.in's "first fifteen minutes": a one-line promise, In short, Before you start, one numbered heading per call (`## 1. Get an access token`), How this fits your product, If a call fails, Next. Every step runs from the docs: open the API page and press **Try it** in Mintlify's playground, after authenticating once on Client Login (the pattern in `docs/scribe/authenticate-and-try.mdx`). Each step carries the body to paste and what to copy for the next step; the curl equivalent goes in a collapsed `<Accordion title="Prefer curl?">`.

## Sections, in order

1. **What you will have** at the end, in one sentence, and roughly how long it takes.
2. **Before you start.** Get a token: link [Authorization](/api-sdk/auth/getting-started), do not repeat it. The sandbox base URL. Any test value the reader must use, from the testing page.
3. **The calls.** A `<Steps>` block, one `<Step>` per call, each with: one sentence on what it does, the full request as a copy-pasteable `curl` (and the same in one SDK language if the product has an SDK, in `<CodeGroup>`), and the response trimmed to the fields that matter, with the field the next step needs called out. Use the spec's examples for both; do not invent values.
4. **What just happened.** Three or four sentences mapping the calls to the product's concepts, linking the journey page.
5. **Where next.** Three links: the workflow page this walked (for the branches and the failure table), the next workflow in the journey, and the testing page.

## Rules

- No branches. "If the patient already has an ABHA" belongs on the workflow page. Say once, at the top, which case this walks.
- No options. One auth method, one language per code block, one environment (sandbox).
- Every request must run as pasted, against sandbox, with the test values on the page. If a value must be the reader's own (a client id), say so in a placeholder like `YOUR_CLIENT_ID` and nowhere else.
- Every response shown is a real sandbox response with secrets and personal data scrubbed, not a schema.
- Under ten minutes means under about 600 words outside code blocks. Cut explanation before cutting a step.
- The operations the quickstart calls must all be in the named workflow's `operations`. If the quickstart needs a call the workflow does not list, the workflow page is incomplete; fix it there.

## Smells

| Smell | Fix |
|---|---|
| Opens with what the product is | Move it to the overview; open with what the reader will have |
| Lists endpoints with no requests | It is a reference index; write the calls |
| "Choose one of the following methods" | Pick one; link the workflow for the others |
| Response shown as a schema | Paste a scrubbed real response |
| Ends after the first call | Carry on to the visible result |

---
name: writing-journeys
description: How to write a journey page for a product on developer.eka.care, a real person's end-to-end story in product terms with no API calls, and where each step hands off to a workflow. Use when creating or reviewing a journey page, when someone asks "who is this for" or "what does the user actually do", or when a product has endpoints but no story around them.
---

# Writing a journey

A journey is the page a product manager, a solutions engineer and a developer can all read. It names a person, what they are trying to do, and the steps in the order they happen. It never names an endpoint. Each step that needs code points at a workflow.

## Frontmatter

```yaml
---
title: Register a walk-in patient's ABHA
description: A clinic receptionist creates or finds a patient's ABHA at the front desk.
type: journey
product: abdm-connect
persona: Clinic receptionist
---
```

The file slug (`register-walk-in-patient`) is what workflow pages name in their `journey` field.

## Sections, in order

1. **Who and when.** One paragraph: the person, where they are, what triggers this. "A receptionist at a clinic that is an ABDM HIP. A patient arrives without an ABHA, or does not know whether they have one."
2. **What they want.** One sentence, in their words.
3. **The steps.** A numbered list, each step one or two sentences in product terms. Where a step is done by calling the API, end it with a link: "→ workflow: [Create an ABHA with Aadhaar OTP](/abdm-connect/workflows/create-abha-aadhaar-otp)". Where a step is a human action (the patient reads out an OTP), say so.
4. **What they have at the end.** The state of the world: the patient has an ABHA number, the HIS holds `abha_address` and `oid` against the patient record.
5. **Branches.** Short list of the ways the story forks and which workflow handles each: patient already has an ABHA, Aadhaar mobile not linked, patient refuses Aadhaar.

Four hundred to eight hundred words is typical. There is no limit; stop when the story is told.

## Rules

- No endpoint names, paths, or field names. Those belong to workflows.
- One persona per journey. Two personas means two journeys.
- Every step that involves the API must link to exactly one workflow. If the workflow does not exist yet, create the stub with `/workflow-new` and link it; `docs-check` will warn on the stub until it is written.
- The branches section is mandatory. A journey with no branches is a demo, not a journey.

## Worked example

```md
---
title: Register a walk-in patient's ABHA
description: A clinic receptionist creates or finds a patient's ABHA at the front desk.
type: journey
product: abdm-connect
persona: Clinic receptionist
---

## Who and when

A receptionist at a clinic registered as an ABDM Health Information Provider. A patient walks in for an OPD visit. The clinic wants every visit linked to the patient's ABHA so the records are discoverable later.

## What they want

"Get this patient an ABHA, or find the one they already have, without holding up the queue."

## The steps

1. The receptionist asks whether the patient has an ABHA. Most walk-ins do not know.
2. They ask for the patient's mobile number and check whether an ABHA already exists against it. → workflow: [Look up an existing ABHA](/abdm-connect/workflows/lookup-abha-by-mobile)
3. If none exists and the patient has Aadhaar with a linked mobile, they create one with an Aadhaar OTP. The patient reads the OTP out. → workflow: [Create an ABHA with Aadhaar OTP](/abdm-connect/workflows/create-abha-aadhaar-otp)
4. The clinic's HIS saves the ABHA against the patient record and prints the ABHA card.

## What they have at the end

The patient has a 14-digit ABHA number and an ABHA address. The HIS holds both, plus Eka's user id, on the patient record, so the visit's prescription can be linked as a care context.

## Branches

- The mobile lookup finds an ABHA: skip to login. → workflow: [Log in to an existing ABHA](/abdm-connect/workflows/login-abha)
- Aadhaar mobile is not linked: the flow asks for a separate mobile verification. → same workflow, "mobile not linked" branch
- The patient refuses Aadhaar: create an ABHA address only, with a mobile OTP. → workflow: [Create an ABHA address with mobile OTP](/abdm-connect/workflows/create-abha-mobile-otp)
```

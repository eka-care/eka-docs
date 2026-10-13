---
name: product-plugins
description: What a product integration plugin for an Eka product looks like, the Claude Code plugin an external developer installs to integrate end to end and an Eka developer runs to test the docs. One skill per workflow, overview and auth and testing and debugging skills, a debugger agent, one /integrate command per workflow, and the rule that every skill fetches the page before each call and never copies a schema. Use when scaffolding or editing a product plugin, deciding what a skill may state, or writing the build-with-ai page.
---

# Product plugins

A product plugin is the executable form of the product's docs. It lives at `plugins/<product>/` in this repo, in the same marketplace as this plugin, and is modelled on `abdm-connect` (the Eka ABDM Connect plugin), which proved the shape.

```
claude plugin marketplace add eka-care/eka-docs
claude plugin install <product>@eka-docs
```

## Layout

```
plugins/<product>/
  .claude-plugin/plugin.json
  README.md
  skills/
    <product>-overview/SKILL.md        what it is, the journeys, the docs map (page URLs)
    <product>-auth/SKILL.md            how to get a token; points at /api-reference/authorization
    <product>-<workflow>/SKILL.md      one per workflow page
    <product>-testing/SKILL.md         from the testing page: sandbox, test data, happy paths
    <product>-debugging/SKILL.md       from the errors page: code, meaning, fix
  agents/
    <product>-debugger.md              diagnoses a failing call from logs and the errors page
  commands/
    integrate-<workflow>.md            one per workflow page
```

`/plugin-scaffold <product>` generates all of it from the pages. Every generated file opens with a comment naming the page it came from.

## The rule that keeps it honest

A skill states no fact that is not on a page. It carries the workflow's **shape**: the order of calls, the state to persist, the decisions, the failure handling. Before making any call, the agent fetches the reference page for that operation (`https://developer.eka.care/<page>.md`, Mintlify serves every page as markdown at `.md`) and reads the schema there. A skill that pastes a request body is wrong, because the body will drift from the spec.

The test of a product plugin is the `integration-tester` agent: it runs one workflow against sandbox as a stranger would. Every point where it had to guess is a docs gap, filed against the page, not patched in the skill.

## A workflow skill

```md
---
name: abdm-connect-create-abha-aadhaar-otp
description: Integrate ABHA creation with Aadhaar OTP into the user's codebase. Use when the user says "create ABHA", "Aadhaar OTP", or is building patient registration for an HIS.
---

Source page: https://developer.eka.care/abdm-connect/workflows/create-abha-aadhaar-otp

Prerequisite: `abdm-connect-auth`.

## Shape
1. Init → keep `txn_id`
2. Verify → read `skip_state`; existing profile → Auto-Login, stop
3. Create → persist `oid`, `abha_address`, `abha_number` on the patient record
Webhook `abha.abha_created` carries the same fields; wire it as the source of truth.

## Before each call
Fetch the reference page for the operation and build the request from its schema. Pages: (list of the three reference URLs)

## Failure handling
See the page's "When it fails" table. The codes to handle in code: `MIS-1013` (retry OTP), `ABDM-1100` (30-minute lockout).

## Done when
The sandbox happy path on the page's "Test it" checklist passes, and the integration test in the user's repo covers the wrong-OTP case.
```

## An integrate command

Phases, in order, each with an explicit exit: **Discover** the repo (language, patient model, HTTP client, test framework, secrets handling), five lines, no questions you can answer yourself. **Interview** in one batch: credentials and environment, which branches of the workflow to enable, where the result lands in their data model, webhook reachability. **Plan** file by file; stop for approval. **Build**, fetching each reference page before the call it implements, secrets via env only. **Test** against sandbox from the testing skill; on failure use the debugging skill and iterate. **Report**: files, test results, what a human still has to do (prod credentials, webhook registration), the next workflow.

## What a product plugin is not

- Not a copy of the docs. If it could answer a question the docs cannot, the docs are wrong.
- Not an MCP server. It runs in the integrator's repo with their credentials.
- Not multi-agent. One command, one agent, one workflow at a time; the debugger agent is the only sub-agent.

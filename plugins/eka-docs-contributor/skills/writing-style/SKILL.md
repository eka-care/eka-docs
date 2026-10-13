---
name: writing-style
description: The voice for every page on developer.eka.care. Second person, present tense, state what the API does, one idea per sentence, code in backticks, no marketing. Use when writing or editing any page, when a draft reads like a press release or an internal design doc, or when reviewing someone's prose.
---

# Writing style

A reviewer holds a page to the voice below. `docs-check` holds it to the page rules, which are adopted from the ABDM Developer Portal.

## Page rules

| Rule | Limit | `docs-check` |
|---|---|---|
| Prose budget | overview 600; journey, workflow, quickstart, testing 700; webhooks, errors, changelog none | warn |
| `## In short` | required above 300 prose words, removed below | warn |
| Sentence length | 25 words | warn |
| Sentence length | 35 words | fail |
| Sentences per paragraph | 5 | warn |
| Em dash | none | fail |
| First heading "Introduction" or "Overview" | not allowed | fail |

Prose is counted without code blocks, tables, headings, frontmatter, JSX tags and comments.

**In short** goes right after the opening paragraph: 3 to 5 bullets, the answer first, one short sentence each. It summarises what the page says; it adds nothing. On a short page it only repeats the title, which is why it is removed below 300 words.

**Over budget means the page is too wide, not too wordy.** Move scope to the page that owns it (a failure that belongs on the errors page, a branch another workflow covers) and link it, or split the page in two along the reader's task. Never compress sentences to fit; a cramped page is harder to read than a long one.

**A long sentence is usually a list in disguise.** Three or more parallel things become a bulleted list.

## Voice

- Second person. "You send the OTP" rather than "the client sends the OTP" or "the OTP is sent".
- Present tense. "The webhook fires when the ABHA is created."
- State what the API does, not what the team did or plans. "Returns the patient's profile" rather than "we have added an endpoint that returns".
- Say who does what. "Eka forwards the request to the ABDM gateway" is clearer than "the request is forwarded".

## Sentences

- One idea per sentence. If a sentence has "and" joining two actions, it is probably two sentences.
- Lead with the point. The condition can follow: "Call Auto-Login if the patient already has an ABHA."
- Short paragraphs. Three sentences is plenty. A list is better than a paragraph that enumerates.
- Specific beats general. "Within 30 minutes" beats "promptly". "`MIS-1013`" beats "an OTP error".

## Words

- No marketing adjectives: seamless, powerful, robust, cutting-edge, world-class, simple, easy. If it is simple, the reader will notice.
- No hedging filler: basically, essentially, just, simply, actually.
- Spell an acronym out the first time on a page: "Health Information Provider (HIP)". After that, the acronym.
- Code, field names, paths, values and error codes in backticks: `txn_id`, `POST /abdm/na/v1/registration/aadhaar/init`, `abha_create`.
- Product names as the product writes them: ABDM Connect, EkaScribe, ABHA.

## Honesty

- If something is not tested on sandbox, say so on the page. Do not write a workflow as proven when it is not.
- If a behaviour is undocumented upstream (ABDM gateway quirks), say that it is observed, not specified.
- Do not describe how the documentation was produced. The reader does not care about the process.

## Pages that read badly, and the fix

| Smell | Fix |
|---|---|
| Opens with the history of the product | Open with what the reader can do with it |
| A wall of endpoint names with no verbs | Turn it into a workflow with steps |
| "Please note that" | Delete the phrase; the note stands on its own |
| The same fact on three pages | Keep it on one, link from the others |
| A table with "N/A" cells everywhere | Wrong columns; pick the ones that are always filled |

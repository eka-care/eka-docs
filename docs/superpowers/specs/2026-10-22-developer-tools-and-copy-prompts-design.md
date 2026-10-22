# Landing: Developer tools pill group and copy prompts

Status: approved by Abha on 2026-10-22, with approach 1 (a new generated Developer tools page).

## Intent

A developer who lands on developer.eka.care should reach the tools they work with (APIs, SDKs, MCP servers, webhooks) from the first screen and from every page. The landing page should stop showing code that does not run. "What are you building?" ends in a prompt the developer copies into an AI coding tool, and that prompt works.

The benchmark is razorpay.com/docs/home. It is a Mintlify page in custom mode, like ours, with a developer tools row and a copy-prompt button per goal.

## Goals

1. A **Developer tools** pill group sits under Build Now in the hero, inside the first screen on desktop and phone. It holds API reference, SDKs, MCP server and Webhooks, and nothing else. There is no "View more".
2. **Developer tools** appears in the landing page's own nav and in Mintlify's navbar on every docs page.
3. The code panel under "What are you building?" is replaced by a **Copy prompt** panel. The prompt is built from the scene and the parts the developer has clipped in.
4. The gap between the hero and "What are you building?" shrinks from about 410px to about 215px at 1440×900, and the mark's scroll animation still lands on "01 · Choose".

## Non-goals

- Rewriting product docs, or adding MCP servers, SDKs or webhooks that do not exist.
- Changing the four scenes, the parts they offer or the step numbering (01 to 04).
- The rest of the Razorpay ideas (sandbox triggers, callbacks to localhost, error codes linked to fixes).

## Anti-goals

- A prompt on the landing page that has not been run end to end.
- Code on the landing page that looks real but is not. The current panel says "Illustrative calls only" in an HTML comment that readers never see.
- A new visual component. The pill group reuses the nav's classes.
- A pill that leads to one product's page while claiming to cover all products.

## Constraints

- `landing/source.html` is the source. `node scripts/build-landing.mjs` generates `snippets/landing.jsx`. `scripts/landing.test.mjs` asserts the nav labels (`nav labels`), so adding a fourth nav item changes that test.
- From the 2026-10-21 spec: AI tools live with their product, in a Build with AI group in that product's sidebar. Today three products have that group. MCP servers are per product (for example EMR at `/docs/emr/build-with-ai/mcp-server/introduction` and Medical Knowledge at `/docs/datasets/build-with-ai/mcp-server/introduction`). SDKs and webhooks are also spread across products. No single page lists them all.
- `/mcp/introduction` is an older EMR MCP page that the nav no longer lists. Nothing new should link to it.
- Abha's rule: no new user-visible page without asking.

## Design (decided in the session)

### Pill group

Validated in a throwaway mockup in the scratchpad (`mock/tools.html`), at 1280px and 390px in light mode.

- **Markup:** one `<div class="tools-row" role="navigation" aria-label="Developer tools">`, placed after `.hero-copy` and before `.yoke`. It must not be a `<nav>`, because the page's `nav` rule makes it 64px tall.
- **Container:** the same look as `.navlinks`: 4px padding, a 1px `--line` border, fully rounded, `--surface` at 72%, the same faint shadow, plus a backdrop blur. It is 40px tall, the same as the nav group.
- **Label:** "Developer tools" sits inside the group, first, in the mono uppercase style. It uses `--ink` with a hairline divider after it. On the page background it disappeared into the dot grid and the mark.
- **Items:** four `.nvb` links with a 14px Lucide icon at 70% opacity: `braces`, `package`, `plug`, `webhook`.
- **Phone (560px and below):** the icons go, the label becomes a header row with a hairline under it, and all four items fit on one line below. There is no sideways scroll.
- **Runway:** `#assemble{padding-top:150px}` replaces `calc(min(500px,80vw)*.47 + 110px)`.

### Navs

- **Landing nav:** a fourth item, "Developer tools", after Resources, using the same dropdown (`.nv` and `.nvb`) as the others, with the same four entries. Update the `nav labels` test.
- **Mintlify navbar:** a "Developer tools" link in `docs.json` `navbar.links`, before Discord. It points at `/developer-tools`.

### Copy prompt panel

- Remove `#code` and the `code:` strings on all 21 parts.
- The panel keeps its place, width and `.code` look. It shows the prompt as text, with part names in `.k` and a `.btn-line.btn-sm` "Copy prompt" pill. After a click the label reads "Copied" for about 1.4s.
- **The prompt names:**
  - the scene;
  - each clipped part's label and docs URL, in order (taken from `SCENES[*].parts[*].label` and `.url`);
  - `https://developer.eka.care/llms.txt`;
  - the product's Build with AI page, where one exists;
  - an instruction to authenticate with the developer's own sandbox credentials, never pasted into the prompt.
- No agent logos. Agent names, if shown at all, are plain text.
- **Ships only after it works:** each of the four scenes' full prompt is run by the `integration-tester` agent against sandbox. Every point where it had to guess becomes a docs fix or a prompt change. A scene whose prompt fails stays off the panel until it passes.

## Approaches: the target of each pill (Abha chose 1 on 2026-10-22)

The four tools are spread across products, so each pill needs a page that lists them all.

1. **One new Developer tools page (recommended).** A guide page at `/developer-tools`, generated by `scripts/build-nav.py` from `docs.json` the way `api-sdk/index.mdx` is. It has four sections (APIs, SDKs, MCP servers, Webhooks), each a card per product linking to that product's page. Each pill links to its section's anchor, and the Mintlify navbar link points at the page. It is the "overview page with product cards" from the session, it stays in sync with the nav, and it gives the navbar one honest target. Cost: a new user-visible page. Abha approved it on 2026-10-22.
2. **Extend the existing All APIs page** (`api-sdk/index.mdx`, URL `/api-sdk`) with SDK, MCP and Webhook sections. There's no new page, but a page titled "API Reference" ends up listing tools that are not APIs, and its URL says api-sdk.
3. **Link each pill to one existing page.** There's nothing new to build, but MCP, SDKs and webhooks would each open a single product's page. That's the anti-goal above.

## Left to the builder

- The exact prompt wording per scene, within the list above. The integration-tester run settles it.
- Icon choices beyond the four named, and the dropdown copy for the landing nav item.
- How `build-nav.py` decides which pages count as SDK, MCP or webhook pages, if approach 1 or 2 is picked. Path patterns such as `/sdks/`, `build-with-ai/mcp-server` and `webhooks` cover today's pages.

# Ask AI widget for developer.eka.care: frontend design

## Intent

developer.eka.care gets its own "Ask AI" chat, replacing Mintlify's assistant,
which the site's free Starter plan does not include anyway. The backend will be
an Eka Synapse agent (`@eka-care/medassist-core`), wired later by someone from
the Synapse team. This piece is the frontend only: the full chat UI, running in
its labelled mock mode, ready for Synapse to be plugged in behind it.

The UI is reused from the ABDM Developer Portal's support agent widget
(`nha-in/ai-widget`, MIT, Copyright NHA), not designed from scratch.

## Goals

1. **A floating bar on every page**, including the custom-mode landing page.
   It's a pill fixed to the bottom centre: sparkle icon, placeholder "Ask AI a
   question…", round send button. It matches the user's reference screenshot
   from code.claude.com/docs. Typing and sending opens the panel and sends the
   question straight away. While the panel is open, the bar is hidden.
2. **An "Ask AI" option in Mintlify's search box.** With a query typed, a row
   reading "Ask AI about '<query>'" appears above the results. Clicking it
   closes the search and opens the panel with that query sent.
3. **The chat panel itself**, carried over from the ABDM widget: streaming
   with even pacing, markdown, the orb greeting, starter pills, history,
   attaching a page from the site, attaching a text file, light and dark
   grounds, and the shadow-root isolation.
4. **Mock mode until Synapse is wired.** With no agent configured, the panel
   shows its "Mock" badge and a canned reply, as the ABDM widget already
   does when `api-base` is absent.
5. **One place for the transport.** All talk with the backend goes through a
   single module, so wiring Synapse later means replacing that module and
   nothing else.

## Non-goals

- Wiring Synapse, choosing an agent ID, or deciding how the agent searches
  the docs. That belongs to the Synapse team.
- Any server, proxy or API key.
- Changing the ABDM widget in `nha-in`. The ABDM portal is a digital public
  good that must not depend on Eka, so this is a copy into eka-docs, not a
  shared package with Eka options.

## Anti-goals (failure even if it works)

- A second "Ask AI" entry visible alongside a Mintlify one.
- Megabytes loaded on every page. Mintlify runs every `.js` file in the
  content folder on every page, so nothing large may sit there as `.js`.
- Breaking Mintlify's search keyboard navigation (arrow keys, Enter, Escape)
  by putting our row inside its results list.
- Anything that looks like it answers from a real backend while it's a mock.

## Constraints (verified 2026-10-14)

- **Custom JS is on the free plan.** Mintlify's pricing lists "Custom CSS and
  JS" on Starter. The repo already ships one site-wide script,
  `api-reference-link.js`, which rewrites navbar links. It re-runs on
  `mintlify:navigate`, `popstate` and a one-second interval because Mintlify
  re-renders its chrome.
- **Every `.js` in the content folder runs on every page**, in no guaranteed
  order. Custom React components can't import npm packages.
- **`.mintignore`** exists at the repo root (gitignore syntax) and already
  excludes `scripts/`, `landing/`, `plugins/` and `node_modules/`. Mintlify
  uploads every `.json`/`.yaml` in the content folder as an OpenAPI spec, so
  any new `package.json` or `tsconfig.json` must sit in an ignored folder.
- **Search box hooks on the live site:** the input is `#search-input` (an
  ARIA combobox), the navbar triggers are `#search-bar-entry` and
  `#search-bar-entry-mobile`, the dialog is `[role=dialog]` around them, and
  results are a Base UI `[role=listbox]` that Mintlify controls. The query is
  mirrored in the address bar as `?search=…`. There's no "Ask AI" option
  today.
- **Page list:** `https://developer.eka.care/llms.txt` is an index that links
  to further lists under `/_llms/*.txt`. Page links there end in `.md` (for
  example `/user-guides/get-started.md`), and the `.md` URL serves the page's
  markdown with a 200. The ABDM `parseLlms` keeps only links under `/docs/` from
  one flat file, so it would find nothing here.
- **Brand:** `docs.json`'s colours are being changed by uncommitted work in
  the main checkout (`#6B5CE0` committed, `#215FFF` in progress, matching the
  landing page's `--accent`). The widget therefore reads the colour at build
  time.

## How it's built (decided)

- **Branch.** Its own branch and worktree, based on `feat/eka-docs-contributor`
  (decided by the user), so it sits on the `/docs/<product>/` and
  `/api-sdk/<product>/` routes. The uncommitted redesign in the main checkout
  is not carried over. It arrives on the base branch once it is committed.

- **Location.** Widget source goes in `ask-ai/` at the eka-docs root, which is
  added to `.mintignore`. It has its own `package.json` (preact,
  `@paper-design/shaders-react`, esbuild) and a `build.mjs` adapted from the
  ABDM one.
- **Output.** The build writes one minified file, `ask-ai.js`, to the content
  root, where Mintlify loads it on every page. It is committed, like
  `api-reference-link.js`, with a "Generated, do not edit" header. That one
  file holds the custom element, the floating bar and the search-box row. It
  registers the element and inserts one instance into `document.body`.
- **Element name:** `<eka-ask-ai>`.
- **Transport seam, shaped like Synapse's session API (builder's call).**
  Synapse keeps the conversation on its server. `startSession(existing?)`
  returns a `session_id` and `session_token`, and it can resume an existing
  pair. `sendMessage` takes raw `File[]` and a `hidden` flag, and there is no
  per-message cancel, only `endSession()` (see
  `docs/agents/medassist/synapse/core/api-reference.mdx`). So the seam is
  `transport.ts` with:
  - `start(existing?) → {sessionId, sessionToken}`
  - `send({text, files, page})`, where page context travels as a hidden message
  - `on(handlers)`, with `onText`, `onProgress`, `onTips`, `onDone` and
    `onError`, which are Synapse's own events
  - `detach()`: "Stop" stops displaying the reply. It can't cancel it.
  - `end()`
  - `isMock`: drives the Mock badge, replacing `!apiBase`.

  The panel no longer re-sends the transcript. History stores each
  conversation's session pair beside its turns so it can be resumed. Attached
  files keep their `File` object as well as the text shown in the panel.
  Configuration (`agentId`, any auth token) comes from attributes on
  `<eka-ask-ai>`, which the loader sets from one constant at the top of the
  build. With none set, the mock transport is used. The only implementation
  for now is the mock, which follows the same session lifecycle.

## Changes from the ABDM widget

| Area | ABDM widget | Eka version |
|---|---|---|
| Starters, greeting, "About" answer | ABDM | Eka Developer Platform |
| Commands row (Scaffold, Design, Integrate, Debug) | Present | Removed |
| Install AI tools flow (`install.ts`) | Present | Removed |
| Page search | `/docs/` paths, flat `llms.txt` | Follows the `_llms/*.txt` index; keeps `.md` links |
| File attach | Text, PDF (pdf.js), image (Tesseract) | Text files only; PDF and image refused with a clear message |
| Mermaid diagrams | Loaded from `vendor/` | Shown as a code block |
| `gateway` (hiecm/nhcx) | Present | Removed |
| Citation chips | From a `sources` event | UI kept, unused until the backend supplies links |
| Follow-up tips | None | Pills under the answer, fed by `onTips`; the mock sends two |
| Launcher chip | Built in | Replaced by the floating bar |
| Accent colour | Host variables | Host variables, defaulting to `docs.json`'s `colors.primary`/`colors.light`, read at build time (builder's call: the brand colour is being changed, so it isn't hard-coded) |

The `vendor/` folder (about 37MB) is dropped completely. Adding PDF, image or
mermaid support later means hosting those files outside the content folder.

## Left to the builder

- The exact look of the floating bar and the search row, inside the
  reference screenshot and the widget's existing styles.
- The mock's canned reply and tips. They must say they are a mock.
- Keyboard access to the search row. A shortcut is acceptable. Taking over
  Mintlify's arrow-key list is not.
- How the floating bar sits above Mintlify's own bottom UI on mobile.

## How it's checked

- The ABDM widget's `test.mjs`, carried over, pruned for removed parts, plus a
  test for the new `llms.txt` index parsing.
- In a browser, on the local `mint dev` server: the bar on the landing page,
  a docs page and an API reference page; sending from the bar; the search row
  appearing, clicking through and keeping Mintlify's keyboard navigation;
  light and dark; a 375px phone width; and no console errors.

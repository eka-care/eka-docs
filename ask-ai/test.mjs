// The pieces with logic in them: the markdown the model streams, the mock
// transport it arrives on, and the panel's own copy. Run with `node test.mjs`.
import assert from 'node:assert/strict';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';

const out = join(tmpdir(), `abdm-widget-test-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export {toBlocks, absolute, headings} from './src/markdown';
               export {mockTransport, tipsAfter} from './src/mock-transport';
               export {createTransport, UNREACHABLE, STALLED} from './src/transport';
               export {pastHero} from './src/FloatingBar';
               export {groundOfColor, groundOfScheme, docksAt, DOCK_MIN} from './src/index';
               export {revealStep, THINKING_HOLD, THINKING_BURST, nextFrame, FRAME_FALLBACK} from './src/pacing';
               export {titleOf, remember, whenSaid, forgetOne, resumable, load, save} from './src/history';
               export {ABOUT, isAboutQuestion} from './src/about';
               export {startersFrom, DEFAULT_STARTERS} from './src/starters';
               export {forModel} from './src/transcript';
               export {parseLlms, parseIndex, searchPages, pageUrl, markdownUrl, isHtmlDocument} from './src/pages';
               export {mount, install} from './src/mount';
               export {rowLabel} from './src/search-row';
               export {ekaFrame, SHAPES, STILL, waveAt} from './src/orb/eka-orb';`,
    resolveDir: import.meta.dirname,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  // The orb's shader library is written against React. Preact's compat layer
  // stands in for it, so the widget ships one small runtime rather than two.
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime',
  },
  loader: {'.css': 'text'},
  outfile: out,
});
const {
  toBlocks, absolute, headings, mockTransport, tipsAfter, createTransport, UNREACHABLE, STALLED, pastHero, groundOfColor, groundOfScheme, docksAt, DOCK_MIN, revealStep, THINKING_HOLD, THINKING_BURST,
  nextFrame, FRAME_FALLBACK,
  titleOf, remember, whenSaid, forgetOne, resumable, load, save, ABOUT, isAboutQuestion,
  startersFrom, DEFAULT_STARTERS, forModel, parseLlms, parseIndex, searchPages, pageUrl, markdownUrl, isHtmlDocument,
  mount, install, rowLabel, ekaFrame, SHAPES, STILL, waveAt,
} = await import(out);

// Search row: the label for Mintlify's search box, nothing for an empty query.
assert.equal(rowLabel(''), null);
assert.equal(rowLabel('   '), null);
assert.equal(rowLabel('  create   session '), 'Ask AI about "create session"');
assert.ok(rowLabel('x'.repeat(100)).endsWith('…"'));
assert.equal(rowLabel('x'.repeat(100)), `Ask AI about "${'x'.repeat(60)}…"`);
assert.equal(rowLabel('x'.repeat(60)), `Ask AI about "${'x'.repeat(60)}"`, 'sixty is not cut');

// History: one conversation comes out, the rest stay in order.
assert.deepEqual(forgetOne([{id: 'a'}, {id: 'b'}, {id: 'c'}], 'b').map((s) => s.id), ['a', 'c']);

// Resuming: the tab's conversation comes back from the list, and nothing
// comes back when the tab was in none or the list has lost it.
const held = [{id: 'a', turns: [{from: 'you', text: 'q'}]}, {id: 'b', turns: []}];
assert.equal(resumable(held, 'a').id, 'a');
assert.equal(resumable(held, null), null);
assert.equal(resumable(held, 'gone'), null);

// About: the panel answers questions about itself, and only those.
for (const q of ['What can the Ask AI assistant do?', 'what can you do', 'Who are you?', 'help', 'What is Ask AI?', 'How do I use this?']) {
  assert.ok(isAboutQuestion(q), `about: ${q}`);
}
for (const q of ['What can an HIU do with a consent artefact?', 'Hi', 'What does ABDM-1016 mean?', 'can you help me link care contexts', 'what are you returning here']) {
  assert.ok(!isAboutQuestion(q), `not about: ${q}`);
}
assert.ok(isAboutQuestion(DEFAULT_STARTERS.find((s) => s.label === 'Learn about Ask AI').prompt), 'the starter is answered by the panel');
assert.ok(!/\u2014/.test(ABOUT), 'no em dash in the about answer');
assert.ok(!/NHCX|HIE-CM|payer|claim/i.test(ABOUT), 'the about answer is about the panel, not a gateway');
assert.ok(!/ABDM|ABHA|HIU|NHCX|HIE-CM|catalogue/i.test(ABOUT), 'about is Eka, not ABDM');
assert.ok(!/ABDM|ABHA/i.test(DEFAULT_STARTERS.map((s) => s.prompt).join(' ')));
assert.ok(DEFAULT_STARTERS.some((s) => s.prompt === 'What can the Ask AI assistant do?'));
assert.ok(isAboutQuestion('What can the Ask AI assistant do?'));

// Starters: a pill's label and the question it asks; old hosts still work.
assert.equal(startersFrom(''), DEFAULT_STARTERS);
assert.deepEqual(startersFrom('Create an ABHA | How do I create an ABHA?'),
  [{label: 'Create an ABHA', prompt: 'How do I create an ABHA?'}]);
assert.deepEqual(startersFrom('What is a care context?'),
  [{label: 'What is a care context?', prompt: 'What is a care context?'}]);
assert.equal(startersFrom('a\nb\nc\nd\ne\nf').length, 5, 'at most five');
assert.ok(DEFAULT_STARTERS.some((s) => s.prompt === 'What can the Ask AI assistant do?'), 'the assistant can be asked about itself');
assert.ok(DEFAULT_STARTERS.every((s) => s.label.split(' ').length <= 4), 'pills stay short');

// Transcript: the panel's own answers go with the question, so roles still alternate.
const said = (from, text, extra = {}) => ({from, text, ...extra});
const shown = forModel([
  said('you', 'q1'), said('assistant', 'a1'),
  said('you', 'What can you do?'), said('assistant', 'I answer', {local: true}),
  said('you', 'q2'),
]);
assert.deepEqual(shown.map((t) => t.text), ['q1', 'a1', 'q2'], 'the about pair is dropped whole');
for (let i = 1; i < shown.length; i += 1) assert.notEqual(shown[i].from, shown[i - 1].from);

// Pages: Eka's nested llms.txt parsed to paths, re-rooted on the widget's own docs origin.
const eka = [
  '- [Documentation (584 pages)](https://developer.eka.care/_llms/documentation.txt): Documentation.',
  '- [Changelog](https://developer.eka.care/changelog.md): Latest updates.',
  "- [Get Started](https://developer.eka.care/user-guides/get-started.md): <font color='blue'>SIGN UP</font>",
  '- [Get Started](https://developer.eka.care/user-guides/get-started.md): dup',
].join('\n');
assert.deepEqual(parseLlms(eka).map((e) => e.path), ['/changelog', '/user-guides/get-started']);
assert.equal(parseLlms(eka)[1].description, 'SIGN UP', 'HTML tags stripped from descriptions');
assert.deepEqual(parseIndex(eka), ['/_llms/documentation.txt']);
assert.equal(markdownUrl('https://developer.eka.care', '/user-guides/get-started'),
  'https://developer.eka.care/user-guides/get-started.md');
const entries = parseLlms([
  '- [Care context](https://developer.eka.care/concepts/care-context.md): A visit or episode.',
  '- [Link records](https://developer.eka.care/guides/link.md): Link records.',
  '- [Gateway session](https://developer.eka.care/api/gateway.md): Every call carries a token.',
].join('\n'));
assert.deepEqual(entries.map((e) => e.path), ['/concepts/care-context', '/guides/link', '/api/gateway'], 'stored without .md');
assert.equal(searchPages(entries, 'care')[0].title, 'Care context', 'a word starting the title wins');
assert.equal(searchPages(entries, 'token')[0].title, 'Gateway session', 'the description counts too');
assert.deepEqual(searchPages(entries, 'care gateway'), [], 'every word must match');
assert.deepEqual(searchPages(entries, '   '), []);
assert.doesNotThrow(() => searchPages(entries, '(m2 [ *'), 'regex characters are safe');
assert.equal(pageUrl('https://docs.example.org/', '/docs/a'), 'https://docs.example.org/docs/a');
assert.equal(markdownUrl('https://docs.example.org', '/docs/a'), 'https://docs.example.org/docs/a.md');
// An app shell served in place of a missing page is not the page.
assert.ok(isHtmlDocument('<!DOCTYPE html>\n<html lang="en">'));
assert.ok(isHtmlDocument('  <html>'));
assert.ok(!isHtmlDocument('# Care contexts\n\nA care context is <b>one</b> visit.'));
assert.ok(!isHtmlDocument('<details> in markdown'));

// History: named after the first question, one entry per conversation, fifty kept.
assert.equal(titleOf([{from: 'assistant', text: 'Hello'}, {from: 'you', text: '  ABDM\n1016  '}]), 'ABDM 1016');
assert.equal(titleOf([{from: 'assistant', text: 'Hello'}]), '');
assert.equal(titleOf([{from: 'you', text: 'x'.repeat(200)}]).length, 72);
const one = {id: 'a', at: 1, title: 'a', turns: []};
assert.deepEqual(remember([one], {...one, title: 'a2'}).length, 1, 'the same conversation replaces itself');
assert.equal(remember([one], {...one, title: 'a2'})[0].title, 'a2');
assert.equal(remember([one], {id: 'b', at: 2, title: 'b', turns: []})[0].id, 'b', 'newest first');
const many = Array.from({length: 60}, (_, i) => ({id: String(i), at: i, title: String(i), turns: []}));
assert.equal(many.reduce((list, s) => remember(list, s), []).length, 50, 'capped');
assert.equal(whenSaid(0, 30_000), 'just now');
assert.equal(whenSaid(0, 7 * 60_000), '7m ago');
assert.equal(whenSaid(0, 3 * 3600_000), '3h ago');
assert.equal(whenSaid(0, 2 * 86400_000), '2d ago');

// Headings: the second level only, fenced code left alone, markers stripped.
assert.deepEqual(headings('# Page\n## One\n### Deeper\n## `Two`'), ['One', 'Two']);
assert.deepEqual(headings('```sh\n## not a heading\n```\n## Real'), ['Real']);
assert.deepEqual(headings('no headings here'), []);

// Pacing: hold while thinking, drain a share of the backlog, never overrun it.
assert.equal(revealStep(0, 9999, true, false), 0);
assert.equal(revealStep(10, 0, false, false), 0, 'holds during the think');
assert.equal(revealStep(THINKING_BURST, 0, false, false) > 0, true, 'a big burst does not wait');
assert.equal(revealStep(10, THINKING_HOLD, false, false) > 0, true, 'the hold expires');
assert.equal(revealStep(600, 9999, true, false), 100, 'a sixth of the backlog');
assert.equal(revealStep(1, 9999, true, false), 1, 'never more than is waiting');
assert.equal(revealStep(600, 0, false, true), 600, 'reduced motion shows it all');

// Markdown: a paragraph, a list, and a fence that has not closed yet.
assert.deepEqual(toBlocks('one\ntwo'), [{kind: 'p', text: 'one two'}]);
assert.deepEqual(toBlocks('- a\n- b'), [{kind: 'ul', items: ['a', 'b']}]);
assert.deepEqual(toBlocks('1. a\n2. b'), [{kind: 'ol', items: ['a', 'b']}]);
assert.deepEqual(toBlocks('```json\n{"a":1}'), [
  {kind: 'code', text: '{"a":1}', lang: 'json', closed: false},
]);

// A mermaid fence is an ordinary code block: nothing here draws diagrams.
assert.deepEqual(toBlocks('```mermaid\nsequenceDiagram\n```'), [
  {kind: 'code', text: 'sequenceDiagram', lang: 'mermaid', closed: true},
]);

// Links resolve against the docs origin, and only http(s) survives.
assert.equal(absolute('javascript:alert(1)', 'https://d.example/'), null);
assert.equal(absolute('/docs/m1', 'https://d.example/'), 'https://d.example/docs/m1');
assert.equal(absolute('https://x.test/a', 'https://d.example'), 'https://x.test/a');
assert.equal(absolute('javascript:alert(1)', 'https://d.example'), null);

// Transport: the mock is a session like Synapse's, and says it is a mock.
const t = mockTransport({delayMs: 0});
assert.equal(t.isMock, true);
const ref = await t.start();
assert.match(ref.sessionId, /^mock-/);
assert.deepEqual(await t.start(ref), ref, 'resuming returns the same session');
const got = {text: '', progress: [], tips: null, done: 0};
await new Promise((resolve) => t.send({text: 'hi', files: []}, {
  onText: (d) => (got.text += d), onProgress: (p) => got.progress.push(p),
  onTips: (x) => (got.tips = x), onDone: () => { got.done++; resolve(); }, onError: assert.fail,
}));
assert.match(got.text, /mock/i, 'a mock reply says it is a mock');
assert.equal(got.tips.length, 2);
assert.ok(!/support page/i.test(got.text), 'the mock does not send readers to a support page');
assert.ok(!/\u2014/.test(got.text), 'no em dash in the mock reply');
// A tip is never the question just asked, however it was spaced or cased.
assert.deepEqual(tipsAfter('  how do I   get an API KEY? '), ['What can the Ask AI assistant do?']);
assert.equal(tipsAfter('Something else').length, 2);
assert.equal(got.done, 1);
assert.ok(got.progress.length >= 1);
// detach: nothing more arrives
const t2 = mockTransport({delayMs: 5}); await t2.start();
let after = 0; t2.send({text: 'x', files: []}, {onText: () => after++, onProgress() {}, onTips() {}, onDone: () => after++, onError() {}});
t2.detach(); await new Promise((r) => setTimeout(r, 50));
assert.equal(after, 0, 'detach stops delivery');
// The reveal loop's clock: a page with no frames (hidden, backgrounded)
// still steps on the timer, so an answer finishes and is saved; a frame that
// does come runs it once and stops the timer; cancelling runs neither.
{
  const clock = (frames) => {
    const timers = new Map(); let id = 0; const cleared = [];
    return {
      timers, cleared, frames,
      requestAnimationFrame: (f) => { frames.push(f); return frames.length; },
      cancelAnimationFrame: () => {},
      setTimeout: (f, ms) => { timers.set(++id, {f, ms}); return id; },
      clearTimeout: (n) => { cleared.push(n); timers.delete(n); },
    };
  };
  let runs = 0;
  const hidden = clock([]); hidden.requestAnimationFrame = () => 1; // no frame ever comes
  nextFrame(() => runs++, hidden);
  const [[, waiting]] = [...hidden.timers];
  assert.equal(waiting.ms, FRAME_FALLBACK);
  waiting.f();
  assert.equal(runs, 1, 'a hidden page still steps on the timer');

  runs = 0;
  const shown = clock([]);
  nextFrame(() => runs++, shown);
  shown.frames[0]();
  assert.equal(shown.timers.size, 0, 'the frame stops the timer');
  shown.frames[0]();
  assert.equal(runs, 1, 'runs once');

  runs = 0;
  const gone = clock([]);
  const cancel = nextFrame(() => runs++, gone);
  cancel();
  gone.frames[0]?.();
  assert.equal(gone.timers.size, 0);
  assert.equal(runs, 0, 'cancelled runs neither');
}
// No agent id is the mock; an agent id is Synapse, which is not wired yet.
assert.equal(createTransport({}).isMock, true);

// The bar: shown where there is no hero, and on the landing page only once
// the hero's bottom edge has left the top of the viewport.
const heroAt = (bottom) => ({getBoundingClientRect: () => ({bottom})});
assert.equal(pastHero(null), true, 'no hero: the bar shows');
assert.equal(pastHero(heroAt(600)), false, 'hero on screen: the bar waits');
assert.equal(pastHero(heroAt(1)), false, 'a sliver of hero still counts');
assert.equal(pastHero(heroAt(0)), true, 'hero scrolled away: the bar shows');
assert.equal(pastHero(heroAt(-300)), true);

// Ground: read from the colour actually painted, so the landing page's own
// light ground wins over the site's or the system's dark.
assert.equal(groundOfColor('rgb(250, 250, 249)'), 'light');
assert.equal(groundOfColor('rgb(10, 10, 10)'), 'dark');
assert.equal(groundOfColor('rgba(0, 0, 0, 0)'), null, 'transparent paints nothing');
assert.equal(groundOfColor('rgba(255, 255, 255, 0.8)'), 'light');
assert.equal(groundOfColor('rgb(10 10 10 / 0.9)'), 'dark', 'space syntax');
assert.equal(groundOfColor('transparent'), null);
// Where nothing paints, the page's declared color-scheme (Mintlify sets it from its Light / Dark / System toggle)
// decides before the machine's preference does.
assert.equal(groundOfScheme('light'), 'light');
assert.equal(groundOfScheme('dark'), 'dark');
assert.equal(groundOfScheme('normal'), null, 'no declared scheme');
assert.equal(groundOfScheme('light dark'), null, 'either scheme is no answer');
assert.equal(groundOfScheme(''), null);
// A wide screen docks the panel beside the page; a narrow one keeps it over the page, full width.
assert.equal(DOCK_MIN, 1024);
assert.ok(docksAt(1440) && docksAt(1024), 'desktop widths dock');
assert.ok(!docksAt(1023) && !docksAt(390), 'tablets and phones keep the overlay');
// Synapse transport, against a stand-in for @eka-care/medassist-core's SynapseSDK.
{
  const made = [];
  class FakeSdk {
    constructor(config) { this.config = config; this.listeners = new Map(); this.sent = []; this.ended = false; made.push(this); }
    on(event, fn) { if (!this.listeners.has(event)) this.listeners.set(event, new Set()); this.listeners.get(event).add(fn); }
    off(event, fn) { this.listeners.get(event)?.delete(fn); }
    emit(event, data) { for (const fn of [...(this.listeners.get(event) ?? [])]) fn(data); }
    count() { return [...this.listeners.values()].reduce((n, set) => n + set.size, 0); }
    async startSession(existing) {
      this.startedWith = existing;
      this.config.callbacks?.onTokenExchange?.({sess_token: 'sess-1', refresh_token: 'ref-1', level: 'guest', user_id: 'u1', expires_in: 1800});
      return {session_id: existing?.session_id ?? 's-new'};
    }
    async sendMessage(options) { this.sent.push(options); if (options.message === 'fail') throw new Error('offline'); }
    endSession() { this.ended = true; }
  }
  const sdkFactory = (config) => new FakeSdk(config);

  const t = createTransport({agentId: 'agent-1', sdkFactory});
  assert.equal(t.isMock, false, 'an agent id talks to MedAssist, not the mock');

  // A guest: no auth token, the widget channel, production unless told otherwise.
  const ref = await t.start();
  const sdk = made.at(-1);
  assert.equal(sdk.config.agentId, 'agent-1');
  assert.equal(sdk.config.environment, 'production');
  assert.equal(sdk.config.channel, 'widget');
  assert.equal(sdk.config.connectionType, 'socket', 'talks over the WebSocket, not the HTTP stream CloudFront cuts off');
  assert.ok(!('authToken' in sdk.config), 'guests send no auth token');
  assert.equal(sdk.startedWith, undefined);
  assert.deepEqual(ref, {sessionId: 's-new', sessionToken: 'sess-1', refreshToken: 'ref-1', level: 'guest'});

  // Streaming: chunks are deltas; a progress or tool step between them starts a new paragraph.
  const got = {text: '', progress: [], tips: [], done: 0, errors: []};
  const handlers = {
    onText: (d) => { got.text += d; }, onProgress: (p) => got.progress.push(p), onTips: (x) => got.tips.push(x),
    onDone: () => { got.done++; }, onError: (e) => got.errors.push(e),
  };
  t.send({text: 'How do I create an ABHA?', files: [], page: {title: 'Login ABHA', url: 'https://developer.eka.care/docs/hie-cm/workflows/login-abha', markdown: '# x'}}, handlers);
  assert.equal(sdk.sent.at(-1).message, 'How do I create an ABHA?\n\nI am reading this page: Login ABHA (https://developer.eka.care/docs/hie-cm/workflows/login-abha)');
  sdk.emit('message_chunk', {data: {text: 'Start '}, messageId: 'm1'});
  sdk.emit('message_chunk', {data: {text: 'here.'}, messageId: 'm1'});
  sdk.emit('tool_start', {data: {name: 'search_eka_developer_platform_ap_is'}, messageId: 'm1'});
  sdk.emit('progress_message', {data: {text: 'Searching the docs'}, messageId: 'm1'});
  sdk.emit('message_chunk', {data: {text: 'Then verify.'}, messageId: 'm1'});
  sdk.emit('tips_message', {data: {tips: ['What is a care context?', {text: 'How does consent work?'}]}, messageId: 'm1'});
  sdk.emit('end_of_stream');
  assert.equal(got.text, 'Start here.\n\nThen verify.');
  assert.deepEqual(got.progress, ['Searching the docs', 'Searching the docs']);
  assert.deepEqual(got.tips, [['What is a care context?', 'How does consent work?']]);
  assert.equal(got.done, 1);
  assert.equal(sdk.count(), 0, 'the reply is over, so its listeners are gone');

  // A stalled answer: silence past the stall window ends the turn with a plain message; any event resets the window.
  {
    const st = createTransport({agentId: 'agent-1', sdkFactory, stallMs: 40});
    await st.start();
    const s2 = made.at(-1);
    const out = {text: '', done: 0, errors: []};
    const h = {onText: (d) => { out.text += d; }, onProgress: () => {}, onTips: () => {}, onDone: () => { out.done++; }, onError: (e) => out.errors.push(e)};
    st.send({text: 'slow', files: []}, h);
    await new Promise((r) => setTimeout(r, 25));
    s2.emit('progress_message', {data: {text: 'Searching the docs'}, messageId: 'm9'});
    await new Promise((r) => setTimeout(r, 25));
    assert.deepEqual(out.errors, [], 'an event inside the window keeps the turn alive');
    await new Promise((r) => setTimeout(r, 40));
    assert.deepEqual(out.errors, [STALLED], 'silence past the window ends the turn');
    assert.equal(s2.count(), 0, 'a stalled reply stops listening');
    s2.emit('message_chunk', {data: {text: 'late'}, messageId: 'm9'});
    assert.equal(out.text, '', 'nothing arrives after the turn ended');

    st.send({text: 'quick', files: []}, h);
    s2.emit('end_of_stream');
    await new Promise((r) => setTimeout(r, 60));
    assert.deepEqual(out.errors, [STALLED], 'a finished answer never times out');
  }

  // A choice prompt (elicit_selection pills): its text is the answer, its options the follow-ups.
  const pick = {text: '', tips: [], done: 0, errors: []};
  t.send({text: 'Which flow?', files: []}, {
    onText: (d) => { pick.text += d; }, onProgress: () => {}, onTips: (x) => pick.tips.push(x),
    onDone: () => { pick.done++; }, onError: (e) => pick.errors.push(e),
  });
  sdk.emit('tool_call', {messageId: 'm2', data: {tool_type: 'elicitation', tool_id: 'tu1', tool_name: 'elicit_selection',
    details: {component: 'pills', input: {text: 'Pick a login method:', options: [{label: 'Mobile OTP', value: 'mobile'}, {label: 'Aadhaar OTP', value: 'aadhaar'}]}}}});
  sdk.emit('end_of_stream');
  assert.equal(pick.text, 'Pick a login method:');
  assert.deepEqual(pick.tips, [['Mobile OTP', 'Aadhaar OTP']]);
  assert.equal(pick.done, 1);

  // Errors: the server's message when it has one, the fallback otherwise, and a failed send.
  t.send({text: 'q2', files: []}, handlers);
  sdk.emit('error', {data: {code: 'server_error', msg: 'Agent unavailable'}});
  assert.equal(got.errors.at(-1), 'Agent unavailable');
  assert.equal(sdk.count(), 0);
  t.send({text: 'fail', files: []}, handlers);
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(got.errors.at(-1), UNREACHABLE);

  // Detach stops delivery; end closes the session.
  t.send({text: 'q3', files: []}, handlers);
  t.detach();
  assert.equal(sdk.count(), 0);
  await t.end();
  assert.equal(sdk.ended, true);

  // Resuming: the saved tokens seed the SDK, and the session is reopened by its id.
  const t2 = createTransport({agentId: 'agent-1', environment: 'staging', sdkFactory});
  await t2.start({sessionId: 's-old', sessionToken: 'sess-0', refreshToken: 'ref-0', level: 'guest'});
  const sdk2 = made.at(-1);
  assert.equal(sdk2.config.environment, 'staging');
  assert.equal(sdk2.config.refreshToken, 'ref-0');
  assert.equal(sdk2.config.sessToken, 'sess-0');
  assert.equal(sdk2.config.level, 'guest');
  assert.deepEqual(sdk2.startedWith, {session_id: 's-old'});
}

// mount: one element per document, however often the script runs.
function fakeDocument() {
  const children = [];
  const element = (tag) => {
    const attrs = new Map();
    return {tagName: tag.toUpperCase(), setAttribute: (k, v) => attrs.set(k, String(v)), getAttribute: (k) => attrs.get(k) ?? null,
      hasAttribute: (k) => attrs.has(k), removeAttribute: (k) => attrs.delete(k)};
  };
  return {
    body: {children, append: (...nodes) => children.push(...nodes)},
    createElement: element,
    querySelector: (tag) => children.find((c) => c.tagName === tag.toUpperCase()) ?? null,
  };
}
const doc = fakeDocument();
const a = mount(doc); const b = mount(doc);
assert.equal(a, b, 'mount is idempotent');
assert.equal(doc.body.children.length, 1);
assert.equal(a.tagName, 'EKA-ASK-AI');
assert.equal(a.getAttribute('auth-token'), null, 'auth-token is left unset');

// install: a script evaluated twice adds one set of listeners and one interval.
const calls = {listen: 0, interval: 0, define: 0, observe: 0};
const defined = new Map();
const keydown = [];
const win = {
  customElements: {get: (n) => defined.get(n), define: (n, c) => { calls.define++; defined.set(n, c); }},
  addEventListener: (type, fn) => { calls.listen++; if (type === 'keydown') keydown.push(fn); },
  setInterval: () => calls.interval++,
  setTimeout: () => 0,
  requestAnimationFrame: () => 0,
  MutationObserver: class { observe() { calls.observe++; } },
};
const page = {...fakeDocument(), readyState: 'complete', addEventListener: () => calls.listen++};
assert.equal(install(win, page), true);
assert.equal(install(win, page), false, 'second install is a no-op');
assert.deepEqual(calls, {listen: 5, interval: 1, define: 1, observe: 2});
assert.equal(page.body.children.length, 1);

// ⌘I (Ctrl+I off a Mac) opens Ask AI on a new chat from anywhere, and closes it again; nothing else does.
{
  const panel = page.body.children[0];
  let fresh = 0;
  panel.startNew = () => { fresh++; panel.setAttribute('open', ''); };
  const press = (init) => {
    const event = {key: 'i', metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, isComposing: false, prevented: false, ...init,
      preventDefault() { this.prevented = true; }};
    for (const fn of keydown) fn(event);
    return event;
  };
  assert.equal(keydown.length, 1, 'one shortcut listener');
  assert.ok(press({metaKey: true}).prevented, 'the browser does not also act on it');
  assert.ok(panel.hasAttribute('open'), '⌘I opens the panel');
  assert.equal(fresh, 1, 'on a new chat, not the last one');
  press({ctrlKey: true, key: 'I'});
  assert.ok(!panel.hasAttribute('open'), 'Ctrl+I closes it again, whatever the case of the key');
  assert.equal(fresh, 1, 'closing starts nothing');
  for (const other of [{key: 'i'}, {metaKey: true, shiftKey: true}, {ctrlKey: true, altKey: true}, {metaKey: true, key: 'k'}, {metaKey: true, isComposing: true}]) {
    assert.ok(!press(other).prevented && !panel.hasAttribute('open'), JSON.stringify(other));
  }
}

// Last: this replaces a global the tests above may rely on.
// history keeps the session pair; blocked storage never throws
assert.deepEqual(remember([], {id: 'a', at: 1, title: 'q', turns: [], session: ref})[0].session, ref);
globalThis.localStorage = {getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }};
assert.deepEqual(load(), []);
assert.doesNotThrow(() => save([{id: 'a', at: 1, title: 'q', turns: []}]));

console.log('ok');

// Eka orb: one line of dots that transforms Eka mark -> stethoscope heart -> lotus (ABDM) -> audio wave (Scribe) -> mark.
{
  const near = (dots, shape, size, tol) => {
    const pts = shape.map(([x, y]) => [size / 2 + x * size, size / 2 + y * size]);
    return dots.every((d) => pts.some(([x, y]) => Math.hypot(d.x - x, d.y - y) <= tol));
  };
  const big = ekaFrame(64, STILL);
  assert.ok(big.length >= 24, `a 64px orb draws enough dots to read the mark, got ${big.length}`);
  assert.ok(big.every((d) => d.x > 0 && d.x < 64 && d.y > 0 && d.y < 64 && d.r > 0), 'every dot sits on the canvas');
  assert.ok(near(big, SHAPES.eka, 64, 1.5), 'the still frame is the Eka mark');
  assert.ok(near(ekaFrame(64, 0), SHAPES.eka, 64, 1.5), 'the loop opens on the Eka mark');

  // One line of dots, start to end, at an even spacing. The mark and the heart are open strokes; the lotus is the
  // ABDM lotus's outline, so its ends meet.
  const gaps = big.slice(1).map((d, i) => Math.hypot(d.x - big[i].x, d.y - big[i].y));
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  // Spacing is even along the line; straight-line gaps only shrink where it turns back on itself (the heart's dip).
  assert.ok(Math.max(...gaps) < mean * 1.6 && Math.min(...gaps) > mean * 0.4, 'one even line of dots, with no holes');
  for (const name of ['eka', 'heart']) {
    const sh = SHAPES[name];
    assert.ok(Math.hypot(sh[0][0] - sh.at(-1)[0], sh[0][1] - sh.at(-1)[1]) > 0.02, `${name} is an open line`);
  }

  // A 64px orb passes through all four in order; a small one shows only the mark.
  // A shape counts when it holds for a run of frames, so a frame passing close to one mid-morph does not.
  const seen = (size, step = 0.05) => {
    const out = [];
    const run = {};
    for (let t = 0; t < 30; t += step) {
      const dots = ekaFrame(size, t);
      const shapes = {...SHAPES, wave: waveAt(t)};
      for (const [name, shape] of Object.entries(shapes)) {
        run[name] = near(dots, shape, size, size * 0.02) ? (run[name] ?? 0) + 1 : 0;
        if (run[name] === 6 && out.at(-1) !== name) out.push(name);
      }
    }
    return out;
  };
  const order = seen(64);
  assert.deepEqual(order.slice(0, 5), ['eka', 'heart', 'lotus', 'wave', 'eka']);
  assert.deepEqual(seen(20), ['eka'], 'beside "Thinking", the orb holds the Eka mark only');

  // The heart beats, and the wave moves while it holds.
  const reach = (t) => Math.max(...ekaFrame(64, t).map((d) => Math.hypot(d.x - 32, d.y - 32)));
  const beats = [];
  for (let t = 0; t < 30; t += 0.02) if (near(ekaFrame(64, t), SHAPES.heart, 64, 4)) beats.push(reach(t));
  assert.ok(Math.max(...beats) > Math.min(...beats) * 1.05, 'the heart pulses');
  const holds = [];
  for (let t = 0; t < 30; t += 0.05) if (near(ekaFrame(64, t), waveAt(t), 64, 1)) holds.push(t);
  const w1 = ekaFrame(64, holds[0]), w2 = ekaFrame(64, holds[0] + 0.3);
  assert.ok(w1.some((d, i) => w2[i] && Math.abs(d.y - w2[i].y) > 0.5), 'the wave moves');
}

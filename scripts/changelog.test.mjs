// The changelog rules and templates, held to one real change in this repository and to a small case per rule.
//
// The fixtures are the facts extractor's output for registration.yml on either side of 119c889, the merge that
// brought the data push entry API (#698) and its 15 minute expiry note (#699) into this branch's layout. What a
// developer can act on is known: one new call. The expiry is prose, which never earns an entry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { normalisePath, operationKey } from './changelog-facts.mjs';
import { entriesFor, isBreaking, releaseOf } from './changelog-rules.mjs';
import { END, headingFor, isoDate, longDate, render, renderBlock, renderPage, stripGenerated } from './changelog-render.mjs';
import { pageRules } from './docs-check.mjs';

const fixture = (name) => JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', 'changelog', `${name}.json`), 'utf8'));
const before = fixture('before-data-push-entry');
const after = fixture('after-data-push-entry');

const op = (method, p, extra = {}) => ({
  id: null, kind: 'call', method, path: p, server: 'https://api.eka.care', security: ['auth'], params: [],
  required: [], properties: [], responses: ['200'], page: `api-sdk/x${p}`, product: 'Medical Scribe', ...extra,
});
const facts = (modules, site = {}) => ({
  modules: Object.fromEntries(Object.entries(modules).map(([file, ops]) => [file, {
    file, operations: Object.fromEntries(ops.map((o) => [operationKey(o.method === 'WEBHOOK' ? 'WEBHOOK' : o.method, o.path), o])),
  }])),
  site: { sdks: {}, plugins: {}, procedures: {}, corrections: {}, ...site },
});
const of = (entries, kind) => entries.filter((e) => e.kind === kind);

test('a placeholder rename is the same address', () => {
  assert.equal(normalisePath('/v1/{transaction_id}/entries/{content_ref}'), '/v1/{}/entries/{}');
  assert.equal(operationKey('get', '/v1/{a}'), operationKey('GET', '/v1/{b}'));
});

test('a baseline produces no entries, and the same snapshot twice produces none', () => {
  assert.deepEqual(entriesFor({ modules: {} }, after, '2026-10-28'), []);
  assert.deepEqual(entriesFor(after, after, '2026-10-28'), []);
});

test('the data push merge: one call added to HIE-CM, and nothing for the expiry prose', () => {
  const entries = entriesFor(before, after, '2026-10-19');
  assert.equal(entries.length, 1, entries.map(headingFor).join('\n'));
  const [e] = entries;
  assert.equal(e.kind, 'added');
  assert.equal(e.product, 'HIE-CM');
  assert.equal(e.page, 'docs/hie-cm/changelog');
  assert.equal(e.breaking, false);
  assert.deepEqual(e.items.map((i) => `${i.method} ${i.path}`), ['GET /abdm/v1/hiu/care-context/data/{transaction_id}/entries/{content_ref}']);
  assert.equal(e.items[0].page, 'api-sdk/hie-cm/care-contexts/data-push-entry');
  assert.equal(headingFor(e), 'HIE-CM: one call added');
});

test('what fails old code is breaking, and what does not is not', () => {
  assert.equal(isBreaking({ field: 'params', from: ['header:X-Id'], to: ['header:x-id', 'query:limit!'] }), true);
  assert.equal(isBreaking({ field: 'params', from: ['query:limit'], to: ['query:limit!'] }), true);
  assert.equal(isBreaking({ field: 'params', from: [], to: ['query:limit'] }), false);
  assert.equal(isBreaking({ field: 'required', from: [], to: ['type'] }), true);
  assert.equal(isBreaking({ field: 'properties', from: [], to: ['note'] }), false);
  assert.equal(isBreaking({ field: 'responses', from: ['200'], to: ['200', '409'] }), false);
  assert.equal(isBreaking({ field: 'server', from: 'https://a', to: 'https://b' }), true);
  assert.equal(isBreaking({ field: 'security', from: ['a'], to: ['b'] }), true);
});

test('header case and path parameter names are not changes', () => {
  const a = facts({ 's.yaml': [op('POST', '/v1/{id}', { params: ['header:X-Partner-Id!', 'path:{}!'] })] });
  const b = facts({ 's.yaml': [op('POST', '/v1/{session}', { params: ['header:x-partner-id!', 'path:{}!'] })] });
  assert.deepEqual(entriesFor(a, b, '2026-10-28'), []);
});

test('a change in place splits into a breaking entry and a plain one', () => {
  const a = facts({ 's.yaml': [op('POST', '/v1/a'), op('POST', '/v1/b')] });
  const b = facts({ 's.yaml': [op('POST', '/v1/a', { required: ['mode'], properties: ['mode'] }), op('POST', '/v1/b', { responses: ['200', '409'] })] });
  const entries = of(entriesFor(a, b, '2026-10-28'), 'changed');
  assert.equal(entries.length, 2);
  const hard = entries.find((e) => e.breaking);
  assert.equal(hard.items[0].path, '/v1/a');
  assert.deepEqual(hard.items[0].changes.map((c) => c.field), ['required'], 'requires mode already says the body has it');
  assert.match(render(hard), /requires `mode` in the body/);
  assert.match(render(entries.find((e) => !e.breaking)), /can return `409`/);
});

test('withdrawn and new calls, a new address by operationId, and a call that only moved spec', () => {
  const a = facts({
    'a.yaml': [op('GET', '/v1/old'), op('GET', '/v1/gone'), op('GET', '/v1/x', { id: 'getX' }), op('GET', '/v1/moves')],
    'b.yaml': [],
  });
  const b = facts({
    'a.yaml': [op('GET', '/v1/old'), op('GET', '/v2/x', { id: 'getX' }), op('GET', '/v1/new')],
    'b.yaml': [op('GET', '/v1/moves')],
  });
  const entries = entriesFor(a, b, '2026-10-28');
  assert.deepEqual(of(entries, 'withdrawn').flatMap((e) => e.items.map((i) => i.path)), ['/v1/gone']);
  assert.equal(of(entries, 'withdrawn')[0].breaking, true);
  assert.deepEqual(of(entries, 'path-changed')[0].items.map((i) => [i.from, i.to]), [['/v1/x', '/v2/x']]);
  assert.deepEqual(of(entries, 'added').flatMap((e) => e.items.map((i) => i.path)), ['/v1/new']);
  assert.ok(!JSON.stringify(entries).includes('/v1/moves'), 'a call in another spec with the same contract is no news');
});

test('one call in several products lands on each product\'s changelog', () => {
  const a = facts({ 'r.yml': [op('GET', '/hie'), op('GET', '/uhi')] });
  const b = facts({ 'r.yml': [op('GET', '/hie'), op('GET', '/uhi'), op('GET', '/hie2', { product: 'HIE-CM' }), op('GET', '/ipd', { product: 'IPD' }), op('GET', '/auth', { product: null })] });
  const added = of(entriesFor(a, b, '2026-10-28'), 'added');
  const page = (p) => added.find((e) => e.items.some((i) => i.path === p)).page;
  assert.equal(page('/hie2'), 'docs/hie-cm/changelog');
  assert.equal(page('/ipd'), 'docs/get-started/emr-changelog');
  assert.equal(page('/auth'), null, 'no product: the platform changelog alone');
});

test('the same change across specs of one product is one entry', () => {
  const a = facts({ 'a.yaml': [op('GET', '/a1'), op('GET', '/a2')], 'b.yaml': [op('GET', '/b1')] });
  const hdr = { params: ['header:X-Workspace!'] };
  const b = facts({ 'a.yaml': [op('GET', '/a1', hdr), op('GET', '/a2', hdr)], 'b.yaml': [op('GET', '/b1', hdr)] });
  const entries = entriesFor(a, b, '2026-10-28');
  assert.deepEqual(entries.map((e) => e.kind), ['shared-change']);
  assert.equal(entries[0].count, 3);
  assert.equal(entries[0].breaking, true);
  assert.equal(headingFor(entries[0]), 'Medical Scribe: three calls require the header `X-Workspace`');
});

test('SDK releases: a minor or major is news, a patch is not, and 0.x minors are breaking', () => {
  assert.equal(releaseOf('3.0.57', '3.0.58'), null);
  assert.deepEqual(releaseOf('3.0.58', '3.1.0'), { breaking: false });
  assert.deepEqual(releaseOf('3.1.0', '4.0.0'), { breaking: true });
  assert.deepEqual(releaseOf('v0.4.5', 'v0.5.0'), { breaking: true });
  assert.deepEqual(releaseOf('java/v1.0.0', 'java/v1.1.0'), { breaking: false });
  assert.equal(releaseOf(null, '1.0.0'), null, 'a version never read before is not a release');
  const sdk = (version, documented = true) => ({ sdks: { 'echo-sdk': { registry: 'github', repo: 'eka-care/echo-sdk', product: 'Medical Agents', page: 'docs/agents/agent-kit/installation', documented, version } } });
  const run = (x, y) => entriesFor(facts({ 's.yaml': [op('GET', '/a')] }, x), facts({ 's.yaml': [op('GET', '/a')] }, y), '2026-10-28');
  const [release] = run(sdk('v0.4.5'), sdk('v0.5.0'));
  assert.equal(release.kind, 'sdk-release');
  assert.equal(release.breaking, true);
  assert.match(render(release), /releases\/tag\/v0\.5\.0/);
  assert.deepEqual(run(sdk('v0.4.5'), sdk('v0.4.6')), []);
  assert.deepEqual(run({}, sdk('v0.4.5')).map((e) => e.kind), ['sdk-added']);
  assert.deepEqual(run(sdk('v0.4.5'), sdk('v0.4.5', false)).map((e) => e.kind), ['sdk-removed']);
  assert.deepEqual(run({ sdks: null }, sdk('v0.4.5')), [], 'a checkout with no SDK list states no SDK facts');
});

test('plugins, skills, procedures and corrections', () => {
  const plugin = (version, skills) => ({ 'eka-scribe': { version, product: 'Medical Scribe', page: 'docs/scribe/build-with-ai', skills } });
  const a = facts({ 's.yaml': [op('GET', '/a')] }, { plugins: plugin('0.1.0', ['eka-scribe']) });
  const b = facts({ 's.yaml': [op('GET', '/a')] }, {
    plugins: plugin('0.2.0', ['eka-scribe', 'eka-scribe-debug']),
    procedures: { 'docs/scribe/workflows/dictate': { title: 'Dictate a note', description: 'Record, then fetch the note', product: 'Medical Scribe' } },
    corrections: { 'docs/scribe/limits': [{ date: '2026-10-28', was: 'files up to 10 MB are accepted', now: 'files up to 25 MB are accepted', product: 'Medical Scribe' }] },
  });
  const kinds = entriesFor(a, b, '2026-10-28').map((e) => e.kind).sort();
  assert.deepEqual(kinds, ['correction', 'plugin-version', 'procedure', 'skill-added']);
  assert.deepEqual(entriesFor(b, b, '2026-10-28'), [], 'a declaration is news once');
});

test('entry ids are stable', () => {
  const a = facts({ 's.yaml': [op('GET', '/a')] });
  const b = facts({ 's.yaml': [op('GET', '/a'), op('GET', '/b')] });
  assert.equal(entriesFor(a, b, '2026-10-28')[0].id, entriesFor(a, b, '2026-11-02')[0].id);
});

test('dates read the way the hand-written blocks write them', () => {
  assert.equal(longDate('2026-10-08'), 'October 8, 2026');
  assert.equal(isoDate('October 8, 2026'), '2026-10-08');
  assert.equal(isoDate('Week of March 29'), null);
});

const PAGE = `---
title: "Changelog"
type: changelog
---

import { SubscribeForm } from '/snippets/subscribe-form.jsx';

<SubscribeForm />

<Update label="October 30, 2026" description="Hand" tags={["Feature"]}>

## Added

- **Something people wrote.** Kept as it is.

</Update>

<Update
  label="October 13, 2026"
  description="Older"
>

## Changed

- **Older.** Also kept.

</Update>
`;

test('rendering keeps every hand-written byte, places blocks by date, and is idempotent', () => {
  const entries = entriesFor(before, after, '2026-10-19');
  const byDate = new Map([['2026-10-19', entries]]);
  const out = renderPage(PAGE, 'docs/hie-cm/changelog', byDate);
  assert.equal(stripGenerated(out), PAGE);
  assert.equal(renderPage(out, 'docs/hie-cm/changelog', byDate), out);
  assert.ok(out.indexOf('October 30, 2026') < out.indexOf('October 19, 2026'));
  assert.ok(out.indexOf('October 19, 2026') < out.indexOf('October 13, 2026'));
  assert.ok(out.indexOf('<SubscribeForm />') < out.indexOf('generated changelog'));
  assert.equal(renderPage(PAGE, 'docs/get-started/emr-changelog', byDate), PAGE, 'an entry lands only on its product page');
  const noNewline = PAGE.trimEnd();
  assert.equal(renderPage(noNewline, 'docs/get-started/emr-changelog', byDate), noNewline, 'a page with nothing to add is left byte for byte');
  assert.equal(stripGenerated(renderPage(noNewline, 'docs/get-started/changelog', byDate)), noNewline);
  assert.ok(renderPage(PAGE, 'docs/get-started/changelog', byDate).includes('HIE-CM: one call added'), 'and rolls up to the platform');
  const older = renderPage(PAGE, 'docs/hie-cm/changelog', new Map([['2026-01-01', entries]]));
  assert.ok(older.trimEnd().endsWith(END), 'older than every hand-written block: at the end');
});

test('every template renders within the writing rules docs-check enforces', () => {
  const plugin = { 'eka-scribe': { version: '0.1.0', product: 'Medical Scribe', page: 'docs/scribe/build-with-ai', skills: ['eka-scribe'] } };
  const sdk = (version) => ({ '@eka-care/ekascribe-ts-sdk': { registry: 'npm', repo: null, product: 'Medical Scribe', page: 'api-sdk/scribe/sdks/ekascribe-ts-sdk', documented: true, version } });
  const many = Array.from({ length: 9 }, (_, i) => op('POST', `/v1/thing-${i}/{id}`));
  const a = facts({ 'a.yaml': [...many, op('GET', '/gone'), op('GET', '/x', { id: 'x' })], 'b.yaml': [op('GET', '/b1')] }, { plugins: plugin, sdks: sdk('3.0.58') });
  const b = facts({
    'a.yaml': [...many.map((o) => ({ ...o, params: ['header:X-Workspace!', 'query:page'], required: ['mode'], responses: ['200', '409'] })), op('GET', '/v2/x', { id: 'x' }), op('GET', '/new')],
    'b.yaml': [op('GET', '/b1', { params: ['header:X-Workspace!', 'query:page'] })],
  }, {
    plugins: { 'eka-scribe': { ...plugin['eka-scribe'], version: '0.2.0', skills: ['eka-scribe', 'eka-scribe-debug'] } },
    sdks: sdk('4.0.0'),
    procedures: { 'docs/scribe/workflows/dictate': { title: 'Dictate a note', description: 'Record, then fetch the note', product: 'Medical Scribe' } },
    corrections: { 'docs/scribe/limits': [{ date: '2026-10-28', was: 'files up to 10 MB are accepted', now: 'files up to 25 MB are accepted', product: 'Medical Scribe' }] },
  });
  const entries = [...entriesFor(before, after, '2026-10-19'), ...entriesFor(a, b, '2026-10-28')];
  const kinds = new Set(entries.map((e) => e.kind));
  for (const k of ['added', 'withdrawn', 'path-changed', 'changed', 'shared-change', 'sdk-release', 'plugin-version', 'skill-added', 'procedure', 'correction']) assert.ok(kinds.has(k), `no ${k} entry to check`);
  for (const e of entries) {
    const text = `${headingFor(e)}. ${render(e)}`;
    assert.ok(!/—/.test(text), `em dash in ${e.kind}`);
    assert.ok(!/undefined|null|\[object/.test(text), `${e.kind}: ${text}`);
    assert.ok(!/^\d/.test(headingFor(e).split(': ')[1] ?? ''), `heading starts with a numeral: ${headingFor(e)}`);
  }
  const block = renderBlock('2026-10-28', entries.filter((e) => e.date === '2026-10-28'), 'docs/get-started/changelog');
  const r = pageRules(block, 'changelog');
  assert.deepEqual(r.fail, [], JSON.stringify(r.fail));
  assert.match(block, /tags=\{\["Breaking","API","SDK","AI tools","Docs"\]\}/);
});

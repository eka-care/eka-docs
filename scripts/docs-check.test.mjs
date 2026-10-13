import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkProduct, findProducts, normalizeOp, pageRules, run } from './docs-check.mjs';

const SPEC = `openapi: 3.1.0
paths:
  /v1/things:
    post:
      operationId: createThing
      tags: [Things]
      responses:
        '400':
          content:
            application/json:
              example: { code: "THG-1001" }
  /v1/things/{id}:
    get:
      operationId: getThing
      tags: [Things]
webhooks:
  thing.created: {}
`;

function makeRepo(files) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-check-'));
  for (const [f, body] of Object.entries(files)) {
    const full = path.join(repo, f);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, body);
  }
  return repo;
}

const page = (fm, body = '') => `---\n${fm}\n---\n${body}`;
const base = {
  'things/product.yaml': 'slug: things\nopenapi:\n  - api-reference/openapi.yaml\nenforce: true\n',
  'things/api-reference/openapi.yaml': SPEC,
  'things/overview.mdx': page('title: Overview\ntype: overview'),
  'things/errors.mdx': page('title: Errors\ntype: errors', '| THG-1001 | bad | retry |\n| THG-9999 | unknown | |'),
  'things/journeys/make-a-thing.mdx': page('title: Make a thing\ntype: journey'),
  'things/workflows/create.mdx': page('title: Create a thing\ntype: workflow\njourney: make-a-thing\noperations:\n  - POST /v1/things\nwebhooks:\n  - thing.created'),
  'things/api-reference/things/create-thing.mdx': page('openapi: "POST /v1/things"'),
};

const check = (repo, opts) => checkProduct(repo, findProducts(repo)[0], opts);
const msgs = (list) => list.map((i) => i.msg);

test('normalizeOp accepts bare and file-prefixed forms, any method case', () => {
  assert.deepEqual(normalizeOp('post /a/b'), { spec: null, op: 'POST /a/b' });
  assert.deepEqual(normalizeOp('"/x/spec.yaml GET /a"'), { spec: 'x/spec.yaml', op: 'GET /a' });
  assert.equal(normalizeOp('nonsense'), null);
});

test('a compliant product has no failures and reports the expected warnings', () => {
  const r = check(makeRepo(base));
  assert.deepEqual(r.fail, []);
  assert.ok(msgs(r.warn).some((m) => m.includes('GET /v1/things/{id} is used by no workflow')));
  assert.ok(msgs(r.warn).some((m) => m.includes('GET /v1/things/{id} has no reference page')));
  assert.ok(msgs(r.warn).some((m) => m.includes('THG-9999 is on the errors page')));
  assert.ok(!msgs(r.warn).some((m) => m.includes('THG-1001')));
  assert.ok(msgs(r.warn).some((m) => m.includes('no testing page')));
  assert.equal(r.enforce, true);
});

test('missing journey or workflow, missing type, unknown operation all fail', () => {
  const repo = makeRepo({
    ...base,
    'things/journeys/make-a-thing.mdx': page('title: x\ntype: guide'),
    'things/workflows/create.mdx': page('title: x\ntype: workflow\njourney: nope\noperations:\n  - DELETE /v1/things'),
    'things/untyped.mdx': page('title: x'),
    'things/odd.mdx': page('title: x\ntype: banana'),
  });
  const f = msgs(check(repo).fail);
  assert.ok(f.includes('product has operations but no journey page'));
  assert.ok(f.some((m) => m.includes('journey "nope" does not exist')));
  assert.ok(f.some((m) => m.includes('"DELETE /v1/things" is not in the spec')));
  assert.ok(f.some((m) => m.includes('/things/untyped: no type')));
  assert.ok(f.some((m) => m.includes('unknown type "banana"')));
});

test('hand-written schemas and unknown reference operations fail', () => {
  const repo = makeRepo({
    ...base,
    'things/api-reference/things/create-thing.mdx': page('openapi: "POST /v1/things"', '<ParamField body="x" />'),
    'things/api-reference/things/ghost.mdx': page('openapi: "PUT /v1/ghost"'),
  });
  const f = msgs(check(repo).fail);
  assert.ok(f.some((m) => m.includes('hand-written schema')));
  assert.ok(f.some((m) => m.includes('PUT /v1/ghost is not in the spec')));
});

test('--fix writes the used-in block with the file-prefixed form and creates missing pages', () => {
  const repo = makeRepo(base);
  const r = check(repo, { fix: true });
  assert.equal(r.fixed.length, 2);
  const created = fs.readFileSync(path.join(repo, 'things/api-reference/things/get-thing.mdx'), 'utf8');
  assert.equal(created, '---\nopenapi: "/things/api-reference/openapi.yaml GET /v1/things/{id}"\n---\n');
  const written = fs.readFileSync(path.join(repo, 'things/api-reference/things/create-thing.mdx'), 'utf8');
  assert.ok(written.includes('openapi: "/things/api-reference/openapi.yaml POST /v1/things"'));
  assert.ok(written.includes('{/* used-in:start */}\n## Used in\n- [Create a thing](/things/workflows/create)\n{/* used-in:end */}'));
  // second run is idempotent
  const again = check(repo, { fix: true });
  assert.deepEqual(again.fixed, []);
  assert.deepEqual(check(repo).warn.filter((w) => w.rule === 'used-in'), []);
});

test('a quickstart must demonstrate a workflow', () => {
  const qs = (fm, body) => ({ ...base, 'things/quickstart.mdx': page(`title: Quickstart\ntype: quickstart${fm}`, body) });
  const warnsOf = (repo) => msgs(check(repo).warn).filter((m) => m.includes('/things/quickstart'));
  assert.ok(warnsOf(makeRepo(qs('', 'hello')))[0].includes('demonstrates no workflow'));
  assert.ok(warnsOf(makeRepo(qs('\nworkflow: nope', '')))[0].includes('"nope" does not exist'));
  assert.deepEqual(warnsOf(makeRepo(qs('\nworkflow: create', ''))), []);
  assert.deepEqual(warnsOf(makeRepo(qs('', 'curl -X POST https://api.eka.care/v1/things'))), []);
});

test('--fix preserves description blocks and body markup verbatim', () => {
  const fm = 'openapi: "POST /v1/things"\ntitle: Create\ndescription: >\n  Line one of a long folded description that must not be reflowed by the fixer.\n\n  Second paragraph.';
  const body = '<Note>\nKeep me.\n</Note>';
  const repo = makeRepo({ ...base, 'things/api-reference/things/create-thing.mdx': page(fm, body) });
  check(repo, { fix: true });
  const out = fs.readFileSync(path.join(repo, 'things/api-reference/things/create-thing.mdx'), 'utf8');
  assert.ok(out.startsWith('---\nopenapi: "/things/api-reference/openapi.yaml POST /v1/things"\ntitle: Create\ndescription: >\n  Line one of a long folded description that must not be reflowed by the fixer.\n\n  Second paragraph.\n---\n'));
  assert.ok(out.includes('<Note>\nKeep me.\n</Note>\n\n{/* used-in:start */}'));
});

test('bare openapi form matching two specs warns', () => {
  const repo = makeRepo({ ...base, 'other/spec.yaml': SPEC });
  const { results } = run(repo, { json: true });
  assert.ok(msgs(results[0].warn).some((m) => m.includes('matches 2 specs')));
});

test('run blocks only on enforced products and honours the root key', () => {
  const repo = makeRepo({
    ...base,
    'things/product.yaml': 'slug: things\nroot: elsewhere\nopenapi:\n  - openapi.yaml\nenforce: false\n',
    'elsewhere/openapi.yaml': SPEC,
  });
  const { results, blocking } = run(repo, { json: true });
  assert.equal(results[0].counts.operations, 2);
  assert.ok(results[0].fail.length > 0);
  assert.equal(blocking, false);
});

test('page rules: budget, In short, sentence length, em dash, first heading', () => {
  const words = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');
  const long = `${words(40)}.`;
  const shortPage = `Intro line.\n\n${Array.from({ length: 10 }, (_, i) => `${words(10)}.${i % 5 === 4 ? '\n\n' : ' '}`).join('')}`;
  const rules = (c, t = 'workflow') => { const r = pageRules(c, t); return { fail: r.fail.map((x) => x[0]), warn: r.warn.map((x) => x[0]) }; };
  assert.deepEqual(rules(shortPage), { fail: [], warn: [] });
  assert.ok(rules(`## In short\n\n- a\n\n${shortPage}`).warn.includes('in-short'));
  const big = Array.from({ length: 80 }, () => `${words(10)}.`).join('\n\n');
  assert.ok(rules(big).warn.includes('in-short'));
  assert.ok(rules(big).warn.includes('budget'));
  assert.ok(!rules(`## In short\n\n- a\n\n${big}`, 'errors').warn.includes('budget'));
  assert.ok(rules(long).fail.includes('sentence'));
  assert.ok(rules('A dash \u2014 here.').fail.includes('em-dash'));
  assert.ok(rules('## Overview\n\nText.').fail.includes('first-heading'));
  assert.ok(!rules('## In short\n\n- x\n\n## Overview of steps\n\nText.').fail.includes('first-heading'));
  // a bold label does not join the next sentence; list items are separate blocks
  assert.ok(!rules(`**Already in place.** ${words(20)}. ${words(20)}.`).warn.includes('sentence'));
  assert.ok(!rules(Array.from({ length: 8 }, (_, i) => `${i + 1}. Step one is short.`).join('\n')).warn.includes('paragraph'));
  // code, tables, comments and headings are not prose
  assert.deepEqual(rules('```\n' + long + '\n```\n\n| ' + long + ' |\n\n{/* ' + long + ' */}'), { fail: [], warn: [] });
});

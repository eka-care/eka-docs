import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkProduct, findProducts, normalizeOp, run } from './docs-check.mjs';

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
  assert.ok(written.includes('openapi: /things/api-reference/openapi.yaml POST /v1/things'));
  assert.ok(written.includes('{/* used-in:start */}\n## Used in\n- [Create a thing](/things/workflows/create)\n{/* used-in:end */}'));
  // second run is idempotent
  const again = check(repo, { fix: true });
  assert.deepEqual(again.fixed, []);
  assert.deepEqual(check(repo).warn.filter((w) => w.rule === 'used-in'), []);
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

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { operationOf, integrateMd, skillMd, build } from './build-skills.mjs';

const SPEC_A = {
  openapi: '3.0.0',
  servers: [{ url: 'https://api.eka.care', description: 'Production' }],
  components: { securitySchemes: { auth: { type: 'http', scheme: 'bearer' } } },
  paths: {
    '/b/{id}': { get: { tags: ['Things'], summary: 'Get a thing' } },
    '/a': { post: { tags: ['Things'], summary: 'Create a thing',
      parameters: [{ in: 'header', name: 'client-id', required: true }],
      requestBody: { content: { 'application/json': { example: { name: 'x' } } } } } },
    '/x': { get: { tags: ['Other'], summary: 'Shared path' } },
  },
};
const SPEC_B = { openapi: '3.0.0', paths: { '/x': { get: { summary: 'Shared path, later spec' } } } };
const specs = new Map([['api-reference/a.yaml', SPEC_A], ['api-reference/b.yaml', SPEC_B]]);

test('operationOf parses file-prefixed frontmatter', () => {
  const op = operationOf({ openapi: '"/api-reference/b.yaml GET /x"' }, specs);
  assert.deepEqual(op, { spec: 'api-reference/b.yaml', method: 'GET', path: '/x', ambiguous: false });
});

test('operationOf resolves a bare line like Mintlify', () => {
  const op = operationOf({ openapi: 'get /x' }, specs);
  assert.deepEqual(op, { spec: 'api-reference/a.yaml', method: 'GET', path: '/x', ambiguous: true });
});

test('operationOf returns null without openapi', () => {
  assert.equal(operationOf({ title: 'Getting started' }, specs), null);
});

const OPS = [
  { page: 'api-sdk/t/get-b', spec: 'api-reference/a.yaml', method: 'GET', path: '/b/{id}' },
  { page: 'api-sdk/t/create-a', spec: 'api-reference/a.yaml', method: 'POST', path: '/a' },
];
const PRODUCT = { item: 'Thing', slug: 'thing' };

test('integrateMd groups by tag', () => {
  const md = integrateMd(PRODUCT, OPS, specs, []);
  assert.match(md, /### Things\n\n\| Method \| Path \| What it does \|/);
  assert.ok(md.indexOf('`/a`') < md.indexOf('`/b/{id}`'), 'rows sorted by path');
  assert.match(md, /\[`\/a`\]\(https:\/\/developer\.eka\.care\/api-sdk\/t\/create-a\)/);
});

test('integrateMd lists hosts and auth', () => {
  const md = integrateMd(PRODUCT, OPS, specs, []);
  assert.match(md, /## Hosts\n\n- `https:\/\/api\.eka\.care` Production/);
  assert.match(md, /## Auth and headers[\s\S]*`auth`: HTTP bearer/);
  assert.match(md, /`client-id`/);
});

test('skillMd lists only existing jobs', () => {
  const md = skillMd(PRODUCT, { title: 'Thing', description: 'Does things.' }, ['integrate']);
  assert.match(md, /^---\nname: eka-thing\n/);
  assert.match(md, /references\/integrate\.md/);
  for (const job of ['scaffold', 'debug', 'test.md']) assert.ok(!md.includes(job), job);
});

test('build is deterministic', () => {
  const a = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-a-'));
  const b = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-b-'));
  build({ out: a });
  build({ out: b });
  const files = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => fs.statSync(path.join(dir, f)).isFile()).sort();
  assert.deepEqual(files(a), files(b));
  assert.ok(files(a).length > 10);
  for (const f of files(a)) assert.equal(fs.readFileSync(path.join(a, f), 'utf8'), fs.readFileSync(path.join(b, f), 'utf8'), f);
});

test('a product is described by its own overview, not its Build with AI page', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-ipd-'));
  build({ out });
  const skill = fs.readFileSync(path.join(out, 'plugins/eka-ipd/skills/eka-ipd/SKILL.md'), 'utf8');
  assert.ok(!skill.includes('Set up a coding agent'), 'IPD skill describes itself with its Build with AI page');
});

test('skills name and describe the product the way its menu does', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-names-'));
  build({ out });
  const docs = JSON.parse(fs.readFileSync('docs.json', 'utf8'));
  const emrItem = docs.navigation.products.flatMap((f) => f.menu).find((i) => i.item === 'Eka EMR');
  const skill = fs.readFileSync(path.join(out, 'plugins/eka-emr/skills/eka-emr/SKILL.md'), 'utf8');
  const plugin = fs.readFileSync(path.join(out, 'plugins/eka-emr/.claude-plugin/plugin.json'), 'utf8');
  for (const f of [skill, plugin]) assert.ok(!f.includes('Eka Eka'), 'doubled Eka');
  assert.ok(skill.includes(emrItem.description), 'EMR skill does not use its menu description');
});

test('integrateMd lists each host once and only the auth the operations use', () => {
  const one = { openapi: '3.0.0', servers: [{ url: 'https://api.eka.care', description: 'Production' }],
    components: { securitySchemes: { auth: { type: 'http', scheme: 'bearer' }, unused: { type: 'apiKey', in: 'header', name: 'x-unused' } } },
    paths: { '/p': { get: { tags: ['T'], summary: 'P', security: [{ auth: [] }] } } } };
  const two = { openapi: '3.0.0', servers: [{ url: 'https://api.eka.care', description: 'Prod server' }],
    components: { securitySchemes: { auth: { type: 'http', scheme: 'bearer' } } }, security: [{ auth: [] }],
    paths: { '/q': { get: { tags: ['T'], summary: 'Q' } } } };
  const s = new Map([['one.yaml', one], ['two.yaml', two]]);
  const md = integrateMd(PRODUCT, [{ page: 'p', spec: 'one.yaml', method: 'GET', path: '/p' },
    { page: 'q', spec: 'two.yaml', method: 'GET', path: '/q' }], s, []);
  assert.equal(md.match(/`https:\/\/api\.eka\.care`/g).length, 1, 'host listed twice');
  assert.equal(md.match(/- `auth`:/g).length, 1, 'auth listed twice');
  assert.ok(!md.includes('x-unused'), 'lists a scheme no operation uses');
});

test('a skill the generator no longer makes is reported as stale', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-stale-'));
  build({ out });
  const gone = 'plugins/eka-retired/skills/eka-retired/SKILL.md';
  fs.mkdirSync(path.join(out, path.dirname(gone)), { recursive: true });
  fs.writeFileSync(path.join(out, gone), 'old');
  const r = build({ out, check: true });
  assert.deepEqual(r.stale, [gone]);
  assert.ok(!r.stale.some((f) => f.includes('eka-docs-contributor')));
});

#!/usr/bin/env node
// docs-check: verifies every product's docs against the ladder in
// docs/superpowers/specs/2026-10-13-eka-docs-contributor-design.md.
//
//   node scripts/docs-check.mjs [product-slug] [--fix] [--json]
//
// Exit code is 1 only when a product with `enforce: true` has a failure.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';

export const LADDER_TYPES = [
  'overview', 'journey', 'quickstart', 'workflow', 'reference', 'webhooks',
  'errors', 'testing', 'build-with-ai', 'changelog',
];
export const EXTRA_TYPES = ['sdk', 'resource', 'guide'];
const ALL_TYPES = new Set([...LADDER_TYPES, ...EXTRA_TYPES]);
const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'plugins', 'docs']);
const USED_IN_START = '{/* used-in:start */}';
const USED_IN_END = '{/* used-in:end */}';
const ERROR_CODE_RE = /\b[A-Z]{2,}-\d{3,}\b/g;

// ---------- filesystem helpers ----------

function walk(dir, pred, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, pred, out);
    else if (pred(entry.name)) out.push(full);
  }
  return out;
}

const rel = (repo, file) => '/' + path.relative(repo, file).split(path.sep).join('/');
const pageUrl = (repo, file) => rel(repo, file).replace(/\.mdx?$/, '');

// ---------- spec parsing ----------

export function normalizeOp(s) {
  const m = String(s).trim().replace(/^["']|["']$/g, '').match(/^(?:(\S+\.(?:ya?ml|json))\s+)?([a-zA-Z]+)\s+(\S+)$/);
  if (!m) return null;
  return { spec: m[1] ? m[1].replace(/^\//, '') : null, op: `${m[2].toUpperCase()} ${m[3]}` };
}

function loadSpec(file) {
  const doc = YAML.parse(fs.readFileSync(file, 'utf8')) ?? {};
  const ops = new Map();
  for (const [p, item] of Object.entries(doc.paths ?? {})) {
    for (const [m, op] of Object.entries(item ?? {})) {
      if (METHODS.has(m)) ops.set(`${m.toUpperCase()} ${p}`, { operationId: op?.operationId, tags: op?.tags ?? [], summary: op?.summary });
    }
  }
  return { ops, webhooks: new Set(Object.keys(doc.webhooks ?? {})), text: JSON.stringify(doc) };
}

// ---------- product loading ----------

export function findProducts(repo) {
  return walk(repo, (n) => n === 'product.yaml').map((file) => {
    const manifest = YAML.parse(fs.readFileSync(file, 'utf8')) ?? {};
    const root = manifest.root ? path.join(repo, manifest.root) : path.dirname(file);
    return { file, manifest, root, slug: manifest.slug ?? path.basename(root) };
  });
}

function loadPages(repo, root) {
  return walk(root, (n) => n.endsWith('.mdx')).map((file) => {
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const ref = data.openapi ? normalizeOp(data.openapi) : null;
    return { file, url: pageUrl(repo, file), data, content, ref, type: ref ? 'reference' : data.type };
  });
}

// ---------- the check ----------

export function checkProduct(repo, product, { fix = false, allSpecs = [] } = {}) {
  const fail = [], warn = [], fixed = [];
  const F = (rule, msg) => fail.push({ rule, msg });
  const W = (rule, msg) => warn.push({ rule, msg });
  const { manifest, root } = product;

  const specFiles = (manifest.openapi ?? []).map((p) => path.join(root, p));
  const specs = specFiles.filter((f) => fs.existsSync(f)).map((f) => ({ file: f, rel: rel(repo, f).slice(1), ...loadSpec(f) }));
  for (const f of specFiles) if (!fs.existsSync(f)) F('manifest', `openapi file not found: ${rel(repo, f)}`);
  const ops = new Map();
  for (const s of specs) for (const [k, v] of s.ops) ops.set(k, { ...v, spec: s.rel });
  const webhooks = new Set(specs.flatMap((s) => [...s.webhooks]));
  const specText = specs.map((s) => s.text).join('\n');

  const pages = loadPages(repo, root);
  const byType = (t) => pages.filter((p) => p.type === t);
  const journeys = byType('journey'), workflows = byType('workflow'), refs = byType('reference');

  // Ladder presence
  if (ops.size > 0) {
    if (journeys.length === 0) F('ladder', 'product has operations but no journey page');
    if (workflows.length === 0) F('ladder', 'product has operations but no workflow page');
  }
  for (const t of ['overview', 'errors']) if (byType(t).length === 0) F('ladder', `no ${t} page`);
  for (const t of ['testing', 'build-with-ai']) if (byType(t).length === 0) W('ladder', `no ${t} page`);

  // Page types
  for (const p of pages) {
    if (p.type === 'reference') continue;
    if (!p.data.type) F('type', `${p.url}: no type in frontmatter`);
    else if (!ALL_TYPES.has(p.data.type)) F('type', `${p.url}: unknown type "${p.data.type}"`);
  }

  // Workflows
  const usedBy = new Map(); // op -> [workflow page]
  const journeySlugs = new Set(journeys.map((j) => path.basename(j.file, '.mdx')));
  for (const w of workflows) {
    for (const raw of w.data.operations ?? []) {
      const n = normalizeOp(raw);
      if (!n || !ops.has(n.op)) F('workflow', `${w.url}: operation "${raw}" is not in the spec`);
      else usedBy.set(n.op, [...(usedBy.get(n.op) ?? []), w]);
    }
    for (const h of w.data.webhooks ?? []) if (!webhooks.has(h)) W('workflow', `${w.url}: webhook "${h}" is not in the spec`);
    if (w.data.journey && !journeySlugs.has(w.data.journey)) F('workflow', `${w.url}: journey "${w.data.journey}" does not exist`);
  }
  for (const j of journeys) {
    const slug = path.basename(j.file, '.mdx');
    if (!workflows.some((w) => w.data.journey === slug)) W('journey', `${j.url}: no workflow points at this journey`);
  }
  for (const [op] of ops) if (!usedBy.has(op)) W('coverage', `${op} is used by no workflow`);

  // Reference pages
  const seen = new Set();
  for (const p of refs) {
    if (!p.ref) { F('reference', `${p.url}: cannot parse openapi "${p.data.openapi}"`); continue; }
    seen.add(p.ref.op);
    if (!ops.has(p.ref.op)) F('reference', `${p.url}: ${p.ref.op} is not in the spec`);
    if (!p.ref.spec) {
      const owners = allSpecs.filter((s) => s.ops.has(p.ref.op));
      if (owners.length > 1) W('reference', `${p.url}: bare "${p.ref.op}" matches ${owners.length} specs; use the file-prefixed form`);
    }
    if (/<(ParamField|ResponseField)\b/.test(p.content)) F('reference', `${p.url}: hand-written schema (ParamField/ResponseField); move it into the spec`);

    const block = usedInBlock(usedBy.get(p.ref.op) ?? []);
    const current = extractUsedIn(p.content);
    if (current !== block && !(current === null && block === '')) {
      if (fix) { writeUsedIn(p, block, ops.get(p.ref.op)?.spec); fixed.push(`${p.url}: used-in block written`); }
      else W('used-in', `${p.url}: "Used in" block is ${current === null ? 'missing' : 'stale'}; run with --fix`);
    }
  }
  for (const [op, meta] of ops) {
    if (seen.has(op)) continue;
    if (fix) { const url = createRefPage(repo, root, op, meta); fixed.push(`${url}: page created for ${op}`); }
    else W('coverage', `${op} has no reference page; run with --fix`);
  }

  // Quickstart must demonstrate a real workflow
  const workflowSlugs = new Set(workflows.map((w) => path.basename(w.file, '.mdx')));
  const workflowPaths = [...usedBy.keys()].map((op) => op.split(' ')[1]);
  for (const q of byType('quickstart')) {
    if (q.data.workflow) {
      if (!workflowSlugs.has(q.data.workflow)) W('quickstart', `${q.url}: workflow "${q.data.workflow}" does not exist`);
    } else if (!workflowPaths.some((p) => q.content.includes(p))) {
      W('quickstart', `${q.url}: demonstrates no workflow; add workflow: <slug> to its frontmatter or call a workflow's operations`);
    }
  }

  // Error codes
  for (const e of byType('errors')) {
    for (const code of new Set(e.content.match(ERROR_CODE_RE) ?? [])) {
      if (!specText.includes(code)) W('errors', `${code} is on the errors page but in no response example`);
    }
  }

  return { slug: product.slug, enforce: manifest.enforce === true, fail, warn, fixed, counts: { pages: pages.length, operations: ops.size, journeys: journeys.length, workflows: workflows.length } };
}

// ---------- used-in block and fixes ----------

function usedInBlock(workflows) {
  if (workflows.length === 0) return '';
  return ['## Used in', ...workflows.map((w) => `- [${w.data.title ?? w.url}](${w.url})`)].join('\n');
}

function extractUsedIn(content) {
  const a = content.indexOf(USED_IN_START), b = content.indexOf(USED_IN_END);
  if (a === -1 || b === -1) return null;
  return content.slice(a + USED_IN_START.length, b).trim();
}

function writeUsedIn(page, block, specRel) {
  const data = { ...page.data };
  if (page.ref && !page.ref.spec && specRel) data.openapi = `/${specRel} ${page.ref.op}`;
  let body = page.content;
  const a = body.indexOf(USED_IN_START), b = body.indexOf(USED_IN_END);
  const wrapped = block ? `${USED_IN_START}\n${block}\n${USED_IN_END}` : '';
  if (a !== -1 && b !== -1) body = body.slice(0, a) + wrapped + body.slice(b + USED_IN_END.length);
  else if (wrapped) body = body.trimEnd() + '\n\n' + wrapped + '\n';
  fs.writeFileSync(page.file, matter.stringify(body.replace(/\n{3,}/g, '\n\n'), data));
}

function createRefPage(repo, root, op, meta) {
  const [method, p] = op.split(' ');
  const tag = (meta.tags[0] ?? 'endpoints').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const slug = (meta.operationId ?? `${method}-${p}`).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const file = path.join(root, 'api-reference', tag, `${slug}.mdx`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `---\nopenapi: "/${meta.spec} ${op}"\n---\n`);
  return pageUrl(repo, file);
}

// ---------- CLI ----------

export function run(repo, { product, fix, json } = {}) {
  let products = findProducts(repo);
  if (product) products = products.filter((p) => p.slug === product);
  const allSpecs = walk(repo, (n) => /\.(ya?ml)$/.test(n) && n !== 'product.yaml')
    .map((f) => { try { return loadSpec(f); } catch { return null; } })
    .filter((s) => s && s.ops.size > 0);
  const results = products.map((p) => checkProduct(repo, p, { fix, allSpecs }));
  const blocking = results.some((r) => r.enforce && r.fail.length > 0);
  if (json) console.log(JSON.stringify(results, null, 2));
  else for (const r of results) printReport(r);
  return { results, blocking };
}

function printReport(r) {
  const c = r.counts;
  console.log(`\n# ${r.slug}  (${c.pages} pages, ${c.operations} operations, ${c.journeys} journeys, ${c.workflows} workflows, enforce: ${r.enforce})`);
  const group = (items, label) => {
    if (items.length === 0) return;
    console.log(`\n${label} (${items.length})`);
    const byRule = {};
    for (const i of items) (byRule[i.rule] ??= []).push(i.msg);
    for (const [rule, msgs] of Object.entries(byRule)) { console.log(`  [${rule}]`); for (const m of msgs) console.log(`    ${m}`); }
  };
  group(r.fail, r.enforce ? 'FAIL' : 'FAIL (reported only, enforce: false)');
  group(r.warn, 'WARN');
  if (r.fixed.length) { console.log(`\nFIXED (${r.fixed.length})`); for (const f of r.fixed) console.log(`    ${f}`); }
  if (r.fail.length === 0 && r.warn.length === 0) console.log('\n  clean');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const args = process.argv.slice(2);
  const opts = { product: args.find((a) => !a.startsWith('--')), fix: args.includes('--fix'), json: args.includes('--json') };
  const { results, blocking } = run(process.cwd(), opts);
  if (results.length === 0) console.log('no product.yaml found');
  process.exit(blocking ? 1 : 0);
}

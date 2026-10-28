// The facts a developer on developer.eka.care can act on, read from one checkout.
//
// The generated changelog is a function of these facts and nothing else:
//
//     entries = rules(facts(now) - facts(last committed))
//
// So this file decides what counts as a fact. Wording is not one: summaries, descriptions and titles of
// operations are never read, so a rewrite earns no entry. What is read:
//
//   - the contract of every operation in every spec: host, auth, parameters, required and body fields, responses;
//   - the page that documents each operation, and the product that page sits under in docs.json;
//   - the SDKs listed in changelog-data/sdks.yaml, with the latest version their registry publishes;
//   - the product plugins under plugins/ and their skills;
//   - the site's look (theme, colours, fonts, background, logo) and its navigation: how it is laid out, which
//     products the menu carries and which pages (Documentation, APIs & SDKs, Changelog) each one has;
//   - two things a writer declares in a page's frontmatter: `new_procedure: true` and `corrections`.
//
// Output is canonical (keys sorted, sets sorted) so two runs over the same tree are byte identical and the
// committed snapshot diffs by spec. See changelog-rules.mjs for what a difference means.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import YAML from 'yaml';
import { PRODUCTS, findItem, loadSpecs, operationOf, walkPages } from './build-skills.mjs';

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.superpowers', '.claude', 'plugins', 'superpowers', 'changelog-data']);

/** Swagger's own housekeeping paths, which no integrator calls. */
const HOUSEKEEPING = /\/(v[23]\/api-docs|swagger-resources)(\/|$)/;

/** The platform changelog. Every generated entry rolls up into it. */
export const PLATFORM = 'docs/get-started/changelog';

/**
 * Each docs.json product item and the changelog page that carries its entries. An item with no page of its own
 * writes to the platform changelog only, and so does anything that sits under no item (Auth, unlisted pages).
 */
export const CHANGELOGS = {
  'HIE-CM': 'docs/hie-cm/changelog',
  NHCX: 'docs/hie-cm/changelog',
  UHI: 'docs/hie-cm/changelog',
  'Medical Scribe': 'docs/get-started/ekascribe-changelog',
  'Medical Agents': 'docs/get-started/ekaagents-changelog',
  'Eka EMR': 'docs/get-started/emr-changelog',
  IPD: 'docs/get-started/emr-changelog',
  Billing: 'docs/billing/changelog',
  'Health Records': 'docs/health-records/changelog',
  'Medical Document Parsing': null,
  'Medical Knowledge': null,
};

/** The plugin the contributor docs ship for writers, which is not a developer artefact. */
const CONTRIBUTOR_PLUGIN = 'eka-docs-contributor';

/** `{request-id}` and `{requestId}` are the same address to a caller. */
export function normalisePath(p) {
  return p.replace(/\{[^}]*\}/g, '{}');
}

/** The key an operation is known by across snapshots: method and address, or `WEBHOOK name`. */
export function operationKey(method, p) {
  return `${method.toUpperCase()} ${normalisePath(p)}`;
}

const sortedUnique = (values) => [...new Set(values)].sort();

export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, sortKeys(value[k])]));
  }
  return value;
}

function resolve(spec, x) {
  if (!x?.$ref?.startsWith('#/')) return x;
  return x.$ref.slice(2).split('/').reduce((o, k) => o?.[k], spec) ?? null;
}

/** A body schema's top-level fields, following one $ref and the parts of an allOf. */
function bodyFields(spec, schema) {
  const s = resolve(spec, schema);
  if (!s) return { properties: [], required: [] };
  const parts = s.allOf ? s.allOf.map((x) => resolve(spec, x)).filter(Boolean) : [s];
  return {
    properties: sortedUnique(parts.flatMap((x) => Object.keys(x.properties ?? {}))),
    required: sortedUnique(parts.flatMap((x) => x.required ?? [])),
  };
}

/**
 * The contract of one operation: what a caller sends and what comes back, with nothing that is only prose.
 * A path parameter is positional to the caller, so its name is not part of the contract, any more than it is
 * part of the address. Header names keep the case the spec writes; the rules compare them without it.
 */
function contract(spec, pathItem, op, method, p, kind) {
  const body = resolve(spec, op.requestBody);
  const content = body?.content ?? {};
  const media = content['application/json'] ? 'application/json' : Object.keys(content).sort()[0];
  const { properties, required } = bodyFields(spec, content[media]?.schema);
  const params = [...(pathItem.parameters ?? []), ...(op.parameters ?? [])].map((x) => resolve(spec, x)).filter((x) => x?.in);
  const servers = (op.servers ?? pathItem.servers ?? spec.servers ?? []).map((s) => s.url);
  return {
    id: op.operationId ?? null,
    kind,
    method: method.toUpperCase(),
    path: p,
    server: servers[0] ?? null,
    security: sortedUnique((op.security ?? spec.security ?? []).flatMap((s) => Object.keys(s))),
    params: sortedUnique(params.map((x) => `${x.in}:${x.in === 'path' ? '{}' : x.name}${x.required ? '!' : ''}`)),
    required,
    properties,
    responses: Object.keys(op.responses ?? {}).map(String).sort(),
  };
}

function* walkFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) yield* walkFiles(path.join(dir, e.name)); }
    else yield path.join(dir, e.name);
  }
}

/** Every page in the checkout, as `{page, data}` with `page` the route without its leading slash. */
function readPages(root) {
  const pages = [];
  for (const file of walkFiles(root)) {
    if (!file.endsWith('.mdx')) continue;
    const page = path.relative(root, file).split(path.sep).join('/').replace(/\.mdx$/, '');
    let data;
    try { data = matter(fs.readFileSync(file, 'utf8')).data; } catch { continue; }
    pages.push({ page, data });
  }
  return pages.sort((a, b) => a.page.localeCompare(b.page));
}

/** The docs.json product item each page sits under, for the items that have a changelog home. */
export function productOfPages(docs) {
  const owner = new Map();
  for (const item of Object.keys(CHANGELOGS)) {
    for (const tab of findItem(docs, item)?.tabs ?? []) {
      for (const page of walkPages(tab.pages)) if (!owner.has(page)) owner.set(page, item);
    }
  }
  return owner;
}

/** The operation a page documents, webhooks included, the way Mintlify resolves the `openapi:` line. */
function pageOperation(data, specs) {
  const raw = data?.openapi ? String(data.openapi).trim().replace(/^["']|["']$/g, '') : '';
  const hook = raw.match(/^(?:(\S+\.(?:ya?ml|json))\s+)?webhook\s+(\S+)$/i);
  if (hook) {
    const files = hook[1] ? [hook[1].replace(/^\//, '')] : [...specs.keys()].sort();
    const spec = files.find((f) => specs.get(f)?.webhooks?.[hook[2]]);
    return spec ? { spec, key: operationKey('WEBHOOK', hook[2]) } : null;
  }
  const op = operationOf(data, specs);
  return op ? { spec: op.spec, key: operationKey(op.method, op.path) } : null;
}

/** One module per spec file: every operation's contract, page and product. */
function moduleFacts(root, docs) {
  const specs = loadSpecs(root);
  const owner = productOfPages(docs);
  // Which pages document which operation, listed pages first so a page in the nav wins over an unlisted one.
  const citing = new Map();
  for (const { page, data } of readPages(root)) {
    const op = pageOperation(data, specs);
    if (!op) continue;
    const k = `${op.spec} ${op.key}`;
    if (!citing.has(k)) citing.set(k, []);
    citing.get(k).push(page);
  }
  const modules = {};
  for (const [file, spec] of specs) {
    const operations = {};
    const add = (key, c) => {
      const pages = (citing.get(`${file} ${key}`) ?? []).sort((a, b) => Number(owner.has(b)) - Number(owner.has(a)) || a.localeCompare(b));
      operations[key] = { ...c, page: pages[0] ?? null, product: pages.map((p) => owner.get(p)).find(Boolean) ?? null };
    };
    for (const [p, item] of Object.entries(spec.paths ?? {})) {
      if (!p.startsWith('/') || HOUSEKEEPING.test(p)) continue;
      for (const m of METHODS) if (item?.[m]) add(operationKey(m, p), contract(spec, item, item[m], m, p, 'call'));
    }
    for (const [name, item] of Object.entries(spec.webhooks ?? {})) {
      const m = METHODS.find((x) => item?.[x]);
      if (m) add(operationKey('WEBHOOK', name), { ...contract(spec, item, item[m], m, name, 'webhook'), method: 'WEBHOOK' });
    }
    // An operation no page cites still belongs somewhere: the product most of its spec's operations sit under.
    const counts = {};
    for (const o of Object.values(operations)) if (o.product) counts[o.product] = (counts[o.product] ?? 0) + 1;
    const usual = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))[0] ?? null;
    for (const o of Object.values(operations)) if (!o.product) o.product = usual;
    if (Object.keys(operations).length) modules[file] = { file, operations };
  }
  return modules;
}

/**
 * The SDKs a person listed, whether their page still exists, and the version passed in for each. A checkout with
 * no list says nothing about SDKs, which is null rather than none, so a diff against it reads no SDK as new.
 */
function sdkFacts(root, versions) {
  const file = path.join(root, 'changelog-data', 'sdks.yaml');
  if (!fs.existsSync(file)) return null;
  const out = {};
  for (const s of YAML.parse(fs.readFileSync(file, 'utf8')) ?? []) {
    out[s.name] = {
      registry: s.registry,
      repo: s.repo ?? null,
      product: s.product ?? null,
      page: s.page,
      documented: fs.existsSync(path.join(root, `${s.page}.mdx`)),
      version: versions[s.name] ?? null,
    };
  }
  return out;
}

/** The product plugins a developer installs, their version and their skills, and the page that says how. */
function pluginFacts(root, docs) {
  const dir = path.join(root, 'plugins');
  if (!fs.existsSync(dir)) return {};
  const out = {};
  for (const name of fs.readdirSync(dir).sort()) {
    if (name === CONTRIBUTOR_PLUGIN) continue;
    const manifest = path.join(dir, name, '.claude-plugin', 'plugin.json');
    if (!fs.existsSync(manifest)) continue;
    const json = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    const skillsDir = path.join(dir, name, 'skills');
    const skills = fs.existsSync(skillsDir)
      ? fs.readdirSync(skillsDir).filter((s) => fs.existsSync(path.join(skillsDir, s, 'SKILL.md'))).sort()
      : [];
    const product = PRODUCTS.find((p) => `eka-${p.slug}` === name)?.item ?? null;
    const pages = product ? (findItem(docs, product)?.tabs ?? []).flatMap((t) => walkPages(t.pages)) : [];
    out[json.name ?? name] = {
      version: String(json.version ?? ''),
      product,
      page: pages.find((p) => p.endsWith('/build-with-ai')) ?? null,
      skills,
    };
  }
  return out;
}

/** What the site looks like, as docs.json sets it. A stylesheet tweak is not a changeover, so CSS is not read. */
function lookFacts(docs) {
  return { theme: docs.theme ?? null, colors: docs.colors ?? null, fonts: docs.fonts ?? null, background: docs.background ?? null, logo: docs.logo ?? null };
}

/**
 * How the site is laid out: the navigation's top level, and for a product menu each product's family and its
 * tabs, with the first page of each to link. Pages moving inside a tab are not navigation news.
 */
function navigationFacts(docs) {
  const nav = docs.navigation ?? {};
  const products = {};
  for (const fam of nav.products ?? []) {
    for (const it of fam.menu ?? []) {
      products[it.item] = { family: fam.product ?? null, tabs: Object.fromEntries((it.tabs ?? []).map((t) => [t.tab, walkPages(t.pages)[0] ?? null])) };
    }
  }
  return { layout: Object.keys(nav).filter((k) => k !== 'global').sort().join(',') || null, products, redirects: Boolean(docs.redirects?.length) };
}

/**
 * What a writer declares. A page that documents a procedure for the first time says `new_procedure: true`; a
 * page whose prose stated a wrong fact lists it under `corrections`, each with `was` and `now`. Both reach the
 * changelog by the same diff as a spec change, so no free prose enters the generator.
 */
function declared(root, docs) {
  const owner = productOfPages(docs);
  const procedures = {};
  const corrections = {};
  for (const { page, data } of readPages(root)) {
    if (data.new_procedure === true) {
      procedures[page] = { title: String(data.title ?? page), description: String(data.description ?? ''), product: owner.get(page) ?? null };
    }
    if (Array.isArray(data.corrections) && data.corrections.length) {
      const list = data.corrections
        .filter((c) => c && c.was && c.now)
        .map((c) => ({ date: String(c.date ?? ''), was: String(c.was), now: String(c.now), product: owner.get(page) ?? null }))
        .sort((a, b) => (a.date + a.was).localeCompare(b.date + b.was));
      if (list.length) corrections[page] = list;
    }
  }
  return { procedures, corrections };
}

/**
 * Every fact in one checkout. `versions` maps an SDK name to the version its registry publishes, fetched by the
 * caller, since reading a registry needs the network and this function does not. `docs` replaces the checkout's
 * own docs.json, for an older checkout whose navigation predates the product layout: its operations are then
 * filed under the products they sit under today. The look and the navigation are always the checkout's own.
 */
export function extractFacts(root, { versions = {}, docs } = {}) {
  const own = JSON.parse(fs.readFileSync(path.join(root, 'docs.json'), 'utf8'));
  docs ??= own;
  return sortKeys({
    modules: moduleFacts(root, docs),
    site: {
      sdks: sdkFacts(root, versions),
      plugins: pluginFacts(root, docs),
      ...declared(root, docs),
      look: lookFacts(own),
      navigation: navigationFacts(own),
    },
  });
}

/** The snapshot file for a module: its spec path with the slashes flattened. */
export const factsFileFor = (key) => `${key.replace(/\//g, '__')}.json`;
export const SITE_FACTS = '_site.json';

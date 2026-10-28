// What a difference between two facts snapshots means to a developer.
//
// Eka writes its own specs, so a changed contract means the API changed. Every rule here produces one of these
// kinds of entry, or nothing:
//
//   added, withdrawn, path-changed, changed, shared-change   an API call or webhook
//   sdk-added, sdk-release, sdk-removed                      an SDK in changelog-data/sdks.yaml
//   plugin-added, plugin-version, plugin-removed,
//   skill-added, skill-removed                               a product plugin under plugins/
//   procedure, correction                                    what a writer declared in a page
//
// An entry is `breaking` when code written against the earlier version can fail: a call withdrawn or at a new
// address, a newly required parameter, header or body field, a different auth scheme or host, or an SDK release
// that semver says may break (a new major, or a new minor while the major is 0). The rules are fixed and the prose
// is templated (changelog-render.mjs), so the same two snapshots always give the same entries.
//
// The normalisations that keep noise out live in the extractor: placeholders stripped from paths, path
// parameters positional, no prose read. What is left here needs both snapshots: what was withdrawn, what changed
// address, what changed in place, and how to fold one change made across several specs into one entry.
import { createHash } from 'node:crypto';
import { CHANGELOGS } from './changelog-facts.mjs';

/** Contract fields compared for a change, in the order an entry lists them. */
export const CONTRACT_FIELDS = ['server', 'security', 'params', 'required', 'properties', 'responses'];

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const lower = (xs) => xs.map((x) => x.toLowerCase()).sort();
const diffSets = (from, to) => ({ added: to.filter((x) => !from.includes(x)), removed: from.filter((x) => !to.includes(x)) });

function entryId(kind, product, module, items) {
  return createHash('sha1').update(JSON.stringify([kind, product, module, items])).digest('hex').slice(0, 12);
}

/** Where an entry is read: its product's changelog, or the platform's alone. */
const pageFor = (product) => (product ? CHANGELOGS[product] ?? null : null);
const route = (page) => (page ? `/${page}` : null);

/** Whether one contract change can fail a caller who built against the earlier contract. */
export function isBreaking(change) {
  const { field, from, to } = change;
  if (field === 'server' || field === 'security') return true;
  if (field === 'params') return diffSets(lower(from), lower(to)).added.some((p) => p.endsWith('!'));
  if (field === 'required') return diffSets(from, to).added.length > 0;
  return false;
}

export function contractChanges(before, after) {
  const changes = [];
  for (const field of CONTRACT_FIELDS) {
    // Headers compare without case, as HTTP reads them; the entry keeps the case the spec wrote.
    const equal = field === 'params' ? same(lower(before[field]), lower(after[field])) : same(before[field], after[field]);
    if (!equal) changes.push({ field, from: before[field], to: after[field] });
  }
  // A field that became required and appeared in the body at the same time is one change, said once:
  // "requires `type`" already says the body carries it.
  const required = changes.find((c) => c.field === 'required');
  const properties = changes.find((c) => c.field === 'properties');
  if (required && properties) {
    const r = diffSets(required.from, required.to);
    const p = diffSets(properties.from, properties.to);
    if (p.added.every((x) => r.added.includes(x)) && p.removed.every((x) => r.removed.includes(x))) {
      changes.splice(changes.indexOf(properties), 1);
    }
  }
  return changes;
}

const itemOf = (op) => ({ method: op.method, path: op.path, kind: op.kind, page: op.page });

/** `3.0.58` as [3, 0, 58]; null when the version does not read as semver. */
function semver(v) {
  const m = /^v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(String(v ?? '').replace(/^[a-z-]+\//i, '').replace(/^py-/, ''));
  return m ? [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)] : null;
}

/** A release worth an entry: a new minor or major. Patches are not news. */
export function releaseOf(from, to) {
  const a = semver(from);
  const b = semver(to);
  if (!a || !b || (a[0] === b[0] && a[1] === b[1])) return null;
  if (b[0] < a[0] || (b[0] === a[0] && b[1] < a[1])) return null;
  return { breaking: b[0] > a[0] || (b[0] === 0 && b[1] > a[1]) };
}

/**
 * The entries two snapshots produce, dated `date`. An empty `prev` is the very first run, which returns nothing:
 * a baseline is a cursor, not news.
 */
export function entriesFor(prev, next, date) {
  if (!prev || !Object.keys(prev.modules ?? {}).length) return [];
  const entries = [];
  const add = (kind, product, module, items, extra = {}) => {
    const page = pageFor(product);
    entries.push({
      id: entryId(kind, product, module, items),
      date,
      kind,
      product,
      label: product ?? 'Eka Developer Platform',
      page,
      module,
      breaking: false,
      count: items.length,
      items,
      ...extra,
    });
  };
  const pm = prev.modules ?? {};
  const nm = next.modules ?? {};

  // Operations that left a spec and operations that arrived in one, kept until every spec has been read: the same
  // call can move between specs, which the caller never sees.
  const gone = [];
  const arrived = [];
  const changed = new Map(); // `${product} ${module}` -> {product, module, breaking: [], other: []}
  const noteChange = (module, before, after) => {
    const diff = contractChanges(before, after);
    if (!diff.length) return;
    const k = `${after.product} ${module}`;
    if (!changed.has(k)) changed.set(k, { product: after.product, module, breaking: [], other: [] });
    const group = changed.get(k);
    const hard = diff.filter(isBreaking);
    const soft = diff.filter((c) => !isBreaking(c));
    if (hard.length) group.breaking.push({ ...itemOf(after), changes: hard });
    if (soft.length) group.other.push({ ...itemOf(after), changes: soft });
  };

  for (const module of new Set([...Object.keys(pm), ...Object.keys(nm)])) {
    const p = pm[module]?.operations ?? {};
    const n = nm[module]?.operations ?? {};
    for (const key of new Set([...Object.keys(p), ...Object.keys(n)])) {
      if (!p[key]) arrived.push({ module, key, op: n[key] });
      else if (!n[key]) gone.push({ module, key, op: p[key] });
      else noteChange(module, p[key], n[key]);
    }
  }

  // The same call in another spec: compared as one operation, never reported as withdrawn and added.
  for (const g of [...gone]) {
    const a = arrived.find((x) => x.key === g.key);
    if (!a) continue;
    noteChange(a.module, g.op, a.op);
    gone.splice(gone.indexOf(g), 1);
    arrived.splice(arrived.indexOf(a), 1);
  }

  // The same operation at a new address: callers who copied the old one have to change it.
  const renamed = new Map();
  for (const g of [...gone]) {
    if (!g.op.id) continue;
    const a = arrived.find((x) => x.module === g.module && x.op.id === g.op.id && x.op.method === g.op.method);
    if (!a) continue;
    const k = `${a.op.product} ${a.module}`;
    if (!renamed.has(k)) renamed.set(k, { product: a.op.product, module: a.module, items: [] });
    renamed.get(k).items.push({ method: a.op.method, from: g.op.path, to: a.op.path, kind: a.op.kind, page: a.op.page });
    noteChange(a.module, { ...g.op, path: a.op.path }, a.op);
    gone.splice(gone.indexOf(g), 1);
    arrived.splice(arrived.indexOf(a), 1);
  }
  for (const r of renamed.values()) add('path-changed', r.product, r.module, r.items, { breaking: true });

  const byProduct = (list) => {
    const groups = new Map();
    for (const x of list) {
      const k = `${x.op.product} ${x.module}`;
      if (!groups.has(k)) groups.set(k, { product: x.op.product, module: x.module, items: [] });
      groups.get(k).items.push(itemOf(x.op));
    }
    return [...groups.values()];
  };
  for (const g of byProduct(arrived)) add('added', g.product, g.module, g.items);
  for (const g of byProduct(gone)) {
    // A withdrawn call's page may be gone with it; the reader opens another page of the same spec instead.
    const still = Object.values(nm[g.module]?.operations ?? {}).find((o) => o.product === g.product && o.page);
    add('withdrawn', g.product, g.module, g.items.map((i) => ({ ...i, page: null })), { breaking: true, link: route(still?.page) });
  }
  for (const c of changed.values()) {
    if (c.breaking.length) add('changed', c.product, c.module, c.breaking, { breaking: true });
    if (c.other.length) add('changed', c.product, c.module, c.other);
  }

  foldSharedChanges(entries);
  siteEntries(prev.site ?? {}, next.site ?? {}, add);
  return entries;
}

function siteEntries(ps, ns, add) {
  const prevSdks = ps.sdks ?? {};
  for (const [name, s] of Object.entries(ns.sdks ?? {})) {
    const was = prevSdks[name];
    const item = { name, registry: s.registry, repo: s.repo, page: s.page };
    if ((!was || !was.documented) && s.documented) add('sdk-added', s.product, name, [{ ...item, version: s.version }]);
    else if (was?.documented && !s.documented) add('sdk-removed', s.product, name, [item]);
    else if (s.documented) {
      const release = releaseOf(was.version, s.version);
      if (release) add('sdk-release', s.product, name, [{ ...item, from: was.version, to: s.version }], { breaking: release.breaking });
    }
  }
  for (const [name, s] of Object.entries(prevSdks)) {
    if (!ns.sdks?.[name] && s.documented) add('sdk-removed', s.product, name, [{ name, registry: s.registry, repo: s.repo, page: null }]);
  }

  const prevPlugins = ps.plugins ?? {};
  for (const [name, pl] of Object.entries(ns.plugins ?? {})) {
    const was = prevPlugins[name];
    const item = { name, page: pl.page };
    if (!was) { add('plugin-added', pl.product, name, [{ ...item, version: pl.version }]); continue; }
    if (was.version !== pl.version) add('plugin-version', pl.product, name, [{ ...item, from: was.version, to: pl.version }]);
    const skills = diffSets(was.skills, pl.skills);
    if (skills.added.length) add('skill-added', pl.product, name, skills.added.map((skill) => ({ ...item, skill })));
    if (skills.removed.length) add('skill-removed', pl.product, name, skills.removed.map((skill) => ({ ...item, skill })));
  }
  for (const [name, pl] of Object.entries(prevPlugins)) {
    if (!ns.plugins?.[name]) add('plugin-removed', pl.product, name, [{ name, page: null }]);
  }

  for (const [page, d] of Object.entries(ns.procedures ?? {})) {
    if (!ps.procedures?.[page]) add('procedure', d.product, page, [{ page, title: d.title, description: d.description }]);
  }
  for (const [page, list] of Object.entries(ns.corrections ?? {})) {
    const before = ps.corrections?.[page] ?? [];
    const fresh = list.filter((c) => !before.some((b) => b.was === c.was && b.now === c.now));
    if (fresh.length) add('correction', fresh[0].product, page, fresh.map(({ was, now }) => ({ page, was, now })));
  }
}

/**
 * The same change made across several specs of one product is one piece of news, not one per spec. A change's
 * signature is what was added and removed, not the whole list, so two calls with different headers still share
 * it. A signature seen in two or more specs of a product becomes one entry, and leaves the per-spec entries.
 */
function signature(change) {
  const { field, from, to } = change;
  if (!Array.isArray(from) || !Array.isArray(to)) return JSON.stringify([field, from, to]);
  return JSON.stringify([field, to.filter((x) => !from.includes(x)), from.filter((x) => !to.includes(x))]);
}

function foldSharedChanges(entries) {
  const changes = entries.filter((e) => e.kind === 'changed');
  const groups = new Map();
  for (const e of changes) {
    for (const item of e.items) {
      for (const change of item.changes) {
        const key = `${e.product} ${signature(change)}`;
        if (!groups.has(key)) groups.set(key, { product: e.product, change, modules: new Set(), items: [] });
        const g = groups.get(key);
        g.modules.add(e.module);
        g.items.push({ method: item.method, path: item.path, kind: item.kind, page: item.page });
      }
    }
  }
  for (const g of groups.values()) {
    if (g.modules.size < 2) continue;
    const sig = signature(g.change);
    for (const e of changes.filter((x) => x.product === g.product)) {
      e.items = e.items
        .map((item) => ({ ...item, changes: item.changes.filter((c) => signature(c) !== sig) }))
        .filter((item) => item.changes.length);
      e.count = e.items.length;
    }
    entries.push({
      id: entryId('shared-change', g.product, sig, g.items),
      date: entries[0].date,
      kind: 'shared-change',
      product: g.product,
      label: g.product ?? 'Eka Developer Platform',
      page: pageFor(g.product),
      module: [...g.modules].sort().join(', '),
      breaking: isBreaking(g.change),
      count: g.items.length,
      items: g.items,
      change: g.change,
    });
  }
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    if (entries[i].kind === 'changed' && !entries[i].items.length) entries.splice(i, 1);
  }
}

/** True when nothing a developer can act on differs between the snapshots. */
export function unchanged(prev, next) {
  return same(prev, next);
}

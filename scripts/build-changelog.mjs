// The generated changelog, as a function of the specs, SDKs and plugins rather than a habit.
//
//   node scripts/build-changelog.mjs              read the facts, diff them against the committed snapshot,
//                                                 write the entries the rules produce, move the snapshot,
//                                                 render the changelog pages
//   node scripts/build-changelog.mjs --check      fail if the snapshot or the pages are stale; what CI runs
//   node scripts/build-changelog.mjs --offline    as the first form, without asking the SDK registries
//   node scripts/build-changelog.mjs --date=YYYY-MM-DD   date the entries
//
// Three things live under changelog-data/. `facts/` is the last committed snapshot, one file per spec plus
// `_site.json`, the cursor this run diffs against. `entries/` is the durable record, one JSON file per date, which
// a person may still edit (an entry a revert made moot can go). `sdks.yaml` lists the SDKs worth tracking, since
// an install command alone cannot say whose package a name is.
//
// Entries render into each product's existing changelog page and roll up into the platform changelog, as dated
// <Update> blocks between generated markers. Hand-written blocks are never touched; see changelog-render.mjs.
//
// SDK versions come from the registries, which needs the network. --check never asks them: it compares the
// snapshot's own versions, so CI stays offline and a release elsewhere never fails an unrelated pull request.
// A run that cannot reach a registry keeps the version it had.
//
// The first run, with no snapshot, writes one and no entries: a baseline is a cursor, not news.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { extractFacts, factsFileFor, SITE_FACTS } from './changelog-facts.mjs';
import { entriesFor, unchanged } from './changelog-rules.mjs';
import { headingFor, pagesFor, renderPage } from './changelog-render.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'changelog-data');
const FACTS = path.join(DATA, 'facts');
const ENTRIES = path.join(DATA, 'entries');

const args = process.argv.slice(2);
const check = args.includes('--check');
const offline = args.includes('--offline');
const dateArg = args.find((a) => a.startsWith('--date='))?.slice(7);

/** Today in Asia/Kolkata. */
function today() {
  if (dateArg) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) throw new Error(`--date wants YYYY-MM-DD, got ${dateArg}`);
    return dateArg;
  }
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;
const rel = (file) => path.relative(ROOT, file);

function readFacts() {
  const facts = { modules: {}, site: {} };
  if (!fs.existsSync(FACTS)) return facts;
  for (const name of fs.readdirSync(FACTS).sort()) {
    if (!name.endsWith('.json')) continue;
    const json = JSON.parse(fs.readFileSync(path.join(FACTS, name), 'utf8'));
    if (name === SITE_FACTS) facts.site = json;
    else facts.modules[json.file] = json;
  }
  return facts;
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

/** The snapshot, one file per spec; the file of a spec that is gone is removed with it. */
function writeFacts(facts) {
  fs.mkdirSync(FACTS, { recursive: true });
  const keep = new Set([SITE_FACTS]);
  for (const [key, module] of Object.entries(facts.modules)) {
    keep.add(factsFileFor(key));
    writeIfChanged(path.join(FACTS, factsFileFor(key)), stable(module));
  }
  writeIfChanged(path.join(FACTS, SITE_FACTS), stable(facts.site));
  for (const name of fs.readdirSync(FACTS)) if (!keep.has(name)) fs.rmSync(path.join(FACTS, name));
}

function readEntries() {
  const byDate = new Map();
  if (!fs.existsSync(ENTRIES)) return byDate;
  for (const name of fs.readdirSync(ENTRIES).sort()) {
    const m = /^(\d{4}-\d{2}-\d{2})\.json$/.exec(name);
    if (m) byDate.set(m[1], JSON.parse(fs.readFileSync(path.join(ENTRIES, name), 'utf8')));
  }
  return byDate;
}

/** Every changelog page as it should be, from the entries and the hand-written text. */
function renderAll(byDate) {
  const files = new Map();
  for (const page of pagesFor([...byDate.values()].flat())) {
    const file = path.join(ROOT, `${page}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`${page}.mdx is a changelog page in changelog-facts.mjs but does not exist`);
    files.set(file, renderPage(fs.readFileSync(file, 'utf8'), page, byDate));
  }
  return files;
}

/** The latest version each SDK's registry publishes, or null when it cannot be read. */
async function latest(sdk) {
  const get = async (url, headers = {}) => {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.json();
  };
  if (sdk.registry === 'npm') return (await get(`https://registry.npmjs.org/${sdk.name.replace('/', '%2f')}`))['dist-tags']?.latest ?? null;
  if (sdk.registry === 'pypi') return (await get(`https://pypi.org/pypi/${sdk.name}/json`)).info?.version ?? null;
  if (sdk.registry === 'github') {
    const token = process.env.GITHUB_TOKEN;
    return (await get(`https://api.github.com/repos/${sdk.repo}/releases/latest`, token ? { authorization: `Bearer ${token}` } : {})).tag_name ?? null;
  }
  throw new Error(`unknown registry ${sdk.registry}`);
}

async function versions(prev, ask) {
  const file = path.join(DATA, 'sdks.yaml');
  const listed = fs.existsSync(file) ? YAML.parse(fs.readFileSync(file, 'utf8')) ?? [] : [];
  const out = {};
  await Promise.all(listed.map(async (sdk) => {
    const had = prev.site?.sdks?.[sdk.name]?.version ?? null;
    if (!ask) { out[sdk.name] = had; return; }
    try {
      out[sdk.name] = (await latest(sdk)) ?? had;
    } catch (err) {
      console.warn(`changelog: could not read ${sdk.name} (${err.message}); keeping ${had ?? 'no version'}.`);
      out[sdk.name] = had;
    }
  }));
  return out;
}

async function main() {
  const byDate = readEntries();
  const prev = readFacts();
  const next = extractFacts(ROOT, { versions: await versions(prev, !check && !offline) });
  const baseline = !Object.keys(prev.modules).length;

  if (check) {
    const problems = [];
    if (baseline) problems.push('no snapshot under changelog-data/facts/');
    else if (!unchanged(prev, next)) {
      const moved = Object.keys({ ...prev.modules, ...next.modules }).filter(
        (k) => JSON.stringify(prev.modules[k]) !== JSON.stringify(next.modules[k]),
      );
      if (JSON.stringify(prev.site) !== JSON.stringify(next.site)) moved.push('the SDKs, plugins or declarations');
      problems.push(`the facts changed for ${moved.join(', ')}`);
    }
    for (const [file, content] of renderAll(byDate)) {
      if (fs.readFileSync(file, 'utf8') !== content) problems.push(`${rel(file)} is stale`);
    }
    if (problems.length) {
      console.error(`changelog: ${problems.join('; ')}.`);
      console.error('  Run npm run changelog and commit what it writes.');
      process.exit(1);
    }
    console.log('changelog: snapshot and pages are current.');
    return;
  }

  const date = today();
  const entries = baseline ? [] : entriesFor(prev, next, date);
  if (entries.length) {
    const existing = byDate.get(date) ?? [];
    const ids = new Set(existing.map((e) => e.id));
    const fresh = entries.filter((e) => !ids.has(e.id));
    const file = path.join(ENTRIES, `${date}.json`);
    writeIfChanged(file, stable([...existing, ...fresh]));
    byDate.set(date, [...existing, ...fresh]);
    for (const e of fresh) console.log(`  + ${(e.breaking ? 'breaking ' : '') + e.kind}: ${headingFor(e)}`);
    console.log(`changelog: ${fresh.length} entr${fresh.length === 1 ? 'y' : 'ies'} for ${date} written to ${rel(file)}.`);
  } else if (baseline) {
    console.log('changelog: no snapshot yet; writing the baseline. A baseline is a cursor, not news.');
  } else if (unchanged(prev, next)) {
    console.log('changelog: nothing changed.');
  } else {
    console.log('changelog: the facts moved but nothing a developer acts on changed; the snapshot follows.');
  }
  writeFacts(next);
  let written = 0;
  for (const [file, content] of renderAll(byDate)) if (writeIfChanged(file, content)) written += 1;
  if (written) console.log(`changelog: ${written} page(s) rendered.`);
}

await main();

// Entries into prose, from fixed templates, and prose into the changelog pages.
//
// One template per kind. The heading states the change as a fact and names the product; the body says what to
// check and links the page to open, one short sentence at a time. Nothing here reads a spec or a diff: the entry
// carries everything, so a change to a template rewrites every past entry the same way on the next render.
//
// Generated entries live in their own dated <Update> blocks, between two MDX comments. Everything outside those
// comments is hand-written, by people, the Mintlify agent or the radar drafts, and is never read or rewritten:
// rendering strips the generated blocks and puts them back in date order among the hand-written ones.
import { PLATFORM } from './changelog-facts.mjs';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SITE = 'https://developer.eka.care';

/** Numbers up to twelve are spelled. */
export const words = (n) => (n <= 12 ? WORDS[n] : String(n));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** `2026-10-28` as `October 28, 2026`, the form the hand-written blocks use. */
export function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** `October 28, 2026` as `2026-10-28`, or null for a label that is not a date. */
export function isoDate(label) {
  const m = /^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/.exec(String(label).trim());
  const month = m ? MONTHS.indexOf(m[1]) : -1;
  return month < 0 ? null : `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

const isHook = (i) => i.kind === 'webhook';
function noun(items) {
  if (items.length && items.every(isHook)) return items.length === 1 ? 'webhook' : 'webhooks';
  return items.length === 1 ? 'call' : 'calls';
}
const some = (items) => `${words(items.length)} ${noun(items)}`;

/** A call as code, linked to its reference page when it has one. */
function code(i) {
  const text = i.kind === 'webhook' ? `\`${i.path}\`` : `\`${i.method} ${i.path}\``;
  return i.page ? `[${text}](/${i.page})` : text;
}

/** Up to `max` items, then "and N more". */
function listed(items, max = 4, show = code) {
  const shown = items.slice(0, max).map(show);
  const rest = items.length - shown.length;
  if (rest > 0) return `${shown.join(', ')} and ${words(rest)} more`;
  return shown.length > 1 ? `${shown.slice(0, -1).join(', ')} and ${shown.at(-1)}` : shown[0];
}

const quoted = (names) => listed(names, 4, (n) => `\`${n}\``);
/** `header:X-Partner-Id!` as `X-Partner-Id`. */
const paramName = (p) => p.slice(p.indexOf(':') + 1).replace(/!$/, '');
const paramWhere = (p) => ({ header: 'header', query: 'query parameter', path: 'path parameter', cookie: 'cookie' })[p.slice(0, p.indexOf(':'))] ?? 'parameter';

/** What one contract change says, as a clause after the call, or after several when `many`. */
export function clause(change, many = false) {
  const v = (one, more) => (many ? more : one);
  const { field, from, to } = change;
  if (field === 'server') return `${v('goes', 'go')} to \`${to}\`, not \`${from}\``;
  if (field === 'security') return to.length ? `${v('is', 'are')} authorised with ${quoted(to)}` : `${v('needs', 'need')} no authorisation`;
  const has = (list, x) => (list ?? []).some((y) => y.toLowerCase() === x.toLowerCase());
  const added = to.filter((x) => !has(from, x));
  const removed = from.filter((x) => !has(to, x));
  const parts = [];
  if (field === 'params') {
    // A parameter that became required, or optional, shows as one removed and one added; say it once.
    const base = (p) => p.replace(/!$/, '').toLowerCase();
    const counterpart = (p, list) => list.some((q) => base(q) === base(p));
    const req = added.filter((p) => p.endsWith('!'));
    const nowOptional = added.filter((p) => !p.endsWith('!') && counterpart(p, removed));
    const opt = added.filter((p) => !p.endsWith('!') && !counterpart(p, removed));
    const gone = removed.filter((p) => !counterpart(p, added));
    if (req.length) parts.push(`${v('requires', 'require')} the ${req.length === 1 ? paramWhere(req[0]) : 'parameters'} ${quoted(req.map(paramName))}`);
    if (nowOptional.length) parts.push(`no longer ${v('requires', 'require')} ${quoted(nowOptional.map(paramName))}`);
    if (opt.length) parts.push(`${v('takes', 'take')} ${quoted(opt.map(paramName))}`);
    if (gone.length) parts.push(`no longer ${v('takes', 'take')} ${quoted(gone.map(paramName))}`);
  }
  if (field === 'required') {
    if (added.length) parts.push(`${v('requires', 'require')} ${quoted(added)} in the body`);
    if (removed.length) parts.push(`no longer ${v('requires', 'require')} ${quoted(removed)}`);
  }
  if (field === 'properties') {
    if (added.length) parts.push(`${v('accepts', 'accept')} ${quoted(added)} in the body`);
    if (removed.length) parts.push(`no longer ${v('accepts', 'accept')} ${quoted(removed)}`);
  }
  if (field === 'responses') {
    if (added.length) parts.push(`can return ${quoted(added)}`);
    if (removed.length) parts.push(`no longer ${v('returns', 'return')} ${quoted(removed)}`);
  }
  return parts.join(' and ') || `${v('has', 'have')} a different ${FIELD_NAMES[field] ?? field}`;
}

const FIELD_NAMES = {
  server: 'host', security: 'authorisation', params: 'parameters', required: 'required fields',
  properties: 'body fields', responses: 'response codes',
};

const registryName = { npm: 'npm', pypi: 'PyPI', github: 'GitHub' };

/** Where a release is published, so the reader can read its notes. */
export function releaseUrl(item, version) {
  const v = String(version ?? '');
  if (item.registry === 'npm') return `https://www.npmjs.com/package/${item.name}/v/${v}`;
  if (item.registry === 'pypi') return `https://pypi.org/project/${item.name}/${v}/`;
  if (item.registry === 'github') return `https://github.com/${item.repo}/releases/tag/${v}`;
  return null;
}

/** The heading of an entry: the change stated as a fact, naming the product. */
export function headingFor(e) {
  const items = e.items;
  const l = e.label;
  switch (e.kind) {
    case 'added':
      return `${l}: ${some(items)} added`;
    case 'withdrawn':
      return `${l}: ${some(items)} withdrawn`;
    case 'path-changed':
      return `${l}: ${some(items)} changed address`;
    case 'changed': {
      const fields = [...new Set(items.flatMap((i) => i.changes.map((c) => c.field)))];
      if (fields.length === 1) return `${l}: ${FIELD_NAMES[fields[0]]} changed on ${some(items)}`;
      return `${l}: ${some(items)} changed`;
    }
    case 'shared-change':
      return `${l}: ${some(items)} ${clause(e.change, true)}`;
    case 'sdk-added':
      return `${l}: the \`${items[0].name}\` SDK is documented`;
    case 'sdk-release':
      return `${l}: \`${items[0].name}\` ${String(items[0].to).replace(/^v/, '')} is released`;
    case 'sdk-removed':
      return `${l}: the \`${items[0].name}\` SDK is no longer documented`;
    case 'plugin-added':
      return `${l}: the \`${items[0].name}\` plugin is published`;
    case 'plugin-version':
      return `${l}: the \`${items[0].name}\` plugin is ${items[0].to}`;
    case 'plugin-removed':
      return `${l}: the \`${items[0].name}\` plugin is withdrawn`;
    case 'skill-added':
      return `${l}: ${items.length === 1 ? `the \`${items[0].skill}\` skill is` : `${words(items.length)} skills are`} added to \`${items[0].name}\``;
    case 'skill-removed':
      return `${l}: ${items.length === 1 ? `the \`${items[0].skill}\` skill is` : `${words(items.length)} skills are`} removed from \`${items[0].name}\``;
    case 'procedure':
      return `${l}: ${items[0].title}`;
    case 'correction':
      return `${l}: a correction to ${correctedPage(items[0].page)}`;
    case 'look-changed':
      return `${l}: the docs have a new look`;
    case 'nav-layout':
      return `${l}: each product has its own pages`;
    case 'nav-product-added':
      return `${l}: the product has its own pages`;
    case 'nav-product-removed':
      return `${l}: the product is no longer in the menu`;
    case 'nav-tab-added':
      return `${l}: ${items.length === 1 ? `a ${items[0].tab} page is` : `${listed(items.map((i) => i.tab), 4, (t) => t)} pages are`} added`;
    case 'nav-tab-removed':
      return `${l}: ${items.length === 1 ? `the ${items[0].tab} page is` : `the ${listed(items.map((i) => i.tab), 4, (t) => t)} pages are`} removed`;
    default:
      return `${l}: ${e.kind}`;
  }
}

const LOOK_PARTS = { theme: 'theme', colors: 'colours', fonts: 'fonts', background: 'background', logo: 'logo' };
/** A product's pages as links: "[Documentation](/docs/x) and [APIs & SDKs](/api-sdk/x)". */
const TAB_ORDER = ['Documentation', 'APIs & SDKs', 'Changelog'];
const tabRank = (tab) => (TAB_ORDER.includes(tab) ? TAB_ORDER.indexOf(tab) : TAB_ORDER.length);
const tabLinks = (tabs) => listed(
  Object.entries(tabs).filter(([, page]) => page).sort(([a], [b]) => tabRank(a) - tabRank(b) || a.localeCompare(b)),
  4,
  ([tab, page]) => `[${tab}](/${page})`,
);

/** What a correction corrected: an API page is the reference, any other page goes by its name. */
const isReference = (page) => page.startsWith('api-sdk/');
const correctedPage = (page) => (isReference(page) ? 'the API reference' : page.split('/').at(-1).replace(/-/g, ' '));

const update = (items) => ` If you built against the earlier contract, update ${items.length === 1 ? 'this call' : 'these calls'}.`;
const openPage = (link, what = 'the page') => (link ? ` [Open ${what}](${link}).` : '');
const firstPage = (items) => items.find((i) => i.page)?.page;

/** The body of an entry: what to check, and where. Each sentence stays short enough for docs-check. */
export function render(e) {
  const items = e.items;
  switch (e.kind) {
    case 'added':
      return `${cap(listed(items))}.`;
    case 'withdrawn':
      return `${cap(listed(items))}. If you call ${items.length === 1 ? 'it' : 'them'}, stop: the reference no longer carries ${items.length === 1 ? 'it' : 'them'}.${openPage(e.link, 'the reference')}`;
    case 'path-changed':
      return `${items.slice(0, 3).map((i) => `\`${i.method} ${i.from}\` is now ${code({ ...i, path: i.to })}.`).join(' ')}${items.length > 3 ? ` And ${words(items.length - 3)} more.` : ''} If your code sends the old address, change it.`;
    case 'changed': {
      const shown = items.slice(0, 3).map((i) => `${cap(code(i))} ${i.changes.map(clause).join(', and ')}.`);
      const rest = items.length - shown.length;
      return `${shown.join(' ')}${rest > 0 ? ` And ${words(rest)} more.` : ''}${e.breaking ? update(items) : ''}`;
    }
    case 'shared-change':
      return `These ${noun(items)} ${clause(e.change, true)}: ${listed(items, 3)}.${e.breaking ? update(items) : ''}`;
    case 'sdk-added': {
      const i = items[0];
      const where = registryName[i.registry] ?? i.registry;
      return `It is published on ${where}${i.version ? ` at ${String(i.version).replace(/^v/, '')}` : ''}. [Read the SDK page](/${i.page}).`;
    }
    case 'sdk-release': {
      const i = items[0];
      const url = releaseUrl(i, i.to);
      const notes = url ? ` [Read the release](${url}).` : '';
      return `It moves from ${String(i.from).replace(/^v/, '')}.${e.breaking ? ' Semver allows this release to break your code, so read its notes before you upgrade.' : ''}${notes} [Read the SDK page](/${i.page}).`;
    }
    case 'sdk-removed':
      return 'Its page is gone from these docs. Check with Eka before you build on it.';
    case 'plugin-added':
      return `Install it in Claude Code to give your agent this product's reference skill.${openPage(items[0].page && `/${items[0].page}`, 'Build with AI')}`;
    case 'plugin-version':
      return `Update it from ${items[0].from} to pick up the current reference.${openPage(items[0].page && `/${items[0].page}`, 'Build with AI')}`;
    case 'plugin-removed':
      return 'It is no longer published. Remove it from your agent.';
    case 'skill-added':
      return `Update the plugin to get ${items.length === 1 ? 'it' : quoted(items.map((i) => i.skill))}.${openPage(items[0].page && `/${items[0].page}`, 'Build with AI')}`;
    case 'skill-removed':
      return `Update the plugin; ${items.length === 1 ? 'it is' : 'they are'} no longer in it.`;
    case 'procedure': {
      const d = items[0].description.trim();
      return `${d ? `${cap(d.replace(/\.?$/, '.'))} ` : ''}[Read the procedure](/${items[0].page}).`;
    }
    case 'correction':
      return `${items.map((c) => `The ${isReference(c.page) ? 'reference' : 'page'} said ${c.was.replace(/\.?$/, '')}. ${cap(c.now.replace(/\.?$/, ''))}.`).join(' ')} [Read the page](/${items[0].page}).`;
    case 'look-changed':
      return `Every page has new ${listed(items[0].parts.map((p) => LOOK_PARTS[p] ?? p), 5, (p) => p)}. No API changes with it.`;
    case 'nav-layout': {
      const families = [...new Set(items.map((i) => i.family).filter(Boolean))].sort();
      // The product with the most pages shows the new shape best.
      const example = [...items].sort((x, y) => Object.keys(y.tabs).length - Object.keys(x.tabs).length || x.item.localeCompare(y.item))[0];
      return [
        `The product menu has ${words(items.length)} items${families.length ? `, grouped under ${listed(families, 6, (f) => f)}` : ''}.`,
        'Each product has its own Documentation, and its own APIs & SDKs when it has an API.',
        e.redirects ? 'Old addresses redirect to the new pages.' : '',
        example ? `For example, ${example.item} has ${tabLinks(example.tabs)}.` : '',
      ].filter(Boolean).join(' ');
    }
    case 'nav-product-added':
      return `${items[0].family ? `It is listed under ${items[0].family}. ` : ''}Open its ${tabLinks(items[0].tabs)}.`;
    case 'nav-product-removed':
      return 'Its pages are no longer listed in the product menu.';
    case 'nav-tab-added':
      return `Open ${listed(items, 4, (i) => (i.page ? `[${i.tab}](/${i.page})` : i.tab))}.`;
    case 'nav-tab-removed':
      return `The product's menu no longer has ${items.length === 1 ? 'it' : 'them'}.`;
    default:
      return openPage(firstPage(items) && `/${firstPage(items)}`).trim();
  }
}

/** The section an entry is listed under in its block. */
export function sectionOf(e) {
  if (e.breaking) return 'Breaking';
  if (['added', 'sdk-added', 'plugin-added', 'skill-added', 'procedure', 'nav-product-added', 'nav-tab-added'].includes(e.kind)) return 'Added';
  if (['sdk-removed', 'plugin-removed', 'skill-removed', 'nav-product-removed', 'nav-tab-removed'].includes(e.kind)) return 'Removed';
  if (e.kind === 'correction') return 'Corrected';
  return 'Changed';
}
const SECTIONS = ['Breaking', 'Added', 'Changed', 'Removed', 'Corrected'];
const SECTION_HEADINGS = { Breaking: '## <Icon icon="triangle-exclamation" /> Breaking' };

/** The filter tag each kind carries. */
function tagOf(e) {
  if (e.kind.startsWith('sdk-')) return 'SDK';
  if (e.kind.startsWith('plugin-') || e.kind.startsWith('skill-')) return 'AI tools';
  if (['procedure', 'correction', 'look-changed'].includes(e.kind) || e.kind.startsWith('nav-')) return 'Docs';
  return 'API';
}
const TAGS = ['Breaking', 'API', 'SDK', 'AI tools', 'Docs'];

const ORDER = ['path-changed', 'withdrawn', 'changed', 'shared-change', 'added', 'sdk-release', 'sdk-added', 'plugin-version', 'plugin-added', 'skill-added', 'sdk-removed', 'plugin-removed', 'skill-removed', 'procedure', 'correction', 'nav-layout', 'look-changed', 'nav-product-added', 'nav-tab-added', 'nav-product-removed', 'nav-tab-removed'];
export function sortEntries(entries) {
  return [...entries].sort(
    (a, b) => SECTIONS.indexOf(sectionOf(a)) - SECTIONS.indexOf(sectionOf(b))
      || ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind)
      || a.label.localeCompare(b.label)
      || a.module.localeCompare(b.module)
      || a.id.localeCompare(b.id),
  );
}

export const START = (date) => `{/* generated changelog ${date}: written by npm run changelog from changelog-data/entries/${date}.json. Edit that file, not this block. */}`;
export const END = '{/* end generated changelog */}';
const BLOCK = /^\{\/\* generated changelog (\d{4}-\d{2}-\d{2})[^\n]*\*\/\}\n[\s\S]*?^\{\/\* end generated changelog \*\/\}\n\n?/gm;

/** One dated block for one page, from that date's entries. */
export function renderBlock(date, entries, page) {
  const sorted = sortEntries(entries);
  const tags = TAGS.filter((t) => (t === 'Breaking' ? sorted.some((e) => e.breaking) : sorted.some((e) => tagOf(e) === t)));
  const body = [];
  for (const section of SECTIONS) {
    const list = sorted.filter((e) => sectionOf(e) === section);
    if (!list.length) continue;
    body.push(SECTION_HEADINGS[section] ?? `## ${section}`, '', ...list.map((e) => `- **${headingFor(e)}.** ${render(e)}`), '');
  }
  const long = longDate(date);
  const title = `${page === PLATFORM ? 'Eka Developer Platform' : sorted[0].label}, generated changes for ${long}`;
  // Each line ends in a full stop, so docs-check reads the props as short sentences, not one long one.
  const rss = `${sorted.map((e) => `• ${headingFor(e)}.`).join('\n\n')}\n\nRead more: ${SITE}/${page}`;
  const what = tags.filter((t) => t !== 'Breaking');
  const description = `${what.length > 1 ? `${what.slice(0, -1).join(', ')} and ${what.at(-1)}` : what[0]} changes`;
  return [
    START(date),
    '<Update',
    `  label="${long}"`,
    `  description="${description}"`,
    `  tags={${JSON.stringify(tags)}}`,
    `  rss={{ title: ${JSON.stringify(title)}, description: ${JSON.stringify(rss)} }}`,
    '>',
    '',
    ...body,
    '</Update>',
    END,
    '',
  ].join('\n');
}

/** The page with every generated block taken out: exactly what people wrote. */
export function stripGenerated(text) {
  return text.replace(BLOCK, '');
}

/** Where each hand-written block starts, with its date when its label is one. */
function handBlocks(text) {
  const out = [];
  const re = /^<Update\b[^>]*?label="([^"]*)"/gms;
  for (let m = re.exec(text); m; m = re.exec(text)) out.push({ index: m.index, date: isoDate(m[1]) });
  return out;
}

/**
 * The page as it should be: the hand-written text untouched, and one generated block per date with entries for
 * this page, placed above the first hand-written block that is older. A same-day hand-written block stays above.
 */
export function renderPage(text, page, byDate) {
  let hand = stripGenerated(text);
  const blocks = handBlocks(hand);
  const inserts = [];
  for (const [date, all] of byDate) {
    const entries = page === PLATFORM ? all : all.filter((e) => e.page === page);
    if (!entries.length) continue;
    const older = blocks.find((b) => b.date && b.date < date);
    // Older than every hand-written block: it goes last, after the one newline a block needs above it. This is
    // the only case that can add a byte outside the markers, and only to a page that did not end in a newline.
    if (!older && !hand.endsWith('\n')) hand += '\n';
    inserts.push({ index: older ? older.index : hand.length, date, block: `${renderBlock(date, entries, page)}\n` });
  }
  // Later text first, so earlier indexes stay valid; at one index, newest date on top.
  inserts.sort((a, b) => b.index - a.index || a.date.localeCompare(b.date));
  for (const ins of inserts) hand = hand.slice(0, ins.index) + ins.block + hand.slice(ins.index);
  return hand;
}

/** Every changelog page an entry can land on. */
export function pagesFor(entries) {
  return [...new Set([PLATFORM, ...entries.map((e) => e.page).filter(Boolean)])].sort();
}

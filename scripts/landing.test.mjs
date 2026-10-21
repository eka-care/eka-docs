import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../landing/source.html', import.meta.url), 'utf8');
const grab = (re, what) => {
  const m = html.match(re);
  assert.ok(m, `missing ${what}`);
  return m[0];
};
const J = grab(/const J=\{.*?\};\n/, 'J');
const GROUPS = grab(/const GROUPS=.*;\n/, 'GROUPS');
const run = (src, expr) => vm.runInNewContext(`${src}\n${expr}`);

test('every GROUPS entry resolves in J', () => {
  const { groups, j } = run(J + GROUPS, '({groups: GROUPS, j: J})');
  const missing = [];
  for (const [group, entries] of Object.entries(groups)) {
    assert.ok(entries.length, `${group} has no entries`);
    for (const [fam, item] of entries) if (!j[fam]?.[item]) missing.push(`${group}: ${fam} / ${item}`);
  }
  assert.deepEqual(missing, []);
});

test('nav labels', () => {
  const labels = [...html.matchAll(/<button class="nvb"[^>]*>([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(labels, ['Solutions', 'Integrations', 'Resources']);
});

test('resources menu', () => {
  const res = grab(/<div class="mega mega-res"[\s\S]*?<\/div><\/div>\n/, 'mega-res');
  const names = [...res.matchAll(/<b>([^<]+)<\/b>/g)].map((m) => m[1]);
  for (const gone of ['Docs', 'API reference', 'SDKs']) assert.ok(!names.includes(gone), gone);
  for (const kept of ['Cookbook', 'Auth', 'Encryption', 'Research', 'Changelog']) assert.ok(names.includes(kept), kept);
});

test('product grid holds seven solutions', () => {
  const grid = grab(/<section class="sec" id="products">[\s\S]*?<\/section>/, 'products');
  const solutions = grid.replace(/<div class="prod[^"]*" id="p-cook">[\s\S]*?<\/div>\n    <\/div>/, '');
  const tiles = [...solutions.matchAll(/<a class="pl"[\s\S]*?<b>([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(tiles, ['Medical Scribe', 'Medical Agents', 'Medical Document Parsing', 'Medical Knowledge', 'HIE-CM', 'NHCX', 'UHI']);
});


test('every product switcher icon has a mask rule in styles.css', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const docs = JSON.parse(fs.readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  const icons = new Set(docs.navigation.products.flatMap((f) => f.menu.map((i) => i.icon))
    .filter((i) => i?.startsWith('/images/icons/products/')).map((i) => i.split('/').pop()));
  const missing = [...icons].filter((i) => !css.includes(`:has(img[src$="/${i}"])::after`)).sort();
  assert.deepEqual(missing, []);
});


test('the Solutions and Integrations menus are the docs product switcher', () => {
  const docs = JSON.parse(fs.readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  const walk = (n) => (typeof n === 'string' ? [n] : Array.isArray(n) ? n.flatMap(walk)
    : [...(n.root ? [n.root] : []), ...walk(n.pages ?? n.tabs ?? [])]);
  const want = docs.navigation.products.filter((f) => ['Clinical AI', 'ABDM Connect', 'Integrations'].includes(f.product))
    .map((f) => [f.product, f.menu.map((i) => [i.item, '/' + walk(i.tabs[0].pages)[0], i.icon.split('/').pop().replace('.svg', ''), i.description])]);
  const menus = JSON.parse(grab(/const NAV_MENUS=(.*);\n/, 'NAV_MENUS').replace(/^const NAV_MENUS=/, '').replace(/;\n$/, ''));
  assert.deepEqual(menus, want);
  assert.match(html, /const SOL_MENU=NAV_MENUS\.filter/);
  assert.match(html, /const INT_MENU=NAV_MENUS\.filter/);
});

test('the scene picker offers the four scenes, each opening its Cookbook recipe', () => {
  const order = run(grab(/const SCENE_ORDER=\[.*?\];\n/, 'SCENE_ORDER'), 'SCENE_ORDER');
  assert.deepEqual([...order], ['abdm', 'mr', 'ci', 'px']);
  const scenes = grab(/const SCENES=\{[\s\S]*?\n\};\n/, 'SCENES');
  const names = [...scenes.matchAll(/^  [a-z]+:\{name:"([^"]+)"/gm)].map((m) => m[1]);
  assert.deepEqual(names, ['ABDM-enabled HIS', 'Medical records from any source', 'Clinically intelligent HIS', 'Patient experiences']);
  const docs = JSON.parse(fs.readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  const cookbook = JSON.stringify(docs.navigation.products.flatMap((f) => f.menu).find((i) => i.item === 'Cookbook'));
  for (const m of scenes.matchAll(/next:\["[^"]+","\/([^"]+)"\]/g)) assert.ok(cookbook.includes(`"${m[1]}"`), m[1]);
  assert.ok(!/whole platform/i.test(scenes));
});

test('every scene lays out exactly the parts it has', () => {
  const src = grab(/const SCENES=\{[\s\S]*?\n\};\n/, 'SCENES');
  const scenes = run('const WAVE="",CHECK="";' + src, 'SCENES');
  for (const [k, sc] of Object.entries(scenes)) {
    const cells = new Set(sc.areas.match(/[a-z]+/g));
    const body = sc.parts.filter((m) => !m.head).map((m) => m.id);
    assert.deepEqual([...cells].sort(), [...new Set(body)].sort(), k);
    assert.ok(sc.parts.every((m) => m.url.startsWith('/')), k);
  }
});

test('docs.json footer fits Mintlify (at most 4 link columns)', () => {
  const docs = JSON.parse(fs.readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  assert.ok(docs.footer.links.length <= 4, `${docs.footer.links.length} columns`);
});

test('the scene strip stays centred however long the scene description is', () => {
  // The description row spans the grid and can widen it; equal flexible side columns keep the strip in the middle.
  assert.match(html, /\.scenes\{[^}]*grid-template-columns:minmax\(36px,1fr\) auto minmax\(36px,1fr\)/);
  assert.match(html, /\.snav\.prev\{justify-self:end\}/);
  assert.match(html, /\.snav\.next\{justify-self:start\}/);
});

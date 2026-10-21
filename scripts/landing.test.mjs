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
  for (const kept of ['Cookbook', 'Auth', 'Encryption', 'Research', 'Models on Hugging Face', 'Datasets on Hugging Face', 'Changelog']) assert.ok(names.includes(kept), kept);
});

test('the product grid is gone and the journey is step 03', () => {
  assert.ok(!html.includes('id="products"'));
  assert.match(html, /<section class="sec" id="journey">\s*<div class="sec-head">\s*<div class="node" data-anchor data-step="03 · Build">/);
});

test('every product in the journey has a sketch on its sheet', () => {
  const j = run(J, 'J');
  const art = run(grab(/const ART=\{[\s\S]*?\};\n/, 'ART'), 'ART');
  const sketches = new Set([...grab(/const SK=\{[\s\S]*?\n\};/, 'SK').matchAll(/^ {1,2}(\w+)\(rc,a\)/gm)].map((m) => m[1]));
  const missing = [];
  for (const fam of Object.keys(j)) for (const p of Object.keys(j[fam])) if (!sketches.has(art[p])) missing.push(`${p} -> ${art[p]}`);
  assert.deepEqual(missing, []);
});

test('the menu data exists before the journey reads it', () => {
  assert.ok(html.indexOf('const NAV_MENUS=') < html.indexOf('/* ================= Developer journey'));
});

test('clipping a part updates the pad', () => {
  assert.match(grab(/function unlock\(ids\)\{[\s\S]*?\n\}\n/, 'unlock'), /journeyLit\(\)/);
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
    .map((f) => [f.product, f.menu.map((i) => [i.item, i.href ? i.href.replace('https://developer.eka.care', '') : '/' + walk(i.tabs[0].pages)[0], i.icon.split('/').pop().replace('.svg', ''), i.description])]);
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

test('every Build Now link opens in a new tab', () => {
  const links = [...html.matchAll(/<a [^>]*>(?:(?!<\/a>)[\s\S])*Build Now(?:(?!<\/a>)[\s\S])*<\/a>/g)].map((m) => m[0]);
  assert.ok(links.length >= 2, `${links.length} Build Now links`);
  for (const a of links) assert.match(a, /target="_blank" rel="noopener"/, a.slice(0, 90));
});

test('the closing section has only Build Now, and the steps run 01 to 04', () => {
  assert.ok(!html.includes('closeCta'));
  assert.ok(!html.includes('Open the recipe'));
  // 02 · Assemble is a label inside the Choose section, so the section markers read 01, 03, 04.
  assert.deepEqual([...html.matchAll(/data-step="(\d\d) · /g)].map((m) => m[1]), ['01', '03', '04']);
});

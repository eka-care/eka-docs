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
const GROUPS = grab(/const GROUPS=\{[\s\S]*?\};\n/, 'GROUPS');
const INT_MENU = grab(/const INT_MENU=\[[\s\S]*?\]\]\]\];\n/, 'INT_MENU');
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
  const menu = run(INT_MENU, 'INT_MENU');
  assert.ok(!menu.some(([group]) => group === 'Platform'));
});

test('product grid holds seven solutions', () => {
  const grid = grab(/<section class="sec" id="products">[\s\S]*?<\/section>/, 'products');
  const solutions = grid.replace(/<div class="prod[^"]*" id="p-cook">[\s\S]*?<\/div>\n    <\/div>/, '');
  const tiles = [...solutions.matchAll(/<a class="pl"[\s\S]*?<b>([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(tiles, ['Scribe', 'Agents', 'Document Parsing', 'Medical Knowledge', 'ABDM Connect', 'NHCX', 'UHI']);
});

test('solutions menu groups are Clinical Intelligence and ABDM', () => {
  const src = grab(/const SOL_MENU=\[[\s\S]*?\]\]\]\];\n/, 'SOL_MENU');
  assert.deepEqual([...run(src, 'SOL_MENU').map(([group]) => group)], ['Clinical Intelligence', 'ABDM']);
});

test('every product switcher icon has a mask rule in styles.css', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const docs = JSON.parse(fs.readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  const icons = new Set(docs.navigation.products.flatMap((f) => f.menu.map((i) => i.icon))
    .filter((i) => i?.startsWith('/images/icons/products/')).map((i) => i.split('/').pop()));
  const missing = [...icons].filter((i) => !css.includes(`:has(img[src$="/${i}"])::after`)).sort();
  assert.deepEqual(missing, []);
});

test('the solutions menu does not list Patient Experiences', () => {
  const src = grab(/const SOL_MENU=\[[\s\S]*?\]\]\]\];\n/, 'SOL_MENU');
  const names = run(src, 'SOL_MENU').flatMap(([, , items]) => items.map(([n]) => n));
  assert.ok(!names.includes('Patient Experiences'));
  assert.equal(names.length, 7);
});

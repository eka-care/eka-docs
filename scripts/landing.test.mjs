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
  assert.deepEqual(labels, ['Solutions', 'Integrations', 'Resources', 'Developer tools']);
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

test('the hero has the four developer tools, and nothing more', () => {
  const row = grab(/<div class="tools-row"[\s\S]*?<\/div>/, 'tools-row');
  assert.match(row, /role="navigation" aria-label="Developer tools"/);
  const links = [...row.matchAll(/href="([^"]+)"[^>]*>(?:<i[^>]*><\/i>)?([^<]+)</g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(links, [
    ['/developer-tools#api-reference', 'API reference'], ['/developer-tools#sdks', 'SDKs'],
    ['/developer-tools#mcp-servers', 'MCP server'], ['/developer-tools#webhooks', 'Webhooks']]);
  assert.ok(!/view more/i.test(row));
  assert.ok(!html.includes('/mcp/introduction'));
});

test('the tools row is not a nav element', () => {
  assert.ok(!/<nav class="tools-row"/.test(html));
});

test('the Developer tools menu links the same four sections', () => {
  const menu = grab(/<div class="mega mega-tools"[\s\S]*?<\/div><\/div>\n/, 'mega-tools');
  const hrefs = [...menu.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ['/developer-tools#api-reference', '/developer-tools#sdks', '/developer-tools#mcp-servers', '/developer-tools#webhooks']);
});

const SCENES_SRC = 'const CHECK="",WAVE="";\n' + grab(/const SCENES=\{[\s\S]*?\n\};\n/, 'SCENES');
const PROMPT_SRC = grab(/function promptFor\([\s\S]*?\n\}\n/, 'promptFor');
const prompt = (key, ids) => run(SCENES_SRC + PROMPT_SRC, `promptFor(${JSON.stringify(key)}, ${JSON.stringify(ids)})`);

test('no illustrative code is left on the landing page', () => {
  assert.ok(!/code:`/.test(SCENES_SRC));
  assert.ok(!/Illustrative calls only/.test(html));
  assert.ok(!html.includes('@eka-care/sdk'));
});

test('the prompt names the scene, each clipped part with its page, and llms.txt', () => {
  const p = prompt('abdm', ['abha', 'link']);
  assert.match(p, /ABDM-enabled HIS/);
  assert.match(p, /ABHA login[\s\S]*?Build from: https:\/\/developer\.eka\.care\/docs\/hie-cm\/workflows\/login-abha/);
  assert.match(p, /Link the visit[\s\S]*?Build from: https:\/\/developer\.eka\.care\/docs\/hie-cm\/workflows\/link-care-context-hip/);
  assert.ok(p.indexOf('ABHA login') < p.indexOf('Link the visit'));
  assert.match(p, /https:\/\/developer\.eka\.care\/llms\.txt/);
  assert.ok(!/Build with AI/.test(p));
  assert.match(p, /https:\/\/developer\.eka\.care\/docs\/webhooks\/webhook-signature/);
  assert.ok(!/every callback/i.test(p));
  assert.match(p, /sandbox/i);
  assert.ok(!/(client_secret|api[_-]?key)\s*[:=]\s*(?!\{\{)\S/i.test(p), 'a credential value is in the prompt');
});

test('a scene with nothing clipped still gives a prompt', () => {
  const p = prompt('abdm', []);
  assert.match(p, /ABDM-enabled HIS/);
  assert.match(p, /llms\.txt/);
  assert.ok(!/^\d+\. /m.test(p));
});

test('every scene part has a docs link the prompt can use', () => {
  const scenes = run(SCENES_SRC, 'SCENES');
  for (const [k, sc] of Object.entries(scenes)) for (const part of sc.parts) assert.match(part.url, /^\/(docs|api-sdk)\//, `${k}/${part.id}`);
});

test('each part sends the agent to the page it can build from', () => {
  const want = {
    abdm: { abha: '/docs/hie-cm/workflows/login-abha', scan: '/docs/hie-cm/workflows/hip-scan-and-share',
      link: '/docs/hie-cm/workflows/link-care-context-hip', consent: '/docs/hie-cm/workflows/hiu-request-consent',
      records: '/docs/hie-cm/workflows/hiu-receive-data', claim: '/docs/nhcx/getting-started' },
    mr: { voice: '/docs/scribe/quickstart', note: '/api-sdk/scribe/sessions/get-session', record: '/api-sdk/health-records/obtain-authorization' },
    ci: { scribe: '/docs/scribe/quickstart', mcp: '/docs/agents/agent-kit/mcp-integration' },
  };  // px is held (no prompt) until its round-2 findings are fixed
  for (const [k, parts] of Object.entries(want)) {
    const p = prompt(k, Object.keys(parts));
    for (const path of Object.values(parts)) assert.ok(p.includes(`https://developer.eka.care${path}\n`), `${k}: ${path}`);
  }
});

test('every page a prompt sends the agent to is on disk', () => {
  const scenes = run(SCENES_SRC, 'SCENES');
  for (const [k, sc] of Object.entries(scenes)) for (const part of sc.parts) {
    const path = part.build || part.url;
    assert.ok(fs.existsSync(new URL(`..${path.split('#')[0]}.mdx`, import.meta.url)), `${k}/${part.id}: ${path}`);
  }
});

test('a scene whose prompt failed testing offers its recipe instead', () => {
  assert.equal(prompt('px', ['appt', 'pay']), null);
  assert.match(html, /promptFor\(sceneKey,built\)===null/);
});

test('MedAssist sends the agent to the API it can call', () => {
  assert.ok(prompt('ci', ['assist']).includes('https://developer.eka.care/api-sdk/agents/overview\n'));
});

const SECTIONS = ['## Before you write code', '## Credentials', '## Auth', '## Tools to integrate', '## Webhooks', '## How to work', '## Output'];

test('the brief runs in a fixed order of sections and ends by starting the work', () => {
  const p = prompt('abdm', ['abha']);
  assert.ok(p.startsWith('Integrate "ABDM-enabled HIS" from Eka into this codebase.'));
  let at = -1;
  for (const h of SECTIONS) { const i = p.indexOf(`\n${h}\n`); assert.ok(i > at, h); at = i; }
  assert.ok(p.trimEnd().endsWith('Begin integration now.'));
});

test('credentials are placeholders the agent asks for, never keys', () => {
  const p = prompt('mr', ['voice']);
  assert.match(p, /EKA_CLIENT_ID=\{\{EKA_CLIENT_ID\}\}/);
  assert.match(p, /EKA_CLIENT_SECRET=\{\{EKA_CLIENT_SECRET\}\}/);
  assert.match(p, /POST https:\/\/api\.eka\.care\/connect-auth\/v1\/account\/login/);
  assert.match(p, /stop and ask me/i);
});

test('every part says what it does, and each clipped part is a numbered section', () => {
  const scenes = run(SCENES_SRC, 'SCENES');
  for (const [k, sc] of Object.entries(scenes)) for (const part of sc.parts) assert.ok(part.job && part.job.endsWith('.'), `${k}/${part.id}`);
  const p = prompt('abdm', ['link', 'abha']);
  assert.match(p, /\n1\. Link the visit \(HIE-CM\)\n   Link each visit/);
  assert.match(p, /\n2\. ABHA login \(HIE-CM\)\n/);
});

test('scene and part notes carry what the testers found missing', () => {
  const abdm = prompt('abdm', ['abha']);
  assert.match(abdm, /Health Information Provider \(HIP\)/);
  assert.match(abdm, /https:\/\/developer\.eka\.care\/docs\/hie-cm\/workflows\/serve-data-on-fetch/);
  assert.match(prompt('mr', ['record']), /X-Pt-Id/);
  assert.ok(!/X-Pt-Id/.test(prompt('mr', ['voice'])));
  assert.match(prompt('ci', ['assist']), /agent ID/);
});

test('one agent-agnostic Copy prompt on the frame: no deep links, no panel under the stage', () => {
  for (const link of ['cursor.com/link', 'cursor://', 'claude.ai/new', 'chatgpt.com/?']) assert.ok(!html.includes(link), link);
  const foot = grab(/<div class="frame-foot">[\s\S]*?<\/div>\n\s*<\/div>/, 'frame-foot');
  assert.match(foot, /id="vApp"[^>]*>App</);
  assert.match(foot, /id="vBrief"[^>]*>Brief</);
  assert.match(foot, /id="copy"[^>]*>[\s\S]*Copy prompt/);
  assert.match(html, /<div class="brief" id="brief"/);
  assert.ok(!html.includes('<div class="code reveal" id="code"'));
});

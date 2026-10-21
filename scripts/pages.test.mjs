import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('ABDM Connect Build with AI says the tools cover M1 only for now', () => {
  const page = read('docs/hie-cm/build-with-ai.mdx');
  assert.match(page, /<Warning>[\s\S]*M1[\s\S]*only for now[\s\S]*<\/Warning>/);
  assert.ok(!/M1 to M4/.test(page.split('<Warning>')[0]), 'the page promises M1 to M4 before the warning');
});

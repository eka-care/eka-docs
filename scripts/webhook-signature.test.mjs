import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Every copy prompt sends developers to this page, so its Python must run as written.
const page = fs.readFileSync(new URL('../docs/webhooks/webhook-signature.mdx', import.meta.url), 'utf8');
const blocks = [...page.matchAll(/```python\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');

const run = (driver) => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sig-')), 'check.py');
  fs.writeFileSync(file, `${blocks}\n${driver}\n`);
  return execFileSync('python3', ['-I', file], { encoding: 'utf8' }).trim();
};

test('the replay-protected check accepts a fresh, correctly signed webhook', () => {
  assert.equal(run(`h = generate_signature_header("k", '{"a":1}')
print(verify_webhook_signature_with_replay_protection("k", '{"a":1}', h))`), 'True');
});

test('the replay-protected check rejects a tampered payload and an old timestamp', () => {
  assert.equal(run(`h = generate_signature_header("k", '{"a":1}')
print(verify_webhook_signature_with_replay_protection("k", '{"a":2}', h))`), 'False');
  assert.equal(run(`import hmac, hashlib
t = str(int(time.time()) - 600)
s = hmac.new(b"k", f"{t}.{{}}".encode(), hashlib.sha256).hexdigest()
print(verify_webhook_signature_with_replay_protection("k", "{}", f"t={t},v1={s}"))`), 'False');
});

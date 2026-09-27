import assert from 'node:assert/strict';
import { fetchGameJson, fetchOptionalGameJson } from '../src/data/gameApi.js';

const originalFetch = globalThis.fetch;
try {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return calls === 1
      ? { ok: false, status: 503, statusText: 'Unavailable' }
      : { ok: true, text: async () => '{"name":"Djan"}' };
  };
  assert.deepEqual(await fetchGameJson('https://example.test/profile?name=Djan'), { name: 'Djan' });
  assert.equal(calls, 2, 'retry a transient equipment or profile failure once');

  calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('temporary network error'); };
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(await fetchOptionalGameJson('https://example.test/clan'), null);
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(calls, 2, 'optional clan/faction failure must not block the character');
  await assert.rejects(fetchGameJson('https://example.test/equipment'), /Игровой API не ответил/);
  console.log('Game API retry and optional data fallback: OK');
} finally {
  globalThis.fetch = originalFetch;
}

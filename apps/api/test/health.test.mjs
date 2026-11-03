import assert from 'node:assert/strict';
import test from 'node:test';
import { handler } from '../dist/index.js';

test('gateway health probe returns JSON', async () => {
  const result = await handler({ routeKey: 'GET /health' });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(JSON.parse(result.body), { status: 'ok' });
});
test('unregistered routes are unavailable', async () => {
  assert.equal((await handler({ routeKey: 'POST /plans' })).statusCode, 404);
});

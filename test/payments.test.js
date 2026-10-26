'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { capturePayment, isRetriable } = require('../src/checkout');

test('capturePayment calls client.capture with the order details', async () => {
  const calls = [];
  const client = {
    async capture(opts) {
      calls.push(opts);
      return { ok: true, id: 'cap-1' };
    },
  };
  const order = { id: 'order-123', total: 4200, currency: 'GBP' };
  const result = await capturePayment(client, order);

  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].orderId, 'order-123');
  assert.strictEqual(calls[0].amount, 4200);
  assert.strictEqual(calls[0].currency, 'GBP');
  assert.ok(result.ok);
});

test('isRetriable returns true for 5xx and timeouts', () => {
  assert.strictEqual(isRetriable({ statusCode: 503 }), true);
  assert.strictEqual(isRetriable({ code: 'ETIMEDOUT' }), true);
  assert.strictEqual(isRetriable({ code: 'ECONNRESET' }), true);
});

test('isRetriable returns false for 4xx and unknown errors', () => {
  assert.strictEqual(isRetriable({ statusCode: 400 }), false);
  assert.strictEqual(isRetriable(null), false);
  assert.strictEqual(isRetriable({}), false);
});

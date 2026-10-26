'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { DEFAULT_LIMITS } = require('../src/rateLimit');

// The quota tiers below are the ones proposed to the API consumers team.
// This test will stay red until the agreed numbers land in DEFAULT_LIMITS.
// Blocked on PLAT-4 "quota tiers agreement" conversation.
test('partner tier quotas are configured', () => {
  assert.strictEqual(DEFAULT_LIMITS.partnerFree, 60, 'partnerFree quota is missing from DEFAULT_LIMITS');
  assert.strictEqual(DEFAULT_LIMITS.partnerStandard, 300, 'partnerStandard quota is missing from DEFAULT_LIMITS');
  assert.strictEqual(DEFAULT_LIMITS.partnerEnterprise, 1500, 'partnerEnterprise quota is missing from DEFAULT_LIMITS');
});

test('DEFAULT_LIMITS exposes the standard token and ip ceilings', () => {
  assert.strictEqual(DEFAULT_LIMITS.perToken, 600);
  assert.strictEqual(DEFAULT_LIMITS.perIp, 120);
});

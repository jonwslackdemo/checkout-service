'use strict';

// Token-bucket rate limiter keyed by API token and client IP.
// Partner-specific quotas override the defaults via the config map.

const DEFAULT_LIMITS = {
  // requests per minute
  perToken: 600,
  perIp: 120,
};

function createLimiter({ now = Date.now, partners = {} } = {}) {
  const buckets = new Map();

  function take(key, limit) {
    const bucket = buckets.get(key) || { tokens: limit, lastRefill: now() };
    const elapsed = now() - bucket.lastRefill;
    const refill = Math.floor((elapsed / 60000) * limit);
    if (refill > 0) {
      bucket.tokens = Math.min(limit, bucket.tokens + refill);
      bucket.lastRefill = now();
    }
    if (bucket.tokens <= 0) {
      buckets.set(key, bucket);
      return false;
    }
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return true;
  }

  return function middleware(req, res, next) {
    const token = req.headers['x-api-token'];
    const ip = req.ip;
    const partnerLimit = partners[token]?.perToken ?? DEFAULT_LIMITS.perToken;
    if (token && !take(`token:${token}`, partnerLimit)) {
      return res.status(429).json({ error: 'rate_limited', scope: 'token' });
    }
    if (ip && !take(`ip:${ip}`, DEFAULT_LIMITS.perIp)) {
      return res.status(429).json({ error: 'rate_limited', scope: 'ip' });
    }
    return next();
  };
}

module.exports = { createLimiter, DEFAULT_LIMITS };

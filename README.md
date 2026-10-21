# checkout-service

Node service responsible for payment capture across the storefront. It fronts the external payment provider, handles idempotency keys, retries on transient failures, and reconciles orders back to Postgres.

## Architecture

- `src/checkout.js` — payment capture orchestration and retry logic
- Postgres — order and payment-attempt state
- Redis — idempotency key cache (short-lived)
- Upstream payment provider — external HTTP API

## Development

```
npm install
npm start      # launches the service
npm test       # runs the test suite
```

## Release history

See [CHANGELOG.md](./CHANGELOG.md).

## Rate limiting

The public API gateway enforces per-token and per-IP rate limits via `src/rateLimit.js`. Defaults are 600 req/min per token and 120 req/min per IP. Partner-specific quotas can be supplied via the `partners` config map at startup.

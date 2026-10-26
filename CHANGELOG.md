# Changelog

All notable changes to this project are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed
- `capturePayment` now sends the `Idempotency-Key` header on every retry attempt (PLAT-1). Fixes 500s surfaced during INC-1.

## [2.13.0] - 2026-10-07

### Added
- Initial scaffold of checkout-service.
- Payment capture flow with retry on transient failures (`src/checkout.js`).
- README with architecture overview and local development instructions.

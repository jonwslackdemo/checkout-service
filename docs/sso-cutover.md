# SSO cutover plan

Draft — not final.

## Phases

1. Dual-run: SSO and legacy both live, SSO off by default per tenant.
2. Opt-in: internal tenants flip SSO on.
3. Enforce: legacy login disabled for all users.

## Open items

- SAML metadata exchange validated with the IdP in staging.
- Role mapping dry-run with HR system groups.
- Session cutover plan — do we invalidate existing sessions or let them age out?

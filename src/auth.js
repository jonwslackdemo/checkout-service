'use strict';

// SSO auth adapter — SAML flow against the corporate IdP.
// This module replaces the legacy username/password flow and is wired up
// in src/index.js once the cutover is approved.

const PROVIDER = 'okta';

async function verifyAssertion(samlResponse, { idp }) {
  // TODO: validate signature, audience, and NotBefore / NotOnOrAfter conditions.
  // TODO: map SAML groups to internal roles via idp.groupRoleMap.
  return {
    provider: PROVIDER,
    userId: samlResponse?.subject?.nameId ?? null,
    groups: samlResponse?.groups ?? [],
    roles: [],
  };
}

module.exports = { verifyAssertion, PROVIDER };

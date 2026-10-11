# RFC — ForgeFrame Commerce Core v1 (audit and target architecture)
Date: 2026-10-11 | Status: PROPOSED / ANALYSIS ONLY | Owner: ForgeFrame Labs central platform

## 0. Decision and scope
Build ONE centrally operated commerce, customer identity, tax/invoicing and order platform for ForgeFrame Labs, with independently deployed product adapters. The product-specific backends remain separate. A failure in one product's fulfillment worker must not stop the common Checkout or other products' access.

DO NOT convert the existing Contract Guard backend into the platform-wide database or copy its hard-coded $149, Stripe account constraint, scope or GitHub logic. Reuse its tested primitives through reviewed code, not its domain model. Do not co-locate sensitive data from unrelated products. The marketing website remains static GitHub Pages; never place Stripe secrets, user records or auth/session tokens in public JSON.

This RFC has no authority to activate payments, modify payout details or determine statutory VAT registration. One seller is the existing company Stripe LIVE account acct_1UP8qDBmCd7XeVjj. TEST is acct_1UP8qOPX3QHA3WrM. ExtensionOps, AcqPath and marketplace-managed revenues are NOT silently migrated to this merchant.

## 1. Baseline verified 2026-10-11
- Website repo main e714415552e7895a5032be5d64a67ef12aa5d668; canonical https://forgeframelabs.app; 7 catalog entries in data/products.json schemaVersion=2.
- Private CG operations main dd051c52db93df03dba12121870d3be9f74eb58a. Two OPEN PRs on audit (#22, #25). Review and reconcile before merging; do not force-push. Production CG API+Postgres ONLINE, purchase disabled.
- Other site OPEN PRs #78 and #79 change the global visual system. Central platform development must not overwrite those independently. Require design-impact review.
- Stripe LIVE: 4 inactive Products, 4 inactive Prices, no Checkout Sessions, Customers, Invoices, Subscriptions or Payment Links; 1 enabled CG-specific webhook; PL Stripe Tax registration active. All Products tax_code null; all Prices tax_behavior unspecified.
- Contract Guard one-time $149 USD; Connect→Forge one-time EUR 490; OriginDuty Importer PLN 349/month; OriginDuty Customs Agency PLN 899/month. Do not change amounts without owner authorization.
- OriginDuty production Railway: public-pilot, customer-workspace, alerts, feed-watch and Postgres have successful deployments; web service offline; public signup HTTP 200 does NOT prove paid activation. Connect→Forge commerce project has a staging resource but no proven running commerce service. Digital Packager delivery Railway is offline. Localization QA is free and local-first. OTOMOTO is an external Apify channel.
- Main root /terms.html covers only Contract Guard; global PL/EN order terms and harmonized privacy for authentication/tenant/billing are NOT ready.
- Prior CG sandbox report mentions paid test Checkout, signed webhook, invoice, refund and separate DB restore, but this must be revalidated in current release pipeline. Sandbox passing does NOT certify other product lifecycles.

## 2. Product taxonomy and policy
Supported first-class commerce types: FREE; EXTERNAL_MARKETPLACE; ONE_TIME_SERVICE; ONE_TIME_DIGITAL_DELIVERY; RECURRING_SUBSCRIPTION. Future metered/API usage-based and marketplace receipts require separate reviewed adapters.
Every offer uses stable slug, offer_id, offer_version, owner, display locales, verified product status, billing_type, currency, tax_classification, Stripe Product and separate relevant Price IDs, fulfillment adapter, entitlement_key, support policy and legal_terms_version. Public catalog is descriptive only; backend is the authority for eligibility, prices, tax behavior and enabled status. No generic price supplied by browsers.

A paid offer is NOT LIVE based on presence of a landing page, Stripe Product object or a successful HTTP healthcheck. Product-level release status is DRAFT -> TESTABLE -> CERTIFIED -> LIVE -> PAUSED -> RETIRED. Separate overall emergency STOP; never activate all offers from one switch.

## 3. Topology
- forgeframelabs.app: shared marketing, PL/EN, canonical/SEO, evidence, offer and CTA. GitHub Pages static, no private sessions.
- app.forgeframelabs.app (proposed, domain/DNS to verify): one customer portal: purchases, organizations, invoices, entitlements, work progress, billing, support, recovery.
- commerce-api.forgeframelabs.app (proposed, domain/DNS to verify): shared server-side API: identity/session, offer catalog, eligibility, Checkout creation, Stripe webhook, subscription/billing, reconciliation, audit.
- New private GitHub repository proposed: reflectme-source/forgeframe-commerce-core. Separate Railway project/environment: dev, isolated TEST, production. PostgreSQL private-only, application API and independent outbox worker; observability and scheduled reconciliation.
- Product apps: Contract Guard delivery operator, Connect→Forge report delivery, OriginDuty tenant-based monitoring, Digital Packager secure download; remain independently deployed. Their adapters receive authenticated, scoped, idempotent commands/events only. No broad access to Commerce DB or merchant secret. They must never validate access using only a browser return URL.
- Externally sold product (e.g. Apify): public CTA goes to provider; do not pretend central Stripe collects those purchases. A future verified external receipt adapter may import an entitlement after provider proof and terms permit it.

## 4. UX and customer journey
Product discovery -> clear fixed offer/price and limitations -> eligibility/preflight when needed -> BUY -> Individual or Business -> minimal billing details -> applicable tax/final total -> Stripe-hosted Checkout -> server-verified order -> optional account claim -> product-specific onboarding -> first value -> order/delivery status -> invoice and support -> refund/cancel/recovery.

Choose ONE product per Checkout at first release. Do not mix one-time services with subscriptions in one cart. Store offers and locales separately. No sales call or manual email quote for a pre-approved fixed-scope offer; unsupported cases must have honest request-help path without charging. At checkout show delivery ETA, refund/withdrawal information and meaningful button label indicating obligation to pay.

Guest checkout remains permitted; after verified payment issue an order claim invitation via verified email/short-lived token. Offer OAuth where appropriate (GitHub for developer products) and email magic-link/passkey for others. Never attach a paid order to a user merely because they typed the same email address in Stripe. Customer support recovery must verify identity. Transactional emails are allowed; no manual back-and-forth required.

UX reference principles (not visual copying): Stripe for trustworthy Checkout and final totals; Clerk for account/organization transitions; Linear for dense, task-oriented status views. Preserve current ForgeFrame system/global CSS, PL/EN header/footer and product-specific presentation. Test 360/768/1440, keyboard, screen reader, errors, empty/success/loading, timeouts, localization and responsive pricing.

## 5. Identity and tenant isolation
Identity: users, verified identities, orgs, org_memberships and role grants. Roles: owner, admin, billing, member/support; permissions checked on server on every operation. Individual buyer may own a personal workspace, business buyer may claim/invite an organization after proof. Organization membership not derived from a shared email domain alone.
Authentication must use a standard, maintained OIDC/PKCE/session stack; do not implement custom password cryptography. HttpOnly Secure SameSite session cookie, CSRF protection, session rotation, MFA for elevated/admin actions, rate limits, audit trail, safe origin and return-url allowlists. Product apps integrate with central identity using audience-bound short-lived tokens or standard OIDC, not a shared domain-wide cookie.
Every order, subscription, entitlement, document and task is owner/organization-scoped. Tenant isolation requires tests and preferably database RLS as defense-in-depth. Product adapters receive only customer-scoped instructions and no cross-tenant DB credentials.

## 6. Durable Commerce data model
Postgres tables (illustrative schema, not yet implemented):
users, identities, sessions, organizations, memberships, invitations, product_registry, offers, prices, customers, billing_profiles, orders, order_items, checkout_attempts, payment_evidence, invoices, tax_evidence, subscriptions, entitlements, fulfillment_jobs, delivery_artifacts, provider_events, outbox, refunds, disputes, audit_log, consents.
Immutable/snapshot per order: offer_version, actual Stripe Price and Product ID, currency, tax behavior, subtotal, total, tax, terms_version, buyer_type, seller/account ID, owner_org, client_reference_id and fulfillment scope. Multiple Prices per offer are expected (e.g. B2B tax exclusive, B2C inclusive). Stripe amounts are minor units and the catalog is an explicit server-owned allowlist.
Unique constraints: (stripe_account_id, mode, checkout_session_id); (stripe_account_id, mode, event_id); payment_intent uniqueness; offer-order idempotency; entitlement provision uniqueness; product + tenant scoped IDs.
No card numbers, raw secrets, private source specs or unrelated product content in Commerce DB.

## 7. Payment and subscription invariants
- API creates idempotent Stripe Checkout from a server-selected approved offer/Price, never an arbitrary amount provided by browser. Product, Price, mode/account, signed order, billing country, tax code and entitlement scope must agree.
- Webhook verifies raw-body Stripe-Signature and exact TEST/LIVE merchant mode; logs unique event IDs, reconciles server-to-Stripe PaymentIntent/Charge/Invoice and processes out-of-order events safely. Success/cancel redirect is presentation only.
- Paid one-time order -> controlled fulfillment outbox; business/subscription access only after positive payment evidence and policy rules.
- Subscription checkout additionally handles subscription.created/updated/deleted, invoice.paid/payment_failed, renewals, retries/dunning, cancellation at period end, plan changes and associated entitlements. Make entitlements derived from verified effective billing state, not an optimistic UI flag.
- Refund/dispute/cancellation cause correctly scoped entitlements to be held/revoked per product policy; never revoke another product in the same organization.
- Separate delivery jobs from webhook handler. Webhook acknowledgement and outbox insert must be atomic; worker retries with capped backoff and dead-letter/alerts. Do not block shared Checkout on one product's fulfillment failure.
- Scheduled reconciliation checks Stripe and DB; non-idempotent/manual actions require operator approval. Payment failures must be visible with a retry path.

## 8. Tax, KSeF and legal boundary
Do not treat presence of Polish Stripe Tax registration as approval for every jurisdiction. Product classification and sales modality matter. B2B vs B2C is not by itself proof of VAT status. Tax ID collection and verification, destination evidence and correct reverse-charge cases must be retained as minimally required.
Preferred commercial display pending legal approval: B2B price exclusive when legally applicable; B2C total inclusive. Stripe tax_behavior becomes immutable when set; use versioned Prices and create new Prices for changed tax treatment.
Polish KSeF may be obligatory depending on seller and aggregate invoiced turnover in 2026. Ministry of Finance indicates the transitional monthly gross 10,000 PLN threshold through 2026 for qualifying small issuers, and that B2C invoicing in KSeF is voluntary. DO NOT infer an exemption from zero Stripe Customers: other channels may count. Integrate an invoice-provider/KSeF adapter and persist issuance status, KSeF number where applicable, corrections, failures and fallback procedures. Stripe's invoice PDF is not automatically a legally sufficient Polish KSeF document for every transaction.
General platform terms PL/EN + product terms versions + privacy notices covering identities, processors, retention, data-subject rights and withdrawal/cancellation. Consumer early-service consent must be specific, not a generic waiver. Transaction terms must be saved durably and linked to the order.

Sources: https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef/ ; https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en ; https://docs.stripe.com/payments/checkout/quickstarts ; https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/

## 9. Adapter contract for ANY new business
A module submits versioned descriptive manifest with:
- product_slug, offer_id, product_owner, owner_contact, supported_locales
- billing_type: free / external / one_time / subscription
- Stripe Product ID and approved Price variant mapping, or external provider metadata
- required_user_identity, buyer_types, eligibility_preflight_schema
- fulfilment_mode: async_service / instant_entitlement / digital_file / external / subscription_activated
- entitlement_key, tenant_resource_key, onboarding_entrypoint
- support_location, refund_cancel_policy, versioned terms
- event schema and consumer/organization authorization rules
- sandbox E2E fixtures, QA report and release gate attestations.
A product backend exposes internal adapter operations preflight, provision, status, retry, suspend/revoke. Commands are idempotent and authenticated, sent through outbox/queue with audience-scoped service credentials. Product never sees the Stripe API key. Adapter returns structured evidence and customer-safe status, not raw internal logs.
Onboarding a new product should require one manifest PR, one adapter, PL/EN product copy and a per-product E2E suite — NOT a new billing backend or customer account system.

## 10. Migration and staged rollout
1. Freeze current runtime evidence; reconcile site vs Stripe vs Railway and open PRs #78/#79 (global design), CG ops #22/#25 (payment). Do not merge conflicting branches blindly.
2. Implement isolated shared Commerce core in new private repo, with separate sandbox and production Railways; production payment release disabled. Migration requires no paid-customer Stripe records on the CURRENT company LIVE merchant at audit time (0 Customers, 0 Checkout sessions, 0 Invoices, 0 Subscriptions), but verify again immediately before cutover.
3. Launch account/organization and order model with guest purchase/secure claim and tenant isolation tests.
4. Integrate one-time Checkout, webhook, outbox and invoice tax adapter; validate real Stripe TEST paid/declined/refund/dispute/dedup/invoice/restore.
5. Integrate Contract Guard as first product using its existing E2E certification, preserving separate implementation PR and evidence. Central and old CG webhook must not both fulfill a new order: add versioned routing/ignore logic and controlled webhook cutover.
6. Integrate Connect→Forge assessment as one-time async report; validate report-generation and access rights.
7. Integrate OriginDuty Importer/Agency subscription and org/portfolio isolation; complete renewal, failed payment, cancellation and access tests. Repair offline main web service only if actually required by approved journey; do not equate public signup HTTP 200 with paid readiness.
8. Integrate Digital Packager only when actual delivery/artifact and license entitlement work; retain PRELAUNCH until then. Keep Localization QA free; keep Apify external.
9. Release by offer with feature flags, minimum smoke/alerts and immediate rollback; preserve existing product URLs. A failure in any fulfillment adapter must not block other products' Checkout or customer billing pages.

## 11. Acceptance evidence (no paper PASS)
- 360/768/1440 real browsers, keyboard, WCAG 2.2 AA targeted checks, PL/EN links and no horizontal overflow.
- Guest individual and business customer; organization claim/invite/ownership transfer; impersonation/cross-tenant denial tests.
- Per-offer correct Product/Price/currency/tax/terms; no stale public Buy CTA when checkout is disabled.
- Authenticated request and signed webhook; duplicate/out-of-order events, failed payments, 3DS, async, cancellation, refund, dispute, invoice error.
- One-time service reaches actual delivery evidence; digital product download license; subscription initial activation and renewal and cancellation; external marketplace link stays external.
- CI and DB transaction tests; sandbox Stripe actual paid test; Railway isolated backup AND restore; monitoring, 5xx alerts, dead-letter retry and runbooks.
- No LIVE activation without tax/legal and product-specific fulfillment checks; no fabricated user or revenue claims. Each offer has independent VERIFIED status and evidence IDs.
- Audit outputs: commit SHA, run ID, deployment ID, exact URL/viewport, Stripe test ids (no secret), DB migration/restore log, operator release decision and rollback plan.

## 12. Today vs future
TODAY target: approve this blueprint, establish shared repo and isolated infra, implement central order/offer/tenant kernel, and make one product E2E in sandbox. If all actual tests and owner gates pass, release ONE real paid offer at a time. Do not promise all four can be genuinely LIVE today merely because the common backbone exists.
FUTURE: a new business adds one adapter + manifest and passes tests. External marketplaces remain externally billed. Only the platform core evolves for shared cross-cutting capabilities, under central controlled releases.

References: docs/PRODUCT-CONTRIBUTION-CONTRACT.md, docs/STRIPE-INTEGRATION-CONTRACT.md, docs/LEGAL-COMPLIANCE-AUDIT-20261011.md, data/products.json, current CG private ops main, Railway runtime and Stripe LIVE catalog.

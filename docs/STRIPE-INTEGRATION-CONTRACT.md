# ForgeFrame Labs — shared Stripe integration contract

## Verified account
Stripe LIVE merchant: ForgeFrame Labs. One merchant across products, independent Stripe Product and immutable Price IDs per offer. The current live API inventory previously returned one active product: Contract Guard Professional Setup. This file does not enable billing or imply other products have checkout.

## Responsibilities
Global operator owns Stripe account security, tax settings, credentials, central webhook policy, reconciliation and shared design. Product operator owns specific product page, truthful price display, scope, refund/cancellation terms, customer support, fulfillment and SKU requirements. Coordinate changes via PR; do not update other product owners' files.

## Product integration handoff
Before asking central operator to activate a product, provide: slug and public URL; product name and verified live/test price(s), currency, recurring/one-time mode, tax treatment, sales eligibility, fulfillment mechanism (SaaS license, download or manual service), cancellation/refund policy, support contact, backend URL, and required tenant entitlement. Do not place keys in GitHub Pages, public JSON, links, logs or JavaScript.

## Production architecture
Static forgeframelabs.app is marketing only. Dedicated server-side billing API maintains an allowlist of SKU and Stripe Price IDs; browsers must not set arbitrary amounts. Server creates Stripe Checkout Session. Secure backend verifies Stripe-Signature against raw webhook body, stores event idempotently, handles replay/out-of-order events, checks real billing state, and grants/revokes product entitlements only after verified events. Check subscription lifecycle, invoice failures, refunds, disputes, and manual-service fulfillment. Protect tenant isolation and audit mutations. Success redirect is UX only, never proof of payment.

## Release gate
Account owner validates terms, eligible payment/tax setup, product readiness, customer data/privacy disclosures. Product operator passes testmode checkout, signed webhook end-to-end, delivery/provisioning, retry/refund, notification and reconciliation checks. Central operator verifies production domain and monitoring. Do not launch LIVE checkout, subscriptions, recurring charges or purchase links until individual product is ready and explicitly approved.

## Design contract
Product pages follow shared ../assets/forgeframe-system.css tokens and accessibility requirements; no invented testimonials, certifications or screenshots. Preserve existing product URLs. Each product chat edits only owned landing pages, docs and product-specific registry record. Global homepage, catalog CSS and Stripe account remain central-operator-owned.

# ForgeFrame Labs — Product Page Experience Contract

## Shared shell
- Reuse approved ffg-header, ffg-footer, language state, mobile menu and shared brand icon on every product page.
- Same Home display typography, neutral dark surfaces and restrained blue accents; product-specific icon colors permitted.
- Accessible keyboard focus, reduced-motion, PL/EN parity and responsive 360 / 768 / 1440 checks.
- Do not invent customer testimonials, integrations, screenshots, API output, availability or prices.

## Standard customer journey
1. Problem-specific hero and honest value proposition.
2. Real product evidence, screenshots or explicitly labeled illustrative examples.
3. How it works: actual product steps.
4. Scope, supported platforms, limitations and verified availability.
5. Pricing/offer only when confirmed by owning product.
6. Appropriate CTA: direct self-service purchase when live, or accurate access/contact flow.
7. Link to the two global ForgeFrame legal documents (Terms and Privacy), each available in PL/EN. Keep product-specific scope, delivery, price, tax, withdrawal and entitlement disclosures in the product offer and checkout; do not create a separate legal terms page.
8. Shared footer and support/privacy.

## Ownership and change control
Each product chat owns its product facts, price, backend and payment integration. Marketing redesigns should be isolated to the product route and use a PR; never silently modify another business, shared global tokens or payment logic.

## Routes to redesign individually
- Contract Guard: /products/contract-guard.html
- OriginDuty: /products/originduty/
- Digital Packager: /products/digital-packager.html
- Merchant Issue Desk: /services/merchant-issue-desk.html
- Connect to Forge: /services/connect-to-forge-assessment/
- Localization QA: /products/localization-qa.html
- OTOMOTO Change Intelligence: /solutions/otomoto-vehicle-monitoring.html

## Release gate
Visual approval -> implementation -> PL/EN -> unit/E2E -> real purchase and entitlement verification when applicable -> PR review -> production. Do not call an unverified payment path production-ready.

## Legal links (global)
- PL terms: /pl/regulamin.html; EN terms: /terms.html.
- PL privacy: /pl/prywatnosc.html; EN privacy: /privacy.html.
- Legacy Contract Guard terms URLs redirect to global terms; never reuse the old Contract Guard-only terms as platform-wide rules.
- Product-specific purchase disclosures must remain visible before checkout, and paid entitlement must follow server-side payment verification.
- Every redesign requires source-verified features, statuses and pricing, an approved visualization, PL/EN parity, accessibility and real journey tests.

## Interactive controls (mandatory)
- Every visible primary or secondary CTA must be an enabled, keyboard-accessible control with a meaningful, tested destination or action. Never render decorative or disabled buttons as the only route forward.
- Payment collection and paid entitlement must remain gated by verified backend readiness, trusted payment events and authorization. An active plan-selection link is not proof of an active checkout.
- If checkout is not ready, provide an active, accurately labeled plan-selection or contact route and make its limitations clear. Never claim payment is available when readiness is false.
- On public live-data pages, do not label stale, cached or unavailable feeds as LIVE. Retry transient failures, expose freshness and preserve honest error states.

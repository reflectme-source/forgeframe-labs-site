# ForgeFrame Labs — Product Page Rollout

## Approved shared experience
Use the Home / Products / Developers / About / Contact design language: neutral near-black surfaces, restrained blue accents, differentiated product icons, Inter display typography, fixed shared header/footer, explicit active PL/EN language, and compact, responsive cards.

Every product gets a visual proposal for approval before its own code implementation. Do not clone the same marketing content into every product.

## Product-by-product ownership and rollout order
1. Contract Guard — /products/contract-guard.html — developer product: show real OpenAPI diff, GitHub Actions workflow, PASS/BLOCK example, documented scope, free Action vs paid implementation. Do not change existing checkout or entitlement behavior without backend tests.
2. OriginDuty — /products/originduty/ — regulatory intelligence: show verified TARIC/regulatory sources, alert lifecycle, monitoring scope, availability; do not claim automated coverage beyond evidence.
3. Localization QA Inspector — /products/localization-qa.html — local browser tool: show real CSV inspection, privacy-local processing and launch CTA.
4. OTOMOTO Change Intelligence — /solutions/otomoto-vehicle-monitoring.html — change-monitoring service: show real data limitations, marketplace separation and service model.
5. Merchant Issue Desk — /services/merchant-issue-desk.html — service-led buyer journey: scope, deliverables, qualification and direct inquiry.
6. Digital Packager — /products/digital-packager.html — upcoming digital workflow: show only verified functionality and honest availability.
7. Connect → Forge — /services/connect-to-forge-assessment/ — technical assessment: scope, acceptance criteria, intake, payment only if available.

## Standard content architecture
- Product-specific hero and differentiated artwork or authentic interface.
- Real workflow in 3–5 steps.
- Evidence/demo labeled honestly.
- Capabilities and exclusions.
- Verified pricing, tax and delivery model, or an accurate non-purchase CTA.
- FAQ and support.
- Shared legal links: /terms.html, /pl/regulamin.html, /privacy.html, /pl/prywatnosc.html.
- Product-specific checkout disclosures belong in the offer/checkout, not in a separate terms page.

## Release gate
Visual approval -> product fact verification -> implementation in PL/EN -> 360/768/1440 visual QA -> keyboard/WCAG 2.2 AA review -> functionality and error-state tests -> backend payment and entitlement E2E when applicable -> PR review -> merge/deploy.

## Cross-chat coordination
Each product-owning chat may edit only its product routes and local assets, using a separate branch/PR. Shared navigation, footer, Stripe account-level configuration, global CSS tokens, and legal documents are owned centrally. Product teams must not silently change other products or prices. No invented testimonials, customer counts, metrics or integrations.

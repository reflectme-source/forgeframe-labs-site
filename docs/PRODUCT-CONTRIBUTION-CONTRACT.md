# ForgeFrame Labs — portfolio contribution contract v1

The ForgeFrame root is the common brand and product directory. Each separate product chat owns its product landing page only. Do not edit the shared home page, CSS foundation, other products, Stripe configuration or global legal terms without a dedicated infrastructure PR.

## Canonical paths
- Main brand: https://forgeframelabs.app/
- Catalog: https://forgeframelabs.app/products/
- Individual product: prefer /products/<slug>/ for new entries. Legacy .html routes remain supported; do not break indexed addresses without a verified redirect.
- Independent applications and customer data must run on separate secured infrastructure. Never use GitHub Pages as an authentication backend.

## Design contract
Use /assets/forgeframe-system.css and scoped ff-* classes. Core palette: #0b1420, #112538, #d1ecff, #f4f7f9. Use accessible semantic HTML, visible keyboard focus, responsive navigation, strong typography, and a single primary CTA per section. No fake reviews, numbers, mock dashboards presented as real software, stock customer screenshots or unsupported security claims. Explain product capability, buyer, workflow, supported integrations, honest availability, real pricing model, limitations, FAQ, contact, privacy and relevant terms. Accessibility and mobile review required.

## Product registry
Machine-readable catalog: /data/products.json. Product owner opens PR updating its own registry record and landing page. Use stable slug, accurate availability and salesMode. No speculative prices or 'buy' buttons for non-live purchase flows. PR must preserve PL/EN linking and old external URLs. Product registry is descriptive, not an authorization database.

## Shared Stripe contract (not yet activated)
One Stripe LIVE merchant for ForgeFrame Labs, with distinct Stripe Products and immutable Price IDs per offer. Product owner does not create a separate Stripe merchant or paste secret keys into front-end code. Backend creates Checkout Sessions using server-side allowlisted product + price IDs and associates tenant/org and order IDs. Verify Stripe-Signature from raw payload, apply idempotent event handling, record invoice/payment state and derive access server-side; never grant access solely from the success URL. Use independent fulfillment for one-time service orders. Separate test/live keys and endpoints. Support refunds, cancellation, retries, failures and reconciliation. Never assume one price per product. No active checkout until a verified backend, product terms, tax/merchant configuration and fulfillment readiness exist. Global billing platform must have dedicated maintainers; project operators submit their pricing and fulfillment requirements via PR.

## Release gates
Create a branch from current main. Change only owned product files + relevant registry record. Check link integrity, canonical, legal disclosures, mobile UX and contact flow. Run CI; require review for global changes. No force-push main. Publishing a page is not evidence of paid sales or checkout readiness.

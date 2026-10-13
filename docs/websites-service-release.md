# ForgeFrame / Websites — Release

## Placement
The site is product-first. Websites appears in the shared nav before Developers, a dedicated Home highlight after the hero, Products / Business Solutions, and footer. Existing products remain intact.

## Offer and legal scope
EN /websites/; PL /pl/strony-internetowe.html.
Starter from USD 990 (one page, two revisions); Business from USD 1990 (up to five pages, two revisions); Custom from USD 3490, scope by quote. Final price, delivery, applicable taxes, domains, hosting, third-party fees, ownership and licenses are agreed in writing. No online payment or automatic entitlement.

## Demonstrations
Two responsive, real static demonstration sites: Northline Service Studio (B2B) and Atelier Table (hospitality), each PL and EN. Explicitly conceptual, noindex; not customer work, testimonials or traffic claims.

## Contact flow
Existing FormSubmit provider, no new backend. product=websites and allowlisted package=starter|business|custom plus validated source. Package shown to visitors and included in optional service_package. No test submissions to public mail required.

## Navigation
Shared forgeframe-shell.js inserts exactly one Websites link before Developers in global header and footer. KSeF non-script pages get equivalent static links to preserve their no-JS architecture.

## QA
Node site contract tests; Chromium PL/EN at 320,360,375,390,430,768,1440; mobile hamburger and Escape; Home and catalog filters; contact prefill; concept pages; no overflow and no JS exceptions. SEO metadata, canonical, hreflang, OG image, JSON-LD. Lighthouse numbers and real FormSubmit delivery remain unmeasured unless separately evidenced.

## Deployment
Prefer a new PR from latest main, not closed PR79. Merge only after CI and production rollback plan. Verify live domain and contact flow without unnecessary inbox messages.

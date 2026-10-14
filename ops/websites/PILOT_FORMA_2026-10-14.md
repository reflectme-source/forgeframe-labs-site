# FORMA Studio — Webflow pilot report
Date: 2026-10-14
Status: FIRST END-TO-END CMS DEMO PUBLISHED; NOT A LIVE CLIENT DELIVERY

## Verified
- Site: ForgeFrame Demo 01 (Webflow workspace)
- Demonstration brand: FORMA Studio (fictional architecture/interior concept)
- Public demo: https://forgeframe-demo-01.webflow.io/
- Home page includes editorial hero, portfolio concepts, service/philosophy, approach, client-ready contact information to ForgeFrame Labs, fictional-business disclosure.
- Native Webflow elements/styles and Webflow-hosted photography assets, mobile breakpoints configured.
- CMS collection: Concept Projects (three editorial items), each with Name, Slug, Project Overview, Discipline, Project Image, Project Status.
- Native Collection List bound to Concept Projects, dynamic mode, limit 3; title, description, status, image bound to CMS fields.
- Published site and all three CMS records confirmed by Webflow tools.
- Verified content-update pathway: changed Still House's overview to 'Natural materials, gentle daylight and a quieter rhythm of everyday living.' via Webflow CMS; published that CMS item only; independent fetch of public demo showed the updated text and six image URLs (three editorial feature images + three CMS cards).
- Homepage SEO/OG metadata explicitly identifies fictional concept.
- No custom domain, subscriptions, customer invitations, real client content, payments, live lead-collection form, or production ForgeFrame changes.

## Limitations / remaining QA
- This is an editorial demonstration, not a complete commissioned website.
- The CMS card data update was verified, but a client role invitation / editor handover has NOT been tested. Check plan-dependent access, limits and billing before committing to clients.
- Static editorial gallery sits above the dynamic CMS project archive intentionally for the pilot; a real client site should avoid duplicated content and use its approved content structure.
- Responsive CSS configured and Designer screenshots of hero/gallery reviewed. Real mobile browser rendering, Lighthouse metrics, keyboard-only navigation, WCAG/accessibility tests, and form-deliverability tests remain PENDING.
- Hero background on the element was explicitly set after visual inspection and the site was republished.
- Site is public on webflow.io, not password-protected. Never add private customer materials.
- Demonstration photos imported from Unsplash URLs. Confirm licensing and attribution needs for each customer's assets.
- Native HTML elements and CMS bind accurately; no fake testimonials, awards, client relationships, or real studio addresses.
- SEO performance, conversion rates, sales and profitability have NOT been measured.
- Webflow Starter account and plan constraints to be verified for transferring production sites and granting client editing access.

## Next release gate
1. Ask internal reviewer to open the live demo on phone and desktop.
2. Inspect layout and real mobile breakpoints; fix issues.
3. Test buyer onboarding with a real client-owned Webflow account and permission-specific handover (no credential sharing).
4. Test a fully functional inquiry form with client-authorized destination and privacy requirements on a separate test site.
5. Validate client billing, ownership transfer / departure, support warranty, contract and tax treatment.
6. Only after a paid pilot launch consider publishing the ForgeFrame Websites service in the main ForgeFrame commercial offer.

# ForgeFrame Websites — one-off website delivery standard v1
Date: 2026-10-14 | Status: DRAFT, internal | Business decision: **no ongoing maintenance sold by default**.
This document is the canonical operating model for simple client sites (the creative/design quality program is separate and not yet approved).

## What ForgeFrame sells
One fixed-scope WEBSITE IMPLEMENTATION service (aligned to current public pricing: Starter USD 990 / Business USD 1,990 / Custom from USD 3,490, with individualized accepted final quote): research -> brief -> agreement -> deposit -> build -> staging QA -> revision rounds -> acceptance -> balance -> ownership transfer -> customer-paid hosting/domain -> production launch -> handover/closure.
ForgeFrame does NOT resell hosting, renew customer domains, monitor sites 24/7, maintain CMS content, or assume open-ended support unless contracted explicitly.
Warranty for defects in the original delivery is separate from later maintenance; comply with mandatory law and specify term/scope in contract. Optional future tasks require a new quote/order.
Do not market demo FORMA as premium design evidence: rejected at the creative quality gate.

## Customer promise
- Customer legally registers/owns domain, controls Webflow Workspace and billing card, receives the site under negotiated contractual rights, and can edit approved text/images/CMS fields without contacting ForgeFrame.
- Webflow is managed vendor hosting, but client pays Webflow's recurring Site plan and registrar's domain renewal DIRECTLY. This must be disclosed in the proposal, including annual/monthly choice and plan dependencies.
- Webflow editor does not mean all layout, site configuration or complex functions are editable by a content editor. Build native editable elements and CMS collections, not a single pasted HTML blob.
- Clearly disclose Webflow platform lock-in: static-code export cannot recreate all dynamic CMS/form functionality on another host.
- No ForgeFrame account/password becomes a permanent single point of failure.

## Stage owner map and gates
| Status | ForgeFrame + AI work | Customer responsibility | Exit evidence |
| --- | --- | --- | --- |
| LEAD_NEW | classify, research public business facts; draft reply, check duplicate/outreach legal basis | give enquiry | inquiry id and reply draft |
| QUALIFIED | fit check: simple site vs shop/booking/app; expected hosting/CMS costs, delivery scope | answer key constraints | qualification record |
| BRIEF_COMPLETE | gather name, services, business goal, audience, location, languages, domain, existing DNS/email, material rights, privacy/form expectations | approve facts/assets and supply missing | approved brief |
| OFFER_SENT | prepare fixed scope, price, realistic delivery dates, two revision rounds, costs to client, exceptions/change-order, termination, defects/warranty, source/design license/rights | accept scope and agreement | dated accepted agreement |
| DEPOSIT_CONFIRMED | create invoice/payment link from authorized company Stripe, verify provider status | pay initial 50% | confirmed payment reference |
| BUILDING | prepare and design per separate quality gate; build in client-editable platform, no fabricated testimonials / facts | answer material questions | version-controlled/staged deliverable |
| INTERNAL_QA | test visual/functional/mobile, content, a11y, SEO, forms, licenses, staging privacy | none | passing QA checklist |
| CLIENT_REVIEW | send staging URL, collect consolidated comments, control scope and change requests | review and approve or send revisions | dated comments / approval |
| REVISIONS | up to 2 included rounds *within original scope*, more only after revised quote | accept revised version | final UAT accepted |
| BALANCE_CONFIRMED | verify 50% final payment before transfer; prepare asset/admin/DNS transfer | pay balance | verified Stripe event |
| TRANSFER_PENDING | initiate free-site transfer, send recipient invitation; preserve handover proof | own Webflow account, accept invitation | recipient owns site |
| CLIENT_BILLING | guide appropriate Site plan selection; don't buy on customer's behalf | enter card/accept Webflow subscription | plan confirmed on client account |
| DOMAIN_CONFIG | document preexisting DNS, preserve MX/SPF/DKIM/DMARC, supply required Webflow A/CNAME/TXT; authorized configuration only | authorize registrar DNS changes | HTTPS web and email regression tests |
| LIVE_QA | publish with approval, test canonical www/root, SSL, contact forms delivery, content, links, SEO, no indexing restrictions, redirects after migration | verify visitor/customer journey | actual public URL + checks |
| HANDOVER_ACCEPTED | record provider/site/registrar ownership, content edit procedure, 3–5min walkthrough, warranty/reporting channel, exit limitations, revoke access | log in, edit a genuine CMS item and publish, confirm acceptance | signed/email handover record |
| COMPLETE | close order, issue applicable invoice and records, store docs according to privacy policy, stop recurring work | manage site independently | no open action/agency bills |
Exceptional states: WAITING_CLIENT, OUT_OF_SCOPE, PAYMENT_PENDING, BLOCKED, CANCELLED; every order has next_action, due_date and blocking_party.

## Webflow-specific handover on Starter Workspace
1. Studio builds/proves site in free Webflow staging. Beware staging is potentially public, not password-protected on free plan.
2. For Webflow Starter WORKSPACE there are only 2 unhosted staging sites and 2 static pages per staged site (50 CMS items). At ~2 builds/day this is a pilot-only tier. Paid Freelancer Workspace: 10 staging sites, 300 static pages/staged site, $16/month billed annually; Agency Workspace: unlimited staging sites, $35/month billed annually (prices as of 2026-10-14). Do not buy a plan without owner approval; do not promise 5-page build on free staging.
3. While agency is on Starter, **do not activate a paid Webflow Site plan before transferring**. A paid site transfer is permitted from Freelancer/Agency; from Starter you must downgrade Site plan to free first. See https://help.webflow.com/hc/en-us/articles/33961238786963-How-do-I-transfer-a-site-or-plan-to-another-workspace .
4. Customer creates Webflow account + Workspace. Following accepted design and final invoice settlement: agency Site settings > Transfer icon > choose destination > recipient email > Transfer. Customer receives invite and accepts. The site then disappears from agency Workspace. Do not treat just sending invitation as successful transfer.
5. Customer upgrades correct paid Webflow Site plan under *customer's own payment method*, then connects domain. Basic currently $15/month if annual billing for no CMS; CMS-featured site Premium starts $25/month if annual billing; prices exclude tax, per-site and subject to changes. See https://webflow.com/pricing .
6. Record transferred Webflow CMS, images, pages and styles; check form-notification emails, CAPTCHA, third-party integrations and billing because several account-level settings are reset/require reauthorization after transfer.
7. After transfer, agency access is **not guaranteed**. Client must explicitly invite agency when further work is necessary; Freelancer/Agency workspace may be necessary for agency guest role. Do as much prelaunch work before transfer as possible and agree a practical handover test in advance.
8. Alternative at later scale: Webflow Client payments, only when agency Workspace is Freelancer/Agency, shifts hosting bills but DOES NOT transfer site ownership. Not the default for one-off projects. See https://help.webflow.com/hc/en-us/articles/35335039878035-Client-payments .
9. Contents edits via Webflow Content editor: text/image/CMS, publish with assigned permission; design, structure, schema/complex configurations remain admin tasks. See https://help.webflow.com/hc/en-us/articles/33961251014931-Edit-site-content-as-a-content-editor .

## PRELAUNCH quality gate
- Clear legitimate brand ownership, real claims, rights-cleared images, legal texts from client/counsel. Avoid implying demo stock imagery is client's actual work.
- Site must load on desktop, phone, keyboard and common browsers. Test at 320/375/768/1440 widths; headings, nav, contrast, forms, errors, successful delivery, valid links, canonical, metadata, alt text, sitemap/robots, responsive performance. Test real form submission (consent and delivery) not just appearance.
- If replacing an existing website: backup/snapshot original, document old URLs, 301 redirect plan, keep email DNS records unchanged; record propagation window and rollback support.
- Collect explicit LAUNCH approval; verify final payment before transferring control/going live.
- Run independent content-editor exercise: change one text/image/CMS item and publish with customer role. Verify result on production.
- If a test fails, keep WAITING/QA and do not declare COMPLETE.

## Scope / relationship / exit
- Defined deliverables and two batched revision rounds; clear change-order procedure and price.
- Client is responsible for provider renewals and CMS/data entry after handover.
- ForgeFrame must fix its delivery defects under the contract and applicable statutory rights; not an unlimited change subscription.
- Future feature requests, redesigns, additional pages, hosting/vendor account problems or updates caused by customer changes are new paid assignments unless covered by original contract/law.
- Define plan cancellation and export/platform limits in handover.
- Client must retain admin ownership; do not store passwords; use revocable per-project delegated access, disable after handover.

## Required records (no complex CRM on first 10 orders)
One row/order: project_id, lead source, customer legal name, jurisdiction, scope, offer version, acceptance, invoice/deposit reference, current_state, next_action, due_date, design_version, staging_url, final QA link, balance reference, transfer invitation/acceptance, client_site_id, client_workspace_id, customer registrar/domain, hosting_plan_owner, production_url, handover_acceptance, support/warranty end, outcome.
Use only evidence/reference IDs, not card numbers/passwords/PII copied into an unsecured repo.
Limit active build work to capacity confirmed by tests; target up to two simple builds per day, not two finished launches if clients are delayed.

## Roles
- ChatGPT with connected tools: research and brief preparation, draft messages, building CMS/site, test automation where supported, staging, checklists, reminders and documented project updates.
- ForgeFrame owner: accept unusual scopes/prices, commercial commitments, legal terms, permissions, paid purchases, customer communication policy and cash management.
- Customer: provide information/permissions, contract approval, funds, domain/registrar ownership, paid Site plan, content approval and handover.
No continuous unattended operation is claimed; the process is currently manual/agent assisted until verified event-driven automation exists.

## Implementation priorities
P0: Confirm one-off policy (this decision), one fixed-scope offer and accepted service agreement reviewed for cross-border B2B/VAT.
P1: Check Webflow permissions and staging limits for real 5-page deliveries, customer account and transfer test using a second authorized test account.
P2: Validate build/design quality separately; do not sell the existing FORMA demo as premium.
P3: Run complete paid-order rehearsal without live charge: brief -> accepted offer -> staging -> simulated final payment -> transfer -> client-owned site plan chosen in sandbox/not purchased -> domain test -> self-edit -> close.
P4: Publish approved service offer and resume authorized client prospecting only after delivery process passes.

## Alternative production route to evaluate: build inside customer-owned Workspace
Official agency/freelancer guest feature: https://help.webflow.com/hc/en-us/articles/42697937385747-Guide-for-agency-or-freelancer-guests . Customer remains owner from day one, invites agency as a scoped guest; no project transfer required. Agency must have a **paid Freelancer or Agency Workspace** to be an authorized guest. Agency cannot see client's confidential billing settings. ForgeFrame can revoke/leave access after delivery. Must confirm ChatGPT Webflow MCP can access guest-shared site IDs with authorized scopes before promising agent-led implementation.

CAVEAT: Client's own free Starter plan has a two-static-page staging limit; 5-page site built directly on client's free Workspace may require activation of a paid Site plan BEFORE completion. Don't make the customer incur that subscription before they explicitly agree. For multi-page builds, an agency Freelancer Workspace with up to 10 staging sites / 300 pages can be more economical: build there, receive final payment, transfer free site, and use scoped guest access for post-transfer DNS/QA if client invites us. Agency Workspace unlimited staging becomes attractive after measured lead-to-approval backlogs, not merely a claimed two-builds/day ambition.

Decision gate: choose 1) agency staging + free transfer, or 2) client-owned from beginning, on each offer based on number of pages, staging limitations, prelaunch client billing, whether ChatGPT can access guest-shared sites, and signed responsibilities. Both routes END with customer owning site, domain and paid plan; agency does not maintain site.

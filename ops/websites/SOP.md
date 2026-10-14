# ForgeFrame Websites — SOP v1 (2026-10-14)

Status: OPERATIONAL DRAFT — not a live offering. Owner approval required for commercial commitments.
Scope: simple brochure sites, 1–5 pages, no e-commerce, user accounts, custom booking systems or regulated data.
Target pace: up to two simple site builds/day after validated pilot; never promise two launches/day.

## Decision
- Default client CMS/hosting: Webflow, with client content-editor role and client-billed Site plan. Confirm seat availability, plan and vendor pricing when quoting.
- Alternative: Wix Studio for built-in business features; WordPress on client hosting if portability is essential.
- Never promise client-editable content for raw static React unless CMS was included.
- Client owns domain and controls renewal; agency uses least-privilege delegated DNS access.
- Agency retains no password copies. Use platform invites and revocable access.
- No production updates to ForgeFrame Labs commerce or existing products during pilot.

## State machine
LEAD_NEW -> QUALIFIED -> BRIEF_COMPLETE -> OFFER_SENT -> CONTRACT_ACCEPTED -> DEPOSIT_CONFIRMED -> BUILDING -> INTERNAL_QA -> CLIENT_REVIEW -> REVISIONS -> CLIENT_APPROVED -> BALANCE_CONFIRMED -> PRELAUNCH_QA -> PUBLISHED -> HANDOVER_ACCEPTED -> COMPLETE.
Side states: WAITING_CLIENT, CHANGE_REQUESTED, REFUNDED, CANCELLED, BLOCKED, SUPPORT.
All transitions should have timestamp, actor, evidence link and next action.

## Delivery checklist
1. Qualify incoming lead (company, target, existing URL, languages, needs, deadline, domain, CMS needs, ability to supply rights-cleared assets). No speculative guarantees.
2. Send scope and fixed-price proposal: pages, functionality, content duties, rounds of revisions, exclusions, delivery dependencies, payment milestones, ownership/licensing and cancellation.
3. Confirm agreement and verified payment in Stripe (webhook / dashboard), never based on redirect or screenshot.
4. Obtain authorized brand assets, legal business details, copy facts and domain ownership confirmation.
5. Produce information architecture + evidence-backed business brief. Flag unverified claims; NEVER fabricate testimonials, certifications, staff bios, ratings, product pricing or photos of customer premises.
6. Build in client-editable native CMS; templates/components are reusable but design should fit brand and conversion goal.
7. Internal QA: responsive viewport, navigation, keyboard accessibility, contrast, image rights, legal/cookie review, Lighthouse, forms delivered, links, metadata, structured data, sitemap, noindex staging, HTTPS.
8. Send password/access-protected preview and collect one consolidated list of change requests. Two revision rounds included if agreed; scope changes quoted separately.
9. Obtain explicit client approval, settle final milestone, collect client account invitation and DNS delegation.
10. Preserve existing MX/SPF/DKIM/DMARC while changing web DNS. Set DNS, verify SSL, forms and transactional mailbox delivery. For redesigns, plan 301 redirects and Search Console.
11. Verify production with screenshots and smoke tests. Publish only after approval and payments. Record deployment details.
12. Handover: owner/workspace or client payments setup, content-editing role, 3–5 minute video, support instructions, domain renewal responsibility, cancellation/exit and ownership rights.
13. Ask client to demonstrate editing a service, photo, or price and publishing the change without touching site layout.
14. Close with signed/confirmed acceptance and backup/export where feasible per vendor limits.

## Autonomy boundaries
AI can research public facts, build, test, draft messages, create staging previews, and log status.
Human sign-off: final price/offer, legally significant commitments, external cold outreach, payments/refunds, paid plan provisioning, production domain/DNS modification without prior scoped authorization, destructive actions, credentials.
All external communications comply with local marketing laws, approvals and client consent.
One customer = isolated assets, access and work records. Never paste live Stripe/Gmail/customer secrets into source or prompts.

## Standard initial offer (unvalidated prices)
Starter: EUR 590 (one page). Business: EUR 990 (up to five pages).
50% deposit and 50% before publication. Hosting subscription billed by platform directly to client; optional maintenance quoted separately.
These are market-test prices, not proven margins or tax advice. Confirm legal invoicing/VAT treatment and terms with accountant.

## Pilot exit conditions
Demonstration with a fictional company, no third-party personal data.
Accept only when (a) CMS editable by nontechnical client, (b) site preview working and reviewed on mobile, (c) lead form verified, (d) mock client invitation/handover rehearsed, (e) actual costs documented, (f) access revocable, (g) copy and design QA signed off.
No claims of a functioning public demo until URL and deployment are verified.

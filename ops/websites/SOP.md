# ForgeFrame Websites — SOP v1 (2026-10-14)

Status: OPERATIONAL DRAFT — not a live offering. Owner approval required for commercial commitments.
**Canonical commercial model: ONE-OFF BUILD → LAUNCH → TRANSFER → CLOSE, NO AGENCY MAINTENANCE BY DEFAULT.** See [ONE_OFF_DELIVERY_STANDARD.md](ONE_OFF_DELIVERY_STANDARD.md).
Scope: simple brochure sites, 1–5 pages, no e-commerce, user accounts, custom booking systems or regulated data.
Target pace: up to two simple site builds/day after validated pilot; never promise two launches/day. Webflow Starter Workspace allows only 2 staging sites and 2 static pages per staging site, so it is a PILOT ONLY tier for multi-page agency work.

## Decision
- Default client CMS/hosting: Webflow, followed by FULL transfer to customer Workspace while still on the free Site plan, then customer-funded paid Site plan for their own domain. No ForgeFrame hosting resale, client payments or ongoing maintenance by default. Confirm transfer, seat availability, plan and vendor pricing when quoting.
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
8. Send staging preview and collect one consolidated list of change requests. Webflow Starter staging URLs may be public and cannot be treated as password protected. Never stage confidential data publicly. Two revision rounds included if agreed; scope changes quoted separately.
9. Obtain explicit client approval, settle final milestone, collect client account invitation and DNS delegation.
10. Preserve existing MX/SPF/DKIM/DMARC while changing web DNS. Set DNS, verify SSL, forms and transactional mailbox delivery. For redesigns, plan 301 redirects and Search Console.
11. Verify production with screenshots and smoke tests. Publish only after approval and payments. Record deployment details.
12. Handover: by default FULL transfer on free Site plan to customer's own Workspace (not client payments), client billing for the paid Site plan, content-editing demonstration, 3–5 minute video, bug-warranty contact, domain renewal responsibility, cancellation/exit and ownership rights. Re-test form notification settings and third-party access after transfer.
13. Ask client to demonstrate editing a service, photo, or price and publishing the change without touching site layout.
14. Close with signed/confirmed acceptance and backup/export where feasible per vendor limits. No indefinite monitoring, hosting, support subscription or content updates. Delivery defect warranty and mandatory statutory rights remain.

## Autonomy boundaries
AI can research public facts, build, test, draft messages, create staging previews, and log status.
Human sign-off: final price/offer, legally significant commitments, external cold outreach, payments/refunds, paid plan provisioning, production domain/DNS modification without prior scoped authorization, destructive actions, credentials.
All external communications comply with local marketing laws, approvals and client consent.
One customer = isolated assets, access and work records. Never paste live Stripe/Gmail/customer secrets into source or prompts.

## Standard initial offer (unvalidated prices)
Public website price anchors as of 2026-10-14: Starter USD 990 (one page), Business USD 1,990 (up to five pages), Custom from USD 3,490. Actual scope/price, tax/currency, invoicing and timing are confirmed in signed quote; no blanket prices in EUR. Source: /websites/ and /pl/strony-internetowe.html.
50% deposit and 50% before transfer/publication. Hosting subscription billed by platform directly to client; ForgeFrame does NOT offer maintenance on standard orders. Future edits beyond delivery defects are newly scoped work orders.
These are market-test prices, not proven margins or tax advice. Confirm legal invoicing/VAT treatment and terms with accountant.

## Pilot exit conditions
Demonstration with a fictional company, no third-party personal data.
Accept only when (a) CMS editable by nontechnical client, (b) site preview working and reviewed on mobile, (c) lead form verified, (d) mock client invitation/handover rehearsed, (e) actual costs documented, (f) access revocable, (g) copy and design QA signed off.
No claims of a functioning public demo until URL and deployment are verified.

## Additional customer-owned route (do not promise before pilot)
Webflow also allows build-inside-client-Workspace using the official Agency/Freelancer guest role, with a PAID agency Freelancer/Agency Workspace plan. Avoids later transfer, but may require earlier activation of a client Site plan for 3–5 page projects because the client's free Starter staging is limited to 2 static pages. Do not choose until test of permissions, guest-access Webflow MCP visibility, and real provider pricing. See [ONE_OFF_DELIVERY_STANDARD.md](ONE_OFF_DELIVERY_STANDARD.md).

## Canonical customer order documents (2026-10-14)
- **[CLIENT_JOURNEY_CANONICAL_PL.md](CLIENT_JOURNEY_CANONICAL_PL.md)** — current single source of truth for new customer inquiry -> eight-question intake -> fixed quote -> B2B service terms -> Stripe 50/50 -> staging approval -> free Webflow transfer -> customer-owned hosting and domain -> acceptance -> closed.
- **[CLIENT_BRIEF_SHORT_EN.md](CLIENT_BRIEF_SHORT_EN.md)** — only eight brief questions visible to customers, not the lengthy internal intake.
- **[SERVICE_ORDER_B2B_EN_DRAFT.md](SERVICE_ORDER_B2B_EN_DRAFT.md)** — short service order, not legally approved. Must be adapted and validated before first signature or sale. Under Polish IP law, copyright assignment requires signed writing/qualified signature; do NOT equate e-mail acceptance or Webflow site transfer with copyright assignment.
- The separate creative/design quality gate remains FAIL for existing demo; this operating workflow does not authorize advertising it as premium design.

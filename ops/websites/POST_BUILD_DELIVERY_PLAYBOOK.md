# FORGEFRAME WEBSITES — AFTER THE WEBSITE IS ACCEPTED (V1)
Date: 2026-10-14
Commercial status: DRAFT. Follow only after customer acceptance and validated payment/contract. This playbook assumes the design has passed a separate quality gate.

**Default: one-off service, full transfer to customer Workspace; no ongoing maintenance or client-payments setup.** See [ONE_OFF_DELIVERY_STANDARD.md](ONE_OFF_DELIVERY_STANDARD.md).

## Default: customer owns domain and pays hosting supplier directly
Choose one of:
A) Full transfer to customer's Webflow Workspace. Customer owns billing and project, agency can be invited as freelancer/agency guest to assist. For a fully finished, portable ownership relationship this is preferred.
B) OPTIONAL, NOT part of the default offer: after separately approved commercial decision, agency retains site in eligible Freelancer/Agency Workspace, assigns client a Content editor client seat and arranges direct Webflow Client payments. This is operational management + client-billed hosting, NOT transfer of site ownership. Do not pitch before separate owner approval.
Verify current Webflow plan/seat/payment eligibility prior to promises. Starter service-provider Workspace includes one client seat PER PAID SITE, Freelancer one per site staged or paid, Agency three per site (Webflow client seat docs May 2026). Do not assume free staging site gives a client-edit seat.
Content editor can update native page text, images, CMS items, and publish if authorized; cannot redesign layouts, create new CMS collections, or update CMS configuration.
A site with CMS collection features requires a suitable Webflow Site plan to publish on customer's domain. Check live prices and plan limits before quoting; the free webflow.io staging domain does not replace a custom domain plan.

## End-to-end
1. Handover readiness: final creative approval, implemented revision requests, actual content and image rights confirmed, accessibility/SEO/privacy checks, form delivery to correct email and anti-spam test, responsive QA, no staging leak of confidential materials.
2. Written acceptance of agreed scope and payment milestone. Verify Stripe payment state by trustworthy provider event/dashboard before ownership/production release. Don't claim transfer of copyrights and license beyond written agreement.
3. Client owns domain in registrar account in its name. Client either owns Webflow Workspace upfront or is invited for transfer/Client payments as per choice A/B. No login/password collection.
4. Client chooses and pays the appropriate Webflow Site plan on client's own billing method. Only user/client can accept paid service plan and payment details. DNS access must be least-privilege, time-limited and delegated.
5. Document DNS snapshot and safeguard email MX, SPF, DKIM, DMARC, TXT verification etc; add proper Webflow web DNS, verify domain ownership, SSL and www/root redirects. Publish only to explicit approved production domains.
6. Release QA: HTTP 200 and HTTPS for canonical URL, sitemap/robots, 301 redirects from old URLs if needed, broken links, form submission delivery, image licenses, no placeholder details, mobile and keyboard testing, analytics only as agreed.
7. Give client appropriate access: default Content editor role; permit publishing where agreed, or teach draft/approve flow. Test with independent client login: change a genuine CMS item, upload image, update page text, publish; verify production actually changes without layout damage. Document any editing limitation.
8. Handover pack: production URL, who owns domain, who pays hosting, roles/access, CMS how-to video, tech stack, source-code/asset licenses, forms recipient, backups/export limitations, guarantee/support SLA, renewal dates, exit/transfer instructions, invoice, acceptance date. Revoke one-time access after handover.
9. Support: delivery-defect warranty/mandatory legal rights remain; future text, design, feature or third-party service changes require a NEW quoted order. No maintenance subscription, hosting resale or 24/7 incident response in standard service.
10. Exit: client may move site to its Workspace or alternative platform according to contract and vendor capabilities; Webflow-specific design/CMS is not necessarily easily portable. Remove agency guest/client data securely after retention requirement.

## Don't promise
- That a published staging domain is private; Webflow staging can be public and should have indexing disabled; use approved protections for sensitive previews.
- That a Client payments invitation transfers project ownership. It only shifts billing. Transfer explicitly to transfer the site.
- That every client has free CMS hosting/editor access. Verify actual plans.
- That non-native pasted HTML automatically exposes editable CMS fields.
- That transfer means zero downtime without a rehearsed domain, form and email migration.

## Owner approvals and automation
Can automate: checklists, tests, CMS and page creation, draft instructions, prelaunch screenshots, deployment where authorized.
Owner/client: contract acceptance, collecting payments, purchasing paid plans, approving final design, inviting/billing legitimate client, DNS authorization.

## Webflow transfer restriction (verified 2026-10-14)
- A Starter Workspace cannot transfer a site WITH AN ACTIVE PAID SITE PLAN to a client Workspace. Transfer active paid sites requires Freelancer/Agency Workspace; see https://help.webflow.com/hc/en-us/articles/33961238786963-How-do-I-transfer-a-site-or-plan-to-another-workspace .
- For a Starter Workspace and a client-owner-first model: transfer the site while on the FREE Starter Site plan, then have the client purchase the appropriate paid Site plan on their own Workspace and configure their domain with delegated assistance. Explicitly verify CMS, images, styles, publishing state, and receiving Workspace before transfer.
- Client payments (client directly billed while site stays in agency Workspace) is available ONLY on Freelancer/Agency Workspace plans, not Starter; see https://help.webflow.com/hc/en-us/articles/35335039878035-Client-payments .
- A Content editor may modify content, assets and CMS entries but not site design or new CMS schema; see https://help.webflow.com/hc/en-us/articles/33961251014931-Edit-site-content-as-a-content-editor .
- Staging .webflow.io may be publicly accessible. For custom domains each site needs its own paid Site plan; CMS-powered production requires CMS-capable tier, currently Premium for new 2026 purchases: https://help.webflow.com/hc/en-us/articles/51059955082387-Updated-pricing-and-simplified-plans-for-May-2026 .

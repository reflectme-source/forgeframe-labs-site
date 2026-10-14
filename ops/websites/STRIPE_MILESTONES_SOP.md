# ForgeFrame Websites — Stripe milestone billing SOP v1
Date: 2026-10-14 | Status: INTERNAL DRAFT | Mode: one-off B2B client website | Never confuse sandbox with LIVE.

## Choice
Use Stripe Invoicing (Hosted Invoice Page) for individually quoted milestones, not generic universal payment links or a custom checkout backend. Client quote and service order identify unique `project_id`, approved scope, USD price and tax treatment. Use firm Stripe only (never personal/ExtensionOps Stripe). A project has two logically separate milestones:
- DEPOSIT: 50% before build (advance payment towards agreed total).
- FINAL: 50% only after written preview approval and before Webflow site transfer.
If discounts, changes, credits or refunds exist, recompute amounts and contract record; no blind 50/50 split. Any potential duplicate advance tax accounting / final invoice recognition is for company accounting/legal validation. Do not inadvertently charge two invoices each for full amount.

## Manual first customers: zero custom backend
1. Confirm company legal identity, B2B VAT status, customer billing email/address, accepted legally reviewed project agreement, scope, final quote, applicable tax rule and currency.
2. Create/reuse legitimate Stripe Customer in correct COMPANY account only. Verify legal name and tax identification with current accounting rules.
3. Create DRAFT Invoice #1, collection_method=send_invoice, auto_advance=false, project_id and milestone=deposit in metadata. Item description: `Website implementation — 50% advance for [project_id]`; quantity 1, amount in smallest currency unit (USD 495.00 = 49500 cents for Starter total USD 990.00 before applicable tax). Stripe Invoice tax status must be correctly configured **BEFORE** finalization/sending. Avoid auto_tax disabled when registration/transactions need automatic tax; sandbox QA drafts do not establish VAT compliance.
4. Validate payer, billing/tax details, numbering, description, amount/currency, jurisdiction and terms. On verified owner authorization, FINALIZE and send Stripe-hosted invoice URL. Do not send in test rehearsal.
5. Transition to DEPOSIT_PAID ONLY on Stripe invoice.paid event or verified authoritative Stripe account state (not success redirect, screenshot, email reply). Record invoice id + paid date in private CRM; never copy payment secrets to public repo.
6. After written client approval, create DRAFT Invoice #2 for final amount. Apply advance settlement accounting correctly — don't mistake separate commercial milestones for two unrelated sales. Confirm the exact tax documents with accountant.
7. Verify owner approval; finalize/send Invoice #2. Transfer the customer Webflow site only after FINAL invoice paid is authoritatively verified.
8. Refund/cancel/dispute needs owner decision and accounting reconciliation. Use a credit note/refund when legally required; never promise the advance is automatically non-refundable.
9. Webflow plan and domain renewals belong directly to customer and do NOT pass through ForgeFrame Stripe in standard orders.
10. Later automation: API-create invoices with idempotency key `ff-website:[project_id]:[milestone]:vN`, dedupe on project_id+milestone, verify Stripe webhook signatures, serialize stage transitions. Await per-project payment; don't send final without client preview acceptance.

## Sandbox proof (verified 2026-10-14; NO REAL CHARGE)
Company account: ForgeFrame Labs - ReflectMe.sp. z o.o. SANDBOX, livemode=false.
QA project: FF-WEB-QA-001, fictitious customer `TEST ONLY — ForgeFrame Websites QA` with reserved example.com email, intended only for drafts.
Two distinct invoices created in status **DRAFT** with auto_advance=false, collection_method=send_invoice. Each contains 1 item of 49,500 cents = USD 495.00; combined USD 990.00 (current public Starter anchor). Stripe GET verified `draft`, `livemode=false`, `amount_due=49500` for BOTH.
**Not tested:** finalized/hosted buyer payment, settlement, webhook verification, tax ID collection, refund/credit, accounting and live invoicing. No emails sent. Sandbox invoices had automatic_tax.enabled=false; this is NOT acceptable evidence of correctness for any real cross-border tax quote.

## Completion gate before any LIVE customer invoice
- Identify final legal seller entity and invoice branding.
- Tax and VAT/reverse-charge / customer status checked by accountant, including advances, gross/net treatment, invoicing & KSeF applicability.
- Reviewed terms (copyright/license/consumer laws).
- Verified customer/price, scope and signed acceptance.
- Owner review of individual draft invoice.
- No automatic payment capture; no paid Webflow purchase on seller account.

Sources:
https://docs.stripe.com/invoicing/dashboard
https://docs.stripe.com/invoicing/integration
https://docs.stripe.com/webhooks

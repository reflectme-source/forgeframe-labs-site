# ForgeFrame Websites — payment processing SOP: ON HOLD
Date: 2026-10-14 | Status: SUSPENDED / NOT APPROVED FOR LIVE PAYMENTS
**The old "50% deposit + 50% final" arrangement was explicitly withdrawn by the owner.** Do not invoice any client on those terms, finalize the existing test drafts, display a payment schedule on the website, or implement checkout until the payment decision is approved.
Canonical discussion: [PAYMENT_POLICY_DECISION_PENDING.md](PAYMENT_POLICY_DECISION_PENDING.md).

## What is approved now
- ForgeFrame Websites is a one-off website implementation service priced individually using current website package anchors; client owns and pays domain/Webflow directly.
- Payment timing (before build / after preview / partial milestones) is UNDECIDED.
- A real customer must approve clear written price, release conditions, cancellation policy and appropriate legally reviewed order before any work or funds.
- Firm Stripe only; no personal or ExtensionOps Stripe account. Never treat Stripe receipt/payment link as sufficient Polish tax invoice by default.
- No real Stripe LIVE invoice or payment link for this service before approval of tax, foreign B2B/B2C status, KSeF and effective accounting/documentation method.

## Options still being evaluated
A) One payment after preview acceptance, before project control transfer. Advantage: may avoid a separate advance invoice; downside: agency bears risk of full development cost until acceptance. Requires accountant to identify the correct taxable supply/invoice issuance event and contract drafting.
B) Partial advance plus settlement. Advantage: less nonpayment/cancellation risk; downside: additional VAT/documentation event and possible refund/settlement.
C) Full prepayment. Advantage: protects cash flow; downside: reduces conversions and requires correct prepayment VAT/invoicing handling.
D) Accepted-stage invoicing. Advantage: aligns payment and progress; downside: added billing stages and disputes.
**None has been selected**. No tool should be called to issue any live invoice based on this draft.

## Stripe implementation requirements after approval
- Verify company legal issuer, VAT ID and payment account, tax/VAT treatment by jurisdiction, currency and foreign buyer classification with the accountant.
- Choose invoicing system that meets actual 2026 KSeF requirement (seller company-wide monthly invoice turnover threshold). Stripe invoice is a hosted payment/document object, not automatic KSeF submission.
- Define which platform issues the ORIGINAL legal invoice and how Stripe payment links/reconciliation refer to it. Avoid duplicate sales invoices and double-counting.
- Create payment link/invoice only with unique order ID and approved pricing; record Stripe ID, payment event, accounting invoice number/KSeF ID and when required.
- Verify actual paid event through Stripe API/webhook signature and idempotent event handling; never rely on screenshot or checkout return redirect.
- Refund/credit note and bank/Stripe adjustments follow approved accounting procedures, contractual cancellation policy and applicable law.
- Never promise automatic refunds or nonrefundable "deposits" without legally reviewed contract.

## Prior SANDBOX exercise (not a precedent)
2026-10-14, ForgeFrame Labs firm Stripe SANDBOX, livemode=false:
Project FF-WEB-QA-001 (fictional customer): two separate DRAFT invoices, each USD 495, total USD 990, collection method send_invoice, auto_advance=false. **Neither was finalized, sent, paid or used to collect money.** Tax configuration was not validated and automatic_tax.enabled=false; cannot be used for real cross-border billing. These were samples for a once-considered milestone model, NOT a payment policy or accounting signoff.
Keep them as non-live test evidence; do not reuse them in an actual customer order.

## Approval checklist
[ ] Accountant verifies 2026 KSeF and all ForgeFrame invoice turnover, including different product revenues
[ ] Accountant confirms cross-border B2B/B2C invoicing and timing of VAT and invoice
[ ] Owner chooses payment model and accepts the commercial risk of that model
[ ] Approved terms and website copy align; tax invoice source-of-truth integrated
[ ] Sandbox full-cycle validated, including refund/cancellation path, no live charge
[ ] Only then authorize live customer billing on a specific verified order

References:
https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef/
https://www.podatki.gov.pl/podatki-firmowe/vat/poradniki-i-informatory/kiedy-powstaje-obowiazek-podatkowy/
https://docs.stripe.com/invoicing/dashboard

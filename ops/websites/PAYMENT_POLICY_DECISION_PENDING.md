# ForgeFrame Websites — PAYMENT POLICY HOLD / do not bill clients yet
Date: 2026-10-14
**Owner instruction: 50/50 advance and final payment are NOT approved. Do NOT publish the timing, quote deposits, prepare live invoices, collect payment or promise refund conditions until this decision is made.** This supersedes older 50/50 examples in any prior chat or operational artifact.
Prices for service packages remain $990 / $1,990 / Custom from $3,490, subject to quote. Customer still pays their Webflow hosting/domain independently.

## What is being decided
Timing and instrument of client payment are independent from the legal duty to issue appropriate invoices and account for VAT/tax. A Stripe Checkout success screen or Stripe receipt is not automatically a legally compliant Polish structured invoice (KSeF).
Any advance before service completion will generally trigger VAT taxation on the amount when received (subject to cross-border/specific statutory exceptions). Payment after completion does not eliminate the obligation to issue a proper invoice. The invoice date, taxable supply date and due date may differ.
The contract and invoicing setup must distinguish Polish B2B, intra-EU B2B, non-EU B2B and B2C; verify customer VAT status, place of supply, Polish KSeF requirements, USD exchange rates, tax treatment and whether exemption applies to the seller.
2026 KSeF rollout: from 1 April 2026 most other Polish businesses are subject to issuing through KSeF, but small sellers whose monthly total factured gross sales do not exceed PLN 10,000 may defer to 1 January 2027. The threshold is monthly seller turnover DOCUMENTED BY INVOICES, not "per project" or "per product"; if exceeded, mandate starts with invoice that exceeds it. Verify against company-wide invoiced sales, not just websites. Sources: https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef/ and https://www.podatki.gov.pl/aktualnosci/co-warto-wiedziec-przed-startem-ii-etapu-wdrozenia-krajowego-systemu-e-faktur .
The Polish tax ministry states that receipt of whole/part advance generally triggers VAT obligation for received amount: https://www.podatki.gov.pl/podatki-firmowe/vat/poradniki-i-informatory/kiedy-powstaje-obowiazek-podatkowy/ .
Foreign customer invoices may still have to be issued in Polish KSeF and supplied to foreign customers separately per KSeF rules: https://ksef.podatki.gov.pl/pytania-i-odpowiedzi-ksef-20/?query=token .

## Candidates — discussion only, none approved
| Model | Business advantage | Main risk | Billing impact |
| --- | --- | --- | --- |
| A. 100% after customer approves working staging preview, BEFORE Webflow site transfer / production release | one commercially due payment; avoids separate advance-VAT event; easy customer experience | agency carries full delivery cost and nonpayment/cancellation risk; client may walk away after seeing design | invoice and VAT still required when legally due; determine tax event as agreed service completion/acceptance date |
| B. 30% or 50% advance + rest on approval before transfer | protects cash flow and secures customer commitment | more sales friction, refunds/cancellation negotiation | separate advance/VAT document handling typically required, plus final settlement |
| C. 100% in advance | eliminates nonpayment of an accepted order | harder selling unknown agency, refund/cancellation risk | full advance-VAT/invoicing obligations |
| D. Milestone-based on completed/accepted deliverable | payment correlates with accepted stage | more operations, disputes around what constitutes completed stage | each service event may require corresponding invoice/tax reporting |
No public agreement may claim model A–D as mandatory until accounting and founder approve it.

## Initial hypothesis — NOT policy
For small fixed-scope B2B sites, consider signed fixed-scope service order, **work at agency risk**, staging preview and written acceptance, one full payment before transferring the Webflow site. Pros: potentially one customer billing event and simpler UX than 50/50. But client can fail to pay after production and delivery/tax recognition requires accounting determination. Evaluate against cost of rejected builds and sale conversion; not safe to start real projects without such risk acceptance.

## Required decisions / approvals
1. Accountant verifies ForgeFrame company-wide monthly invoiced revenue vs KSeF PLN 10,000 gross 2026 transition, active accounting software and how to transmit KSeF invoices (including foreign customers), who is authorized to issue them, and VAT/tax/exchange conversion.
2. Accountant compares: single final service invoice (when due) vs advance invoice + final settlement; invoice issue trigger and timing; effect of foreign sales and possible reverse charge.
3. Owner chooses payment timing policy by package and country, refund/cancellation rules, when work starts, release gates and exact contract wording.
4. Only then adjust public pages/terms to approved method; company Stripe live invoice/payment link created only for identifiable accepted order with verified sales tax/invoice workflow. Test in Sandbox first. No charging actual customer or changing current Stripe automation while HOLD.

## Existing assets status
- Public service pages have prices only; PR #90 drafts now also contain NO advance/50-50 terms. Keep it that way.
- PR #86 draft templates were updated to hold the payment decision and should not be sent in legal form before review.
- Earlier Stripe SANDBOX draft 2x $495 documents for fictional FF-WEB-QA-001 are testing artifacts; they do NOT represent an approved payment policy, and must not be sent or finalized. Production Stripe is untouched.

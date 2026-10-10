# FORGEFRAME LABS — HANDOFF DLA CZATU PRODUKTOWEGO (2026-10-10)

## Cel
Rozwijaj swój konkretny biznes samodzielnie do produkcyjnej gotowości, na wspólnej domenie ForgeFrame Labs. Nie przebudowuj głównej strony, globalnej nawigacji, stopki ani globalnego systemu kolorów.

## Repozytorium i adresy
- Marketing: https://forgeframelabs.app
- GitHub: reflectme-source/forgeframe-labs-site (main)
- Portfolio: /products/
- Twoja oferta: /products/<slug>/ (istniejących .html nie usuwaj ani nie przekierowuj bez zatwierdzonej migracji)
- Każdy produkt ma własną stronę: opis, realne funkcje, proces użycia, status, cena/model rozliczenia, FAQ, demo tylko jeśli faktycznie działa, warunki i kontakt
- Oddzielny backend/app jeśli SaaS wymaga konta; żadnych kluczy prywatnych na GitHub Pages

## Globalny wygląd, obowiązkowy
- Wczytaj /assets/forgeframe-global.css oraz istniejący zestaw stylów odpowiedni do strony; nie kopiuj całego globalnego header/footer na własną wersję.
- Wzorzec: aktualna główna strona ForgeFrame Labs. Jedno logo/avatar, nav, aktywny język PL/EN, jednolita stopka, dark navy, czytelne kolorowe ikony, status i CTA.
- Strony produktu z własną treścią, ale tą samą marką; mobile keyboard accessibility, SEO canonical, PL/EN jeśli oferta dwujęzyczna.
- Zmieniaj tylko swoje pliki na osobnej gałęzi. Każdy PR musi przejść CI; bez force push na main.

## Płatności (Stripe i PayPal)
- Stripe LIVE ForgeFrame Labs: istnieje konto, centralny protokół w docs/STRIPE-INTEGRATION-CONTRACT.md. Nie zakładaj osobnego konta Stripe.
- PayPal: wspólna integracja jest planowana, ale NIE jest jeszcze potwierdzona jako sprawdzony LIVE checkout; nie umieszczaj przycisku 'Kup', dopóki nie ma rzeczywistego checkoutu i procesu doręczenia zamówienia.
- Produkt operator określa cenę, walutę, payment vs subscription, podatki/warunki, model realizacji, refundy, dostęp do produktu i odpowiedzialny backend; operator centralny weryfikuje billing/wspólne konto.
- Żadnych client-side secretów. Weryfikacja płatności musi być serwerowa; webhook signature, idempotencja, log zamówień i rekoncyliacja. Sam success URL nie oznacza zapłaty.

## Release gate
1. Aktualny main i nienaruszone pliki innych operatorów.
2. Sprawdź funkcjonalność i prawdziwość claimów oraz ceny; bez fikcyjnych danych.
3. Testy, UX mobile, dostępność, linki, formularze, bezpieczeństwo i legal.
4. PR + CI PASS + produkcyjny smoke po merge.
5. Dopiero zweryfikowany checkout, fulfillment i uprawnienia = 'ready to sell'.

Pracuj dalej autonomicznie nad swoim produktem, przerywaj wyłącznie na rzeczywiste OWNER-GATE (finanse, KYC, nowe umowy, 2FA, dostęp).

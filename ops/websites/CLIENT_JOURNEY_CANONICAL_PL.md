# FORGEFRAME WEBSITES — KANONICZNY PROCES KLIENTA (B2B)
Data: 2026-10-14 | Wersja: v1.1 DRAFT — nie uruchamia płatności ani automatycznej wysyłki.
**HOLD PAYMENT POLICY:** model płatności PRZED/PO/częściami niezatwierdzony. Zakaz podawania zaliczki 50/50 klientom. Zanim ofertę wyślemy, księgowość musi zatwierdzić fakturowanie B2B/B2C, zagraniczny VAT, KSeF i terminy dokumentów. Szczegóły w PAYMENT_POLICY_DECISION_PENDING.md.
Model: **jednorazowe wykonanie, publikacja i pełne przekazanie Webflow klientowi; bez obowiązkowego utrzymania.**
Wdrożenie tej procedury wymaga testu transferu, CMS na koncie odbiorcy, DNS i odbioru prawno-księgowego.

## Co dokładnie sprzedajemy
- Wykonanie strony według zatwierdzonego zakresu, nie subskrypcja hostingu.
- Klient opłaca domenę i Webflow Site plan bezpośrednio, na własnej karcie i Workspace. Roczne/miesięczne opłaty ujawniamy przed zamówieniem.
- Domyślnie: proste strony firmowe, 1–5 podstron; bez e-commerce, własnych kont, indywidualnych systemów rezerwacji, integracji nieobjętych wyceną i gwarancji wyniku SEO.
- Treści na stronie (teksty, linki, zdjęcia i CMS) mają być możliwe do edycji przez klienta po transferze. Czysty import HTML nie gwarantuje takiej edytowalności.
- Odpowiedzialność za wady dostawy i prawa bezwzględnie obowiązujące nadal pozostają; nie mylić z płatną opieką i nowymi zmianami.

## Jeden proces — 12 przejść
0. Przygotowanie: polityka cenowa i umowa wymagają akceptacji; przed obsługą realnej płatności wybieramy model rozliczenia, sposób fakturowania zgodny z KSeF/VAT i konfigurację księgową. Stripe jest wyłącznie kanałem płatności, a nie automatycznie polską fakturą. Numer FF-YYYY-NNN identyfikuje każde zamówienie.
1. ZAPYTANIE: potencjalny klient odpowiada na e-mail lub formularz. AI rozpoznaje typ firmy i prawdopodobny zakres. Żadne zobowiązanie ani automatyczna masowa wysyłka.
2. MINI-BRIEF: wysyłamy 8 pytań z CLIENT_BRIEF_SHORT_EN.md. Można wkleić bezpośrednio w e-mail, nie trzeba od razu budować własnego portalu. Jeśli odpowiedzi niekompletne — dopytujemy tylko o blokery wyceny.
3. OFERTA: AI przygotowuje indywidualny opis zakresu (strony/funkcje/wersje językowe/materiały), termin zależny od dostarczenia treści, dwie rundy poprawek, cenę realizacji, spodziewane koszty Webflow Site plan/domeny płatne osobno przez klienta, warunki licencji/przeniesienia praw oraz sposób odbioru. Właściciel zatwierdza kwotę i zobowiązania.
4. AKCEPTACJA ZLECENIA: klient potwierdza SERVICE_ORDER_B2B_EN_DRAFT.md jako zaakceptowany dokument w uzgodnionej formie. Przed rozpoczęciem pracy warunki muszą być zaakceptowane. Jeśli umowa przewiduje przeniesienie autorskich praw majątkowych pod prawem polskim, konieczna jest osobna pisemna lub kwalifikowanie podpisana dokumentacja (art. 53) z polami eksploatacji; zwykłe potwierdzenie e-mailem nie wystarczy dla tej czynności. Domyślną opcją do weryfikacji prawnej jest niewyłączna licencja eksploatacyjna udzielana w terminie określonym w końcowej umowie (nadal niezatwierdzonym), z wyraźnym prawem do modyfikacji i zlecania obsługi innym.
5. POLITYKA PŁATNOŚCI [DECISION HOLD]: nie ustalamy przedpłaty ani płatności po realizacji. Wycena może powstać, ale żadna wiążąca oferta z harmonogramem płatności, żądanie zapłaty ani obciążenie Stripe LIVE nie następuje do czasu pisemnego zatwierdzenia zasad. Po zatwierdzeniu każdą płatność identyfikujemy project_id i weryfikujemy w źródle Stripe; faktury wystawiamy zgodnie z obowiązującymi przepisami, niezależnie od automatycznego e-maila Stripe.
6. PRODUKCJA: AI tworzy projekt w agencyjnym Workspace (bez aktywowania płatnego Site plan przed transferem, jeśli Workspace Starter), wypełnia go informacjami zatwierdzonymi przez klienta, konfiguruje edytowalne teksty/zdjęcia, CMS gdy potrzebny, buduje staging. Wewnętrzna kontrola designu i jakości obowiązkowa. Projekt nie zawiera niezweryfikowanych referencji, ocen, cen ani cudzych zdjęć bez licencji.
7. PODGLĄD: wysyłamy klientowi link staging (nie uznajemy publicznego .webflow.io za prywatny), klient zgłasza uwagi w jednej wiadomości. Dwie rundy poprawek dotyczą ustalonego zakresu. Nowe funkcjonalności — nowa wycena i akceptacja.
8. ODBIÓR: klient zatwierdza finalną wersję do wdrożenia na piśmie (np. e-mail) po obejrzeniu staging. AI zbiera końcowe wyniki testów. Nie transferujemy niezaakceptowanego projektu.
9. CHECKPOINT HANDLOWO-KSIĘGOWY [WARUNKI TBD]: po akceptacji staging sprawdzamy, czy wszystkie warunki przekazania uzgodnione w ostatecznej umowie zostały spełnione, w tym właściwa faktura i zapłata w terminie ustalonym dopiero po zatwierdzeniu polityki. Nie zakładamy teraz wysokości rat ani momentu ich pobrania. Stripe/księgowość musi potwierdzić rozliczenie według wybranego modelu.
10. KONTO ODBIORCY I TRANSFER: klient zakłada darmowe konto/Workspace Webflow. Wysyłamy transfer do adresu powiązanego z jego kontem z Site settings. Klient akceptuje transfer, a my potwierdzamy, że site ID jest już własnością jego Workspace. W Webflow Starter paid Site plan nie może być aktywowany przed przekazaniem; kupuje go odbiorca PO transferze. Po potwierdzeniu transferu agencyjny Workspace traci kontrolę nad projektem.
11. HOSTING, DOMENA, FINAL QA: klient wybiera i opłaca własny odpowiedni Webflow Site plan (Basic dla prostej witryny bez CMS; Premium dla CMS; ceny/limity do zweryfikowania każdorazowo). Jeśli nie ma domeny, kupuje ją na własne dane. Pomagamy bezpiecznie podłączyć domenę i skonfigurować SSL. Jeśli ma pocztę na domenie, nie zmieniamy istniejących MX/SPF/DKIM/DMARC. Ponownie konfigurujemy powiadomienia formularzy i odświeżamy autoryzacje zewnętrznych aplikacji, które mogą się resetować w transferze. Działania wymagające uprawnień wykonuje właściciel lub uprawniony gość. Klient publikuje po autoryzacji; ForgeFrame sprawdza HTTPS, 200, www/root, linki, formularz do właściwej skrzynki, 301 przy migracji, sitemap/SEO i smartfon. Jeśli klient nie umożliwi dostępu po transferze, instruujemy go co zrobić i dokumentujemy, co mogliśmy zweryfikować.
12. HANDOVER/CLOSE: klient na własnym koncie edytuje pokazowy tekst i wpis CMS/zdjęcie oraz publikuje, dostaje instrukcję wideo, informacje o planie/domain renewals, dane odbioru, zakres ewentualnej odpowiedzialności za wady. Odbiera zlecenie. Dostęp agencji jest usuwany. BRAK utrzymania, monitoringu i stałych płatności do ForgeFrame. Dalsze prace to osobne zamówienie.

## System kontroli: nikt nie musi pamiętać wszystkich rozmów
Każdy projekt ma tylko obowiązkowe pola:
project_id | legal_client | contact_email | contract/offer_version | scope | price/currency/tax_check | PAYMENT_POLICY_STATUS | stage | action_owner | next_action | blocking_reason | due_date | invoice/payment_event_references (if applicable) | staging_url | design_acceptance_evidence | agreed_release_conditions_met | recipient_workspace | transfer_accepted | hosting_plan_owner | domain | dns_approved | live_url | QA_link | handover_acceptance | warranty_terms.
Statusy: NEW_LEAD -> BRIEF -> OFFER_DRAFT -> PAYMENT_POLICY_APPROVED -> CONTRACT -> WORK_AUTHORIZED -> BUILD -> QA -> CLIENT_REVIEW -> APPROVED -> RELEASE_CONDITIONS_MET -> TRANSFER_ACCEPTED -> CLIENT_HOSTING -> LAUNCH_QA -> HANDOVER -> CLOSED. Możliwe WAITING_CLIENT / BLOCKED / PAYMENT_POLICY_PENDING / CANCELLED.
Czat/agent może prowadzić proces, ale dopóki nie ma przetestowanego event-driven engine, nie twierdzimy, że całość działa autonomicznie 24/7.

## Ważne wyjątki
- FREE Webflow Starter Workspace: max 2 staging sites i 2 statyczne podstrony na site. Standardowy projekt 5 stron wymaga zmiany planu Workspace lub dostosowania procesu przed podpisaniem wiążącej oferty. Nie kupuj nic bez zgody.
- Webflow z CMS wymaga CMS-capable plan (Premium) po stronie klienta do publikacji na custom domain; Basic dla braku CMS.
- Wpłata nie oznacza przeniesienia praw autorskich; techniczny transfer Webflow to odrębna operacja prawna. Warunki licencji/cesji uregulować przed sprzedażą.
- Umowy konsumenckie B2C i niektóre JDG mogą mieć szczególne uprawnienia, zwłaszcza odstąpienie przy sprzedaży zdalnej: NIE stosować tego draftu automatycznie do B2C.
- Płatna subskrypcja Webflow należy do klienta; klient zna koszt przed podpisaniem oferty.
- Transfer w Webflow resetuje niektóre ustawienia, w tym notification e-mail formularzy i autoryzacje aplikacji.
- Do czasu oddania finalnej wersji klientowi klient może zrezygnować lub spóźniać się z materiałami; przestoje, odpłatna praca dodatkowa, zwroty i limity opisać w zamówieniu.
- Klient powinien być świadomy ograniczeń eksportu Webflow CMS i forms do innej platformy.

Źródła: 
- https://help.webflow.com/hc/en-us/articles/33961238786963-How-do-I-transfer-a-site-or-plan-to-another-workspace
- https://help.webflow.com/hc/en-us/articles/33961232582419-Choose-a-Site-plan
- https://help.webflow.com/hc/en-us/articles/33961251014931-Edit-site-content-as-a-content-editor
- https://help.webflow.com/hc/en-us/articles/33961218263059-Choose-a-Workspace-plan
- https://www.parp.gov.pl/component/content/article/83261:umowa-o-przeniesienie-autorskich-praw-majatkowych

## Decyzje wdrożeniowe
Wejdziemy na rynek jako B2B, jednorazowe strony firmowe, HARMONOGRAM PŁATNOŚCI JESZCZE NIEUSTALONY, płatny hosting na koncie klienta, dwuetapowa akceptacja: design i handover. **Obowiązujące publiczne punkty cenowe ze strony /websites: Starter 990 USD, Business 1 990 USD, Custom od 3 490 USD.** Cena potwierdzona po briefie; nie stosować historycznych szkicowych €590/€990. Publiczna strona ma już formularz /contact/?product=websites — bez dublowania formularza i rozbieżnych ofert. Każdą cenę i kontrakt zatwierdza owner. Klienci nie mają nas jako dostawcy hostingu. Obecny demo FORMA służy wyłącznie do testu technicznego; design odrzucony na commercial quality gate.

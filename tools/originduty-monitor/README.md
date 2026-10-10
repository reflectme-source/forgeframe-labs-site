# OriginDuty public source monitor

Minimal non-commercial official journal (OJ-L) candidate feed used by the public OriginDuty preview. This is **not** full TARIC coverage. No subscriber data, credentials or payment integrations are used here.

Run `npm ci --ignore-scripts`, then `npm run refresh`. The scraper atomically updates `products/originduty/regulations.json` only if the full upstream scrape succeeds. GitHub Actions scheduled refresh will keep the last successful result and expose staleness on outage. The origin of this module is the private OriginDuty source tree; synchronize and test changes carefully.

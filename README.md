# ForgeFrame Labs

Independent developer tools, data automation and scoped API integrations.

[Browse ForgeFrame Labs products and platforms](https://reflectme-source.github.io/forgeframe-labs-site/)

## Available products and services

- **OTOMOTO Change Intelligence** — [product overview](https://reflectme-source.github.io/forgeframe-labs-site/solutions/otomoto-vehicle-monitoring.html), [Polish how-to guide with BMW/Audi/Škoda examples](https://reflectme-source.github.io/forgeframe-labs-site/guides/otomoto-price-monitoring.html), and [public Apify Actor](https://apify.com/green_amazement/otomoto-change-intelligence). Compare observed public search results; charges apply on Apify. This is not OTOMOTO's official API. Confirm source-data rights before commercial redistribution.
- **Contract Guard** — [product and managed setup](https://reflectme-source.github.io/forgeframe-labs-site/products/contract-guard.html), [GitHub Actions OpenAPI guide](https://reflectme-source.github.io/forgeframe-labs-site/guides/openapi-breaking-changes-github-actions.html), and [free self-hosted Action source](https://github.com/reflectme-source/forgeframe-contract-guard). Spec-level breaking-change detection and release evidence; an optional one-time implementation service costs $149 for a scoped setup, with payment and terms agreed in writing.
- **Localization QA Inspector** — [free browser tool](https://reflectme-source.github.io/forgeframe-labs-site/tools/localization-qa.html). Private, local-first CSV structural checks, with offline validation instructions below.
- **Localization Upload Guard for Roblox Studio** — [verified paid itch.io release](https://reflectmeproject.itch.io/localization-upload-guard-for-roblox-studio), [features and installation](https://reflectme-source.github.io/forgeframe-labs-site/products/roblox-localization-upload-guard.html). One-time $5.99, local CSV structural preflight, Windows 11 Studio tested; no Roblox affiliation claimed.
- **API integration services** — individually scoped work connecting documented events to an existing system. Contact **forgeframe.lab@gmail.com** with the intended source, rights/permissions and receiving API; any implementation is quoted after technical review.

## Products in validation

Unity Editor Localization QA and JetBrains MV3 Release Inspector are not currently available to purchase. The Roblox Studio Localization Upload Guard is available for purchase via itch.io. Additional marketplaces are being evaluated, but account presence alone is not a product release.

## Localization QA Inspector

**Find broken translations before they reach your build.**

[Open the free Localization QA Inspector](https://reflectme-source.github.io/forgeframe-labs-site/tools/localization-qa.html)

Localization QA Inspector analyzes Unity-friendly CSV localization files, highlights structural problems and suggests what to fix. The browser tool works entirely on your device. No account, external API or upload of your file to a server is required.

### What it checks

- Missing source text and translations
- Missing or duplicate localization keys
- Placeholder mismatches, including named variables and printf tokens
- Markup tag differences
- CSV rows with incorrect column counts
- Complex ICU messages that require separate review

Results are organized by priority. Search for a key, filter by language or issue type, and export findings as CSV or JSON.

### Try it in your browser

1. [Open Localization QA Inspector](https://reflectme-source.github.io/forgeframe-labs-site/tools/localization-qa.html).
2. Drop in your CSV, or choose **Try example** to see a sample report immediately.
3. Confirm the source-language column, normally en.
4. Select **Analyze CSV** and review the results.
5. Export a report for your development or localization team.

The browser accepts UTF-8 CSV files up to 2 MB.

### CSV file format

The first column is named key. The other columns identify languages, for example:

    key,en,pl,de
    welcome,"Welcome {name}","Witaj {name}","Willkommen {name}"
    score,"Score: %d","Wynik: %d","Punkte: %d"
    start,Start,Start,Starten

Quoted commas, escaped quotes and quoted line breaks are supported.

### Optional command-line checks

The repository also contains a dependency-free Node.js command-line validator for local builds or CI jobs. Node.js 20 or later is recommended.

From the repository root, run:

    node tools/localization-cli.mjs --file Assets/Localization/strings.csv --source en --fail-on error

Exit codes:

| Code | Meaning |
| --- | --- |
| 0 | All required checks passed |
| 2 | Blocking localization issues were detected |
| 64 | The input or command options were invalid |

Add the --format json option for structured results. Use --fail-on any to treat advisory checks as blocking, or --fail-on never to generate a report without failing your build.

An optional [GitHub Actions configuration example](examples/localization-ci.example.yml) is included. Review your hosting platform's billing settings before enabling an automated workflow.

### More documentation

- [CSV format, checks and CLI guide](https://reflectme-source.github.io/forgeframe-labs-site/tools/localization-qa-guide.html)
- [Product overview](https://reflectme-source.github.io/forgeframe-labs-site/products/localization-qa.html)
- [ForgeFrame Labs website](https://reflectme-source.github.io/forgeframe-labs-site/)
- [Support](https://reflectme-source.github.io/forgeframe-labs-site/support.html)

### Unity Editor integration

A native Unity Editor package is not yet available for purchase on the Asset Store. The browser inspector and command-line utility can be used today.

### Privacy and limitations

CSV analysis happens locally. The browser inspector does not require login, telemetry, analytics or network uploads of your localization text. It does not rewrite the original file.

Structural checks cannot guarantee linguistic accuracy, correct pluralization, layout in a running game or compatibility with a particular localization framework. Advanced ICU syntax needs a dedicated parser.

## Support

For usage questions, bug reports or feature requests, contact **forgeframe.lab@gmail.com**. Include the input format and steps to reproduce; do not send passwords, secret keys or confidential project files.

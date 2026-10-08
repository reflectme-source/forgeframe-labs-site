# ForgeFrame Labs

Focused game development utilities from the ForgeFrame Labs Unity publisher brand.

## Localization QA Inspector — free browser demo

[**Run Localization QA Inspector**](https://reflectme-source.github.io/forgeframe-labs-site/tools/localization-qa.html)

Check localization CSV files for missing translations, duplicate keys, incorrect placeholder counts and structural errors. Choose a file and see an actionable report. The CSV is processed **inside your browser**, not sent to a server.

- [Documentation and CSV format](https://reflectme-source.github.io/forgeframe-labs-site/tools/localization-qa-guide.html)
- [Publisher website](https://reflectme-source.github.io/forgeframe-labs-site/)
- [Support](https://reflectme-source.github.io/forgeframe-labs-site/support.html)

### Command-line CI gate

The same checks can run in a build pipeline using Node.js 20+ without third-party packages:

```bash
node tools/localization-cli.mjs --file Assets/Localization/strings.csv --source en --fail-on error
```

Exit **0** means pass, **2** means a blocking localization issue, and **64** means configuration or CSV parsing failed. [GitHub Actions example](examples/localization-ci.example.yml) (not enabled automatically; inspect Actions billing before copying it to a private repository).

### Unity Asset Store version

A native Unity Editor implementation is being developed and has been registered as a private **Draft**, but is **not** publicly released or offered for sale. Unity compilation/import testing, packaging and review are still required.

### Scope

This demo checks CSV structure, not linguistic quality. It flags complex ICU messages for specialized review and does not change source files.

### Contact

Questions, bug reports or requests for Unity-specific workflow improvements: **forgeframe.lab@gmail.com**.

The public repository contains the standalone website and browser demo; it does not contain Unity Asset Store seller credentials, payouts or private Unity package source.

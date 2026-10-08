import {inspectLocalizationCsv} from "./localization-core.mjs";
import {issuePresentation, exportIssuesCsv} from "./report-export.mjs";

const $ = id => document.getElementById(id);
const input = $("csv"), drop = $("drop"), analyze = $("analyze");
const notification = $("message"), summary = $("summary"), tbody = $("findings");
const MAX_BYTES = 2 * 1024 * 1024;
let currentText = null, filename = "", lastReport = null, selectedSeverity = "all";

function message(text, error = false) {
  notification.textContent = text;
  notification.classList.toggle("hidden", !text);
  notification.classList.toggle("danger", error);
}
function announce(text) { $("resultAnnouncement").textContent = text; }
function resetResults() {
  lastReport = null;
  $("results").classList.add("hidden");
  $("empty").classList.add("hidden");
  $("emptyMatches").classList.add("hidden");
}
function setFile(text, name) {
  currentText = text; filename = name;
  $("fileLabel").textContent = name;
  $("fileHint").textContent = "Ready to analyze";
  analyze.disabled = false;
  message(""); resetResults();
  announce("File selected: " + name);
}
function invalidFile(text) {
  currentText = null; filename = ""; analyze.disabled = true;
  $("fileLabel").textContent = "Choose a CSV file or drop it here";
  $("fileHint").textContent = "Your file stays on this device";
  resetResults(); message(text, true); announce(text);
}
async function loadFile(file) {
  if (!file) return;
  if (file.size > MAX_BYTES) {
    invalidFile("This file exceeds the 2 MB limit. Please choose a smaller CSV.");
    return;
  }
  if (!file.name.toLowerCase().endsWith(".csv")) {
    invalidFile("Please choose a .csv file.");
    return;
  }
  try { setFile(await file.text(), file.name); }
  catch { invalidFile("We couldn't read that file. Check that it's UTF-8 CSV."); }
}

input.addEventListener("change", () => loadFile(input.files?.[0]));
drop.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault(); input.click();
  }
});
for (const name of ["dragenter", "dragover"])
  drop.addEventListener(name, event => {
    event.preventDefault(); drop.classList.add("drag");
  });
for (const name of ["dragleave", "drop"])
  drop.addEventListener(name, event => {
    event.preventDefault(); drop.classList.remove("drag");
  });
drop.addEventListener("drop", event => loadFile(event.dataTransfer?.files?.[0]));
$("sourceLocale").addEventListener("input", () => {
  if (lastReport) {
    resetResults(); message("Source language changed. Run the analysis again.");
  }
});

function stat(label, value) {
  const el = document.createElement("div"); el.className = "stat";
  const strong = document.createElement("strong");
  strong.textContent = String(value);
  const caption = document.createElement("span");
  caption.textContent = label;
  el.append(strong, caption); return el;
}
function newCell(row, className = "") {
  const td = document.createElement("td");
  if (className) td.className = className;
  row.append(td); return td;
}
function rowForFinding(item) {
  const issue = issuePresentation(item);
  const tr = document.createElement("tr");
  tr.dataset.priority = issue.severity;
  const severityCell = newCell(tr);
  const badge = document.createElement("span");
  badge.className = "sev sev-" + issue.severity;
  badge.textContent = issue.severity === "blocking" ? "Blocking" : "Review";
  severityCell.append(badge);
  const location = newCell(tr, "location");
  location.textContent = "Row " + item.row;
  if (item.locale && item.locale !== "key") {
    const lang = document.createElement("span");
    lang.className = "issue-detail"; lang.textContent = item.locale;
    location.append(lang);
  }
  const key = newCell(tr, "key-name");
  key.textContent = item.key || "—";
  const detail = newCell(tr);
  const title = document.createElement("strong");
  title.className = "issue-title"; title.textContent = issue.title;
  const description = document.createElement("span");
  description.className = "issue-detail";
  description.textContent = item.details || "Review the source and translation.";
  const fix = document.createElement("span");
  fix.className = "issue-fix"; fix.textContent = "Fix: " + issue.fix;
  detail.append(title, description, fix);
  return tr;
}
function replaceSelect(select, options, defaultTitle) {
  select.replaceChildren(new Option(defaultTitle, "all"));
  for (const item of options) select.add(new Option(item.label, item.value));
  select.value = "all";
}
function resetFilters() {
  selectedSeverity = "all";
  $("searchIssues").value = "";
  $("localeFilter").value = "all";
  $("typeFilter").value = "all";
  for (const chip of document.querySelectorAll("[data-severity]"))
    chip.setAttribute("aria-pressed", String(chip.dataset.severity === "all"));
  if (lastReport) renderIssueRows();
}
function renderIssueRows() {
  if (!lastReport) return;
  const query = $("searchIssues").value.trim().toLowerCase();
  const locale = $("localeFilter").value, type = $("typeFilter").value;
  const results = lastReport.findings
    .map((item, index) => ({item, index, meta: issuePresentation(item)}))
    .filter(x => selectedSeverity === "all" || x.meta.severity === selectedSeverity)
    .filter(x => locale === "all" || x.item.locale === locale)
    .filter(x => type === "all" || x.item.code === type)
    .filter(x => !query || [
      x.item.row, x.item.key, x.item.locale,
      x.item.details, x.meta.title, x.meta.fix
    ].some(value => String(value ?? "").toLowerCase().includes(query)))
    .sort((a, b) =>
      a.meta.severity === b.meta.severity ? a.index - b.index :
      a.meta.severity === "blocking" ? -1 : 1
    );
  const fragment = document.createDocumentFragment();
  for (const {item} of results.slice(0, 1500)) fragment.append(rowForFinding(item));
  tbody.replaceChildren(fragment);
  $("visibleCount").textContent = "(" + results.length + ")";
  $("emptyMatches").classList.toggle("hidden", !lastReport.findings.length || !!results.length);
  $("empty").classList.toggle("hidden", !!lastReport.findings.length);
  $("resultsFoot").textContent = results.length > 1500 ?
    "Showing the first 1,500 matching issues. Exports include all findings." :
    "Files are processed locally in this browser. The export includes every finding.";
}
function draw(report) {
  lastReport = report;
  const severe = report.findings.filter(item =>
    issuePresentation(item).severity === "blocking").length;
  const advisory = report.findings.length - severe;
  summary.replaceChildren(
    stat("CSV rows", report.summary.totalRows),
    stat("Language columns", report.locales.length + 1),
    stat("Blocking issues", severe),
    stat("Needs review", advisory)
  );
  $("reportFile").textContent = filename + " · " + report.summary.uniqueKeys + " unique keys";
  $("outcome").className = "outcome " + (severe ? "bad" : "good");
  $("outcome").textContent = severe ?
    severe + (severe === 1 ? " issue to fix" : " issues to fix") :
    advisory ? "Review recommended" : "Checks passed";
  const locales = [...new Set(report.findings.map(x => x.locale).filter(Boolean))].sort();
  replaceSelect($("localeFilter"), locales.map(x => ({value:x,label:x})), "All languages");
  const codes = [...new Set(report.findings.map(x => x.code))];
  replaceSelect($("typeFilter"), codes.map(code => ({
    value:code,label:issuePresentation({code}).title
  })), "All issue types");
  resetFilters();
  $("results").classList.remove("hidden");
  renderIssueRows();
  message("");
  announce("Analysis complete: " + severe + " blocking, " + advisory + " review issues.");
  $("results").scrollIntoView({behavior:"smooth",block:"start"});
}
analyze.addEventListener("click", () => {
  if (currentText === null) return;
  try { draw(inspectLocalizationCsv(currentText, {
    sourceLocale: $("sourceLocale").value.trim(),
  })); }
  catch (error) {
    resetResults();
    const text = error instanceof Error ? error.message : "Couldn't analyze this CSV.";
    message(text,true); announce("Analysis failed: " + text);
  }
});
$("sample").addEventListener("click", () => {
  const sample = [
    "key,en,pl,de",
    "welcome,Welcome {name},Witaj {name},Hallo {user}",
    "count,Score %d,Wynik %s,Punkte %d",
    "missing,Continue,,Weiter",
    "welcome,Welcome {name},Witaj {name},Hallo {name}",
    "tag,\"<b>Important</b>\",\"<b>Ważne</b>\",Wichtig",
  ].join("\n");
  setFile(sample, "example-with-issues.csv");
  analyze.click();
});
for (const chip of document.querySelectorAll("[data-severity]")) {
  chip.addEventListener("click", () => {
    selectedSeverity = chip.dataset.severity;
    for (const button of document.querySelectorAll("[data-severity]"))
      button.setAttribute("aria-pressed", String(button === chip));
    renderIssueRows();
  });
}
for (const id of ["searchIssues","localeFilter","typeFilter"])
  $(id).addEventListener(id === "searchIssues" ? "input" : "change",renderIssueRows);
$("resetFilters").addEventListener("click",resetFilters);

function downloadText(name, data, mime) {
  const blob = new Blob([data], {type:mime});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("download").addEventListener("click", () => {
  if (!lastReport) return;
  downloadText("forgeframe-localization-report.json",
    JSON.stringify({tool:"ForgeFrame Labs Localization QA Inspector",
      schemaVersion:1,filename,report:lastReport},null,2),
    "application/json");
});
$("downloadCsv").addEventListener("click", () => {
  if (lastReport)
    downloadText("forgeframe-localization-findings.csv",
      exportIssuesCsv(lastReport),"text/csv;charset=utf-8");
});

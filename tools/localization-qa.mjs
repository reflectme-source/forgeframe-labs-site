import {inspectLocalizationCsv} from "./localization-core.mjs";

const $ = (id) => document.getElementById(id);
const input = $("csv");
const drop = $("drop");
const analyze = $("analyze");
const msg = $("message");
const summary = $("summary");
const tbody = $("findings");
let currentText = null;
let lastReport = null;
let filename = null;
const MAX_BYTES = 2 * 1024 * 1024;

function message(text, error=false) {
  msg.textContent = text;
  msg.classList.remove("hidden");
  msg.classList.toggle("danger", error);
}
function setText(text, name) {
  currentText = text;
  filename = name;
  $("fileLabel").textContent = name;
  analyze.disabled = false;
  msg.classList.add("hidden");
  $("results").classList.add("hidden");
}
async function loadFile(file) {
  if (!file) return;
  if (file.size > MAX_BYTES) {message("File is too large. Maximum size is 2 MB.", true);return;}
  try {setText(await file.text(),file.name);}
  catch {message("Couldn't read the selected file.", true);}
}
input.addEventListener("change",()=>loadFile(input.files?.[0]));
drop.addEventListener("keydown",(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();input.click();}});
for (const eventName of ["dragenter","dragover"]) {
  drop.addEventListener(eventName,e=>{e.preventDefault();drop.classList.add("drag");});
}
for (const eventName of ["dragleave","drop"]) {
  drop.addEventListener(eventName,e=>{e.preventDefault();drop.classList.remove("drag");});
}
drop.addEventListener("drop",e=>loadFile(e.dataTransfer?.files?.[0]));

function stat(label,value) {
  const div=document.createElement("div");
  div.className="stat";
  const strong=document.createElement("strong");
  strong.textContent=String(value);
  const caption=document.createElement("span");
  caption.textContent=label;
  div.append(strong,caption);
  return div;
}
function cell(row,text,cls) {
  const td=document.createElement("td");
  td.textContent=String(text??"");
  if(cls)td.className=cls;
  row.append(td);
}
function draw(report) {
  lastReport=report;
  summary.replaceChildren(
    stat("CSV rows",report.summary.totalRows),
    stat("Unique keys",report.summary.uniqueKeys),
    stat("Target locales",report.locales.length),
    stat("Findings",report.summary.findings)
  );
  tbody.replaceChildren();
  for (const item of report.findings.slice(0,1500)) {
    const tr=document.createElement("tr");
    cell(tr,item.row);
    cell(tr,item.key);
    cell(tr,item.locale);
    cell(tr,item.code,"code");
    cell(tr,item.details);
    tbody.append(tr);
  }
  $("empty").classList.toggle("hidden",report.findings.length!==0);
  $("results").classList.remove("hidden");
  if(report.findings.length>1500)
    message("Only the first 1,500 findings are shown; the JSON export includes all findings.");
  else msg.classList.add("hidden");
}
analyze.addEventListener("click",()=>{
  if(currentText===null)return;
  try{
    draw(inspectLocalizationCsv(currentText,{sourceLocale:$("sourceLocale").value.trim()}));
  }catch(e){
    $("results").classList.add("hidden");
    message(e instanceof Error?e.message:"Cannot parse CSV.",true);
  }
});
$("sample").addEventListener("click",()=>{
  const sample=[
    "key,en,pl,de",
    "welcome,Welcome {name},Witaj {name},Hallo {user}",
    "count,Score %d,Wynik %s,Punkte %d",
    "missing,Continue,,Weiter",
    "welcome,Welcome {name},Witaj {name},Hallo {name}",
    "tag,\"<b>Important</b>\",\"<b>Ważne</b>\",Wichtig"
  ].join("\n");
  setText(sample,"sample-with-defects.csv");
  analyze.click();
});
$("download").addEventListener("click",()=>{
  if(!lastReport)return;
  const json=JSON.stringify({
    tool:"ForgeFrame Labs Localization QA Inspector",
    schemaVersion:1,
    filename,report:lastReport
  },null,2);
  const blob=new Blob([json],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="forgeframe-localization-report.json";
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

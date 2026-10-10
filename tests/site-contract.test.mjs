import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pages=[
 "index.html","support.html","privacy.html","products/localization-qa.html",
 "tools/localization-qa.html","tools/localization-qa-guide.html","integrations/otomoto-dealer-api.html"
];
function html(file) {return readFileSync(join(root,file),"utf8");}
function localTargets(page) {
 const hits=[];
 const re=/\b(?:href|src)=["']([^"']+)["']/g;
 for(const [,ref] of html(page).matchAll(re)){
  if(!ref || ref[0]==="#" || ref.startsWith("mailto:") || ref.startsWith("http:") ||
   ref.startsWith("https:") || ref.startsWith("data:")) continue;
  const path=ref.split("#")[0].split("?")[0];
  if(!path)continue;
  hits.push(resolve(root,dirname(page),decodeURIComponent(path)));
 }
 return hits;
}
test("every public page has local links and assets pointing to existing files",()=>{
 let count=0;
 for(const page of pages){
  for(const target of localTargets(page)){
   assert.ok(target.startsWith(root),"Link outside site root: "+target);
   assert.ok(existsSync(target),page+" references missing "+target);
   count++;
  }
 }
 assert.ok(count>=20,"Unexpectedly few linked assets");
});
test("marketing pages contain a useful product and honest CTA",()=>{
 const main=html("index.html");
 const product=html("products/localization-qa.html");
 assert.match(main,/Localization QA Inspector/);
 assert.match(main,/tools\/localization-qa\.html/);
 assert.match(product,/free inspector/i);
 assert.match(product,/not currently available on the Asset Store/i);
});
test("public-facing marketing does not include engineering status artifacts",()=>{
 const market=html("index.html")+html("support.html")+html("products/localization-qa.html");
 for(const text of ["internal note","safety block","private draft","pre-release test",
 "staging build","technical handoff","source for a native Unity Editor window has been prepared"]){
  assert.doesNotMatch(market,new RegExp(text,"i"),"Customer-facing internal term: "+text);
 }
});
test("inspector provides basic accessibility and mobile navigation",()=>{
 const page=html("tools/localization-qa.html");
 assert.match(page,/aria-pressed="true"/);
 assert.match(page,/aria-live="polite"/);
 assert.match(page,/for="sourceLocale"/);
 assert.match(page,/:focus-visible/);
 assert.match(page,/prefers-reduced-motion/);
 assert.match(page,/table,tbody\{display:block/);
 assert.match(page,/aria-label="Localization issues"/);
});
test("only first-party local JS modules run in the inspector",()=>{
 const page=html("tools/localization-qa.html");
 const scripts=[...page.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(scripts,["./localization-qa.mjs"]);
 assert.doesNotMatch(page,/google-analytics|gtag|segment\.com|hotjar|mixpanel/i);
});

test("ForgeFrame home offers a browsable multi-platform portfolio with honest readiness",()=>{
 const home=html("index.html");
 assert.match(home,/<main id="main">/);
 assert.match(home,/href="#main">Skip to content/);
 assert.equal((home.match(/<article class="project"/g)||[]).length,6);
 for(const platform of ["apify","web","unity","roblox","jetbrains","integrations"]){
  assert.match(home,new RegExp('data-platform="'+platform+'"'));
  assert.match(home,new RegExp('data-filter="'+platform+'"'));
 }
 for(const label of ["Published","Available","In development","In validation","Compatibility QA"]){
  assert.ok(home.includes(label),"Missing honest availability label: "+label);
 }
 assert.match(home,/tools\/localization-qa\.html/);
 assert.match(home,/solutions\/otomoto-vehicle-monitoring\.html/);
 assert.doesNotMatch(home,/AcqPath|ExtensionOps/);
});

test("brand-wide support and privacy are aligned with multi-platform products",()=>{
 const support=html("support.html");
 const privacy=html("privacy.html");
 assert.match(support,/OTOMOTO Change Intelligence/);
 assert.match(support,/Localization QA Inspector/);
 assert.match(support,/API and platform inquiries/);
 assert.match(support,/Skip to content/);
 assert.match(privacy,/October 10, 2026/);
 assert.match(privacy,/GitHub Pages/);
 assert.match(privacy,/Apify and other marketplaces/);
 assert.doesNotMatch(privacy,/Unity developer publishing brand/);
});

test("public sitemap lists real brand routes including Polish automotive landing",()=>{
 const sm=readFileSync(join(root,"sitemap.xml"),"utf8");
 const urls=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,8);
 assert.ok(urls.some(url=>url.endsWith("/integrations/otomoto-dealer-api.html")));
 for(const u of urls){
   const parsed=new URL(u);
   assert.equal(parsed.hostname,"reflectme-source.github.io");
   const relative=parsed.pathname.replace(/^\/forgeframe-labs-site\//,"")||"index.html";
   assert.ok(existsSync(join(root,relative)),u+" not found in repository");
 }
});

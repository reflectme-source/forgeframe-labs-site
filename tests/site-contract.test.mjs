import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pages=[
 "index.html","support.html","privacy.html","products/localization-qa.html",
 "tools/localization-qa.html","tools/localization-qa-guide.html","products/contract-guard.html","tools/contract-guard-report.html","integrations/otomoto-dealer-api.html","guides/otomoto-price-monitoring.html","guides/openapi-breaking-changes-github-actions.html"
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
 assert.equal((home.match(/<article class="project"/g)||[]).length,7);
 for(const platform of ["apify","web","unity","roblox","jetbrains","integrations"]){
  assert.match(home,new RegExp('data-platform="'+platform+'"'));
 }
 for(const label of ["Published","Available","In development","In validation","Compatibility QA"]){
  assert.ok(home.includes(label),"Missing honest availability label: "+label);
 }
 assert.match(home,/tools\/localization-qa\.html/);
 assert.match(home,/products\/contract-guard\.html/);
 assert.match(home,/solutions\/otomoto-vehicle-monitoring\.html/);
 assert.match(home,/<details class="roadmap" id="roadmap">/);
 assert.match(home,/3 products in development/);
 assert.equal((home.match(/Not available for purchase/g)||[]).length,3);
 assert.doesNotMatch(home,/data-filter=/);
 assert.match(home,/href="https:\/\/apify\.com\/green_amazement\/otomoto-change-intelligence"/);
 assert.match(home,/href="\.\/integrations\/otomoto-dealer-api\.html"/);
 assert.doesNotMatch(home,/AcqPath|ExtensionOps/);
});

test("unreleased roadmap has no purchase or inquiry CTAs",()=>{
 const home=html("index.html");
 const start=home.indexOf('<details class="roadmap"');
 const stop=home.indexOf('</details>',start);
 assert.ok(start>0 && stop>start,"Roadmap disclosure not found");
 const roadmap=home.slice(start,stop);
 assert.equal((roadmap.match(/<article class="project"/g)||[]).length,3);
 assert.doesNotMatch(roadmap,/href="(?:mailto:|https:\/\/apify\.com)/);
 assert.equal((roadmap.match(/Not available for purchase/g)||[]).length,3);
});

test("every local navigation fragment points to an existing section",()=>{
 for(const page of pages){
   const source=html(page);
   const ids=new Set([...source.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
   for(const [,target] of source.matchAll(/href="#([^"]+)"/g)){
     assert.ok(ids.has(decodeURIComponent(target)),page+" has missing anchor #"+target);
   }
 }
});

test("homepage workflow paths lead to the real offerings",()=>{
 const main=html("index.html");
 const start=main.indexOf('<section class="approach"');
 const end=main.indexOf('</section>',start);
 assert.ok(start>=0 && end>start);
 const section=main.slice(start,end);
 assert.match(section,/Monitor a saved search/);
 assert.match(section,/Check your CSV in-browser/);
 assert.match(section,/Scope a specific API workflow/);
 assert.match(section,/href="\.\/solutions\/otomoto-vehicle-monitoring\.html"/);
 assert.match(section,/href="\.\/tools\/localization-qa\.html"/);
 assert.match(section,/mailto:forgeframe\.lab@gmail\.com/);
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
 assert.equal(urls.length,12);
 assert.ok(urls.some(url=>url.endsWith("/integrations/otomoto-dealer-api.html")));
 assert.ok(urls.some(url=>url.endsWith("/products/contract-guard.html")));
 for(const u of urls){
   const parsed=new URL(u);
   assert.equal(parsed.hostname,"reflectme-source.github.io");
   const relative=parsed.pathname.replace(/^\/forgeframe-labs-site\//,"")||"index.html";
   assert.ok(existsSync(join(root,relative)),u+" not found in repository");
 }
});
test("buyer guide directs qualified visitors to real Apify tasks and a scoped integration inquiry",()=>{
 const page=html("guides/otomoto-price-monitoring.html");
 assert.match(page,/lang="pl"/);
 assert.match(page,/href="#main"/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 for(const slug of ["bmw-3-series-price-changes","audi-a4-market-price-watch","skoda-octavia-new-listing-monitor"]){
  assert.ok(page.includes("/examples/"+slug),"Missing verified Apify example "+slug);
 }
 assert.match(page,/mailto:forgeframe\.lab@gmail\.com/);
 assert.match(page,/Nie\. To niezależny Actor/);
 assert.doesNotMatch(page,/<script\b[^>]*src=/);
 assert.match(html("integrations/otomoto-dealer-api.html"),/guides\/otomoto-price-monitoring\.html/);
});

test("OpenAPI guide has a genuine developer journey to the public action and the priced managed setup",()=>{
 const page=html("guides/openapi-breaking-changes-github-actions.html");
 assert.match(page,/<html lang="en">/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/href="#main"/);
 assert.match(page,/github.com\/reflectme-source\/forgeframe-contract-guard/);
 assert.match(page,/mailto:forgeframe\.lab@gmail\.com/);
 assert.match(page,/\$149/);
 assert.match(page,/No instant checkout/);
 assert.match(page,/not a paid SaaS/);
 assert.doesNotMatch(page,/<script\b[^>]*src=/);
 assert.match(html("products/contract-guard.html"),/guides\/openapi-breaking-changes-github-actions\.html/);
});

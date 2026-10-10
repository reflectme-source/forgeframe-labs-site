import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pages=[
 "index.html","support.html","privacy.html","products/localization-qa.html",
 "tools/localization-qa.html","tools/localization-qa-guide.html","products/contract-guard.html","tools/contract-guard-report.html","integrations/otomoto-dealer-api.html","guides/otomoto-price-monitoring.html","en/index.html","pl/pomoc.html","pl/prywatnosc.html","pl/lokalizacja.html","guides/openapi-breaking-changes-github-actions.html"
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

test("Polish and English homes preserve real offerings",()=>{
 const pl=html("index.html"),en=html("en/index.html");
 assert.match(pl,/<html lang="pl">/);assert.match(en,/<html lang="en">/);
 for(const p of [pl,en])for(const product of ["OTOMOTO Change Intelligence","Localization QA Inspector","Contract Guard"])assert.ok(p.includes(product));
 for(const p of [pl,en]){assert.match(p,/apify.com\/green_amazement\/otomoto-change-intelligence/);assert.match(p,/products\/contract-guard.html/);assert.match(p,/tools\/localization-qa.html/);assert.match(p,/class="roadmap"/);assert.doesNotMatch(p,/AcqPath|ExtensionOps/);}
});
test("Polish pages and distinct development roadmap",()=>{
 for(const path of ["pl/pomoc.html","pl/prywatnosc.html","pl/lokalizacja.html"])assert.match(html(path),/<html lang="pl">/);
 for(const path of ["index.html","en/index.html"]){const p=html(path),a=p.indexOf('<details class="roadmap"'),b=p.indexOf('</details>',a);assert.ok(a>0&&b>a);const roadmap=p.slice(a,b);for(const word of ["Unity","Roblox","JetBrains"])assert.ok(roadmap.includes(word));assert.doesNotMatch(roadmap,/href="mailto:/);}
});
test("local navigation fragments resolve",()=>{for(const page of pages){const source=html(page),ids=new Set([...source.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));for(const [,fragment] of source.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(fragment),page+" #"+fragment);}});

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
 assert.equal(urls.length,19);
 assert.equal(new Set(urls).size,urls.length,"Sitemap must not contain duplicate pages");
 assert.ok(urls.some(url=>url.endsWith("/services/connect-to-forge-assessment/")));
 assert.ok(urls.some(url=>url.endsWith("/services/connect-to-forge-assessment/checklist.html")));
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


test("both language homes link to the genuine private Connect-to-Forge service",()=>{
  const pl=html("index.html"),en=html("en/index.html");
  const link="https://reflectme-source.github.io/forgeframe-labs-site/services/connect-to-forge-assessment/";
  for(const home of [pl,en]){
    assert.ok(home.includes('href="'+link+'"'),"Missing scoped Atlassian service link");
  }
  assert.match(pl,/Ocena migracji Connect/);
  assert.match(en,/Connect → Forge assessment/);
  const service=html("services/connect-to-forge-assessment/index.html");
  assert.match(service,/31 January 2027/);
  assert.match(service,/€490/);
  assert.match(service,/indicative fixed-scope price/);
});


test("Contract Guard sales page uses a copyable immutable-pinned v0.1.3 action",()=>{
  const p=html("products/contract-guard.html");
  const expected="uses: reflectme-source/forgeframe-contract-guard@47857973aeba8bf5bb6b034544bddaa2be6c8ad5";
  assert.ok(p.includes(expected),"The action example must pin the verified v0.1.3 commit");
  assert.doesNotMatch(p,/uses: reflectme-source\/\s*\n\s*forgeframe-contract-guard/);
  assert.match(p,/upload-evidence: 'false'/);
  assert.match(p,/# v0\.1\.3/);
});

test("Merchant Issue Desk landing remains publicly discoverable and clearly scoped",()=>{
  const homepage=html("index.html"),page=html("services/merchant-issue-desk.html");
  assert.match(homepage,/href="https:\/\/reflectme-source\.github\.io\/forgeframe-labs-site\/services\/merchant-issue-desk\.html"/);
  assert.match(page,/Merchant Issue Desk/);
  assert.match(page,/690 zł/);
  assert.match(page,/Nie gwarantujemy zatwierdzenia produktów/);
  assert.match(page,/forgeframe\.lab@gmail\.com/);
});

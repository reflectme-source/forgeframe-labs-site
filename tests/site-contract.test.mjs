import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pages=[
 "index.html","support.html","privacy.html","products/localization-qa.html",
 "tools/localization-qa.html","tools/localization-qa-guide.html","products/contract-guard.html","products/contract-guard-intake.html","terms.html","tools/contract-guard-report.html","integrations/otomoto-dealer-api.html","guides/otomoto-price-monitoring.html","en/index.html","pl/pomoc.html","pl/prywatnosc.html","pl/lokalizacja.html","guides/openapi-breaking-changes-github-actions.html"
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

test("main homepage features accurate products and separate category routes",()=>{const home=html("index.html"),en=html("en/index.html");assert.match(home,/<html lang="pl">/);assert.match(en,/<html lang="en">/);for(const name of ["OTOMOTO Change Intelligence","Localization QA Inspector","Contract Guard"])assert.match(home,new RegExp(name));for(const page of ["products/index.html","solutions/index.html","developers/index.html","about/index.html"]){assert.ok(existsSync(join(root,page)),page+" must exist")}for(const route of ["products/","solutions/","developers/","about/"])assert.ok(home.includes('href="./'+route+'"'));for(const path of ["index.html","en/index.html"])assert.doesNotMatch(html(path),/AcqPath|ExtensionOps/);});

test("navigation now opens dedicated pages rather than legacy scroll sections",()=>{const pl=html("index.html");for(const page of ["pl/pomoc.html","pl/prywatnosc.html","pl/lokalizacja.html"])assert.match(html(page),/<html lang="pl">/);assert.doesNotMatch(pl,/href="#rozwiazania"|href="#studio"/);for(const path of ["solutions/index.html","developers/index.html","about/index.html","products/index.html"])assert.match(html(path),/class="site-nav"/);});

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
 assert.ok(urls.length>=20,'The Contract Guard intake route must be included');
 assert.ok(urls.some(url=>url.endsWith('/products/contract-guard-intake.html')));
 assert.equal(new Set(urls).size,urls.length,"Sitemap must not contain duplicate pages");
 assert.ok(urls.some(url=>url.endsWith("/services/connect-to-forge-assessment/")));
 assert.ok(urls.some(url=>url.endsWith("/services/connect-to-forge-assessment/checklist.html")));
 assert.ok(urls.some(url=>url.endsWith("/services/merchant-issue-desk.html")),"Merchant Issue Desk landing missing from sitemap");
 assert.ok(urls.some(url=>url.endsWith("/integrations/otomoto-dealer-api.html")));
 assert.ok(urls.some(url=>url.endsWith("/products/contract-guard.html")));
 for(const u of urls){
   const parsed=new URL(u);
   assert.equal(parsed.hostname,"forgeframelabs.app");
   const relative=parsed.pathname.replace(/^\//,"")||"index.html";
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
 assert.match(page,/product=otomoto/);
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
 assert.match(page,/href="\.\.\/products\/contract-guard-intake\.html"/);
 assert.match(page,/\$149/);
 assert.match(page,/scope, legal seller and delivery in writing before issuing a unique one-order Stripe payment link/);
 assert.match(page,/not a paid SaaS/);
 assert.doesNotMatch(page,/<script\b[^>]*src=/);
 assert.match(html("products/contract-guard.html"),/guides\/openapi-breaking-changes-github-actions\.html/);
});


test("Connect-to-Forge service remains discoverable from central catalog",()=>{const pl=html("products/index.html"),en=html("en/index.html");assert.match(pl,/connect-to-forge-assessment/);assert.match(en,/Connect → Forge/);assert.match(html("services/connect-to-forge-assessment/index.html"),/€490/);assert.ok(existsSync(join(root,"services/connect-to-forge-assessment/pl/index.html")));});

test("Contract Guard sales page uses a copyable immutable-pinned v0.1.3 action",()=>{
  const p=html("products/contract-guard.html");
  const expected="uses: reflectme-source/forgeframe-contract-guard@47857973aeba8bf5bb6b034544bddaa2be6c8ad5";
  assert.ok(p.includes(expected),"The action example must pin the verified v0.1.3 commit");
  assert.doesNotMatch(p,/uses: reflectme-source\/\s*\n\s*forgeframe-contract-guard/);
  assert.match(p,/upload-evidence: 'false'/);
  assert.match(p,/# v0\.1\.3/);
});

test("Merchant Issue Desk remains discoverable and factually scoped",()=>{const homepage=html("index.html"),catalog=html("products/index.html"),page=html("services/merchant-issue-desk.html");assert.match(homepage,/services\/merchant-issue-desk\.html/);assert.match(catalog,/merchant-issue-desk\.html/);assert.match(page,/690 zł/);assert.match(page,/Nie gwarantujemy zatwierdzenia produktów/);assert.match(page,/product=merchant-issue-desk/);});

test("all primary customer paths provide direct browser-based Gmail contact and fallback",()=>{
 const files=[
  "index.html","en/index.html","pl/pomoc.html","support.html","pl/lokalizacja.html",
  "products/localization-qa.html",
  "solutions/otomoto-vehicle-monitoring.html",
  "tools/contract-guard-report.html","tools/localization-qa-guide.html",
  "services/merchant-issue-desk.html","services/merchant-issue-desk-demo.html",
  "services/connect-to-forge-assessment/index.html",
  "services/connect-to-forge-assessment/pl/index.html",
  "services/connect-to-forge-assessment/checklist.html"
 ];
 for(const file of files){
  const body=html(file);
  assert.match(body,/assets\/direct-contact\.js/,file+" missing contact strip");
 }
 for(const f of ["index.html","en/index.html","services/merchant-issue-desk.html",
  "services/connect-to-forge-assessment/index.html","services/connect-to-forge-assessment/pl/index.html"]){
   assert.match(html(f),/kontakt\.html|contact\/|product=/,f+" missing form route");
 }
 for(const f of ["products/contract-guard.html","integrations/otomoto-dealer-api.html"]){
   assert.doesNotMatch(html(f),/<script[^>]*direct-contact\.js/);
   assert.match(html(f),/kontakt\.html|contact\/|product=/);
 }
 const code=html("assets/direct-contact.js");
 assert.match(code,/forgeframe\.lab@gmail\.com/);
 assert.match(code,/contactBase/);
 assert.match(code,/mailto:/);
 assert.doesNotMatch(code,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|FormSubmit|formsubmit/);
});


test("ForgeFrame bilingual contact forms have safe fields and working local assets",()=>{
 for(const [file,lang,thanks] of [
  ["pl/kontakt.html","pl","pl/dziekujemy.html"],
  ["contact/index.html","en","contact/thanks.html"]]){
  const page=html(file);
  assert.match(page,new RegExp('<html lang="'+lang+'">'));
  assert.match(page,/method="POST"/);
  assert.match(page,/action="https:\/\/formsubmit\.co\/forgeframe\.lab@gmail\.com"/);
  assert.match(page,/name="email" type="email"[^>]*required/);
  assert.match(page,/name="message" minlength="10" maxlength="2000"/);
  assert.match(page,/name="_honey"/);
  assert.match(page,/name="privacy_notice_read"/);
  assert.match(page,/name="product" required/);
  assert.match(page,/name="_next"/);
  assert.doesNotMatch(page,/reflectme\.project@gmail\.com|hello\.extensionops@gmail\.com/);
  assert.match(html(thanks),/noindex,nofollow/);
  for(const target of localTargets(file)) assert.ok(existsSync(target),file+" broken asset "+target);
 }
 assert.match(html("privacy.html"),/FormSubmit/);
 assert.match(html("pl/prywatnosc.html"),/FormSubmit/);
 assert.match(html("assets/contact-form.js"),/forgeframe\.lab@gmail\.com/);
 assert.match(html("assets/contact-form.css"),/@media\(max-width:650px\)/);
});


test("customer inquiries use one bilingual contextual form",()=>{
 const pl=html("index.html"),en=html("en/index.html");
 assert.doesNotMatch(pl,/href="#kontakt"/);
 assert.doesNotMatch(en,/href="#kontakt"/);
 assert.match(pl,/href="\.\/pl\/kontakt\.html"/);
 assert.match(en,/href="\.\.\/contact\/"/);
 for(const [page,target] of [
 ["services/merchant-issue-desk.html","product=merchant-issue-desk"],
 ["products/contract-guard.html","product=contract-guard"],
 ["services/connect-to-forge-assessment/index.html","product=connect-to-forge"],
 ["services/connect-to-forge-assessment/pl/index.html","product=connect-to-forge"],
 ["integrations/otomoto-dealer-api.html","product=otomoto"],
 ["support.html","contact/"],["pl/pomoc.html","kontakt.html"]
 ])assert.match(html(page),new RegExp(target),page);
 for(const f of ["pl/kontakt.html","contact/index.html"]){
  const page=html(f);
  assert.match(page,/minlength="10"/);
  assert.doesNotMatch(page,/minlength="20"/);
 }
 const script=html("assets/direct-contact.js");
 assert.match(script,/contactBase/);
 assert.match(script,/product=/);
});


test("live products have tailored buyer scope, deliverables and truthful access",()=>{
 const files=[
  "services/merchant-issue-desk.html",
  "products/contract-guard.html",
  "solutions/otomoto-vehicle-monitoring.html",
  "integrations/otomoto-dealer-api.html",
  "products/localization-qa.html",
  "products/digital-packager.html",
  "products/originduty/index.html",
  "services/connect-to-forge-assessment/index.html",
  "services/connect-to-forge-assessment/pl/index.html"
 ];
 const subjects=new Set();
 for(const file of files){
   const p=html(file);
   assert.match(p,/class="ff-detail"/,file+" needs a factual commercial quick-reference");
   assert.match(p,/assets\/product-details\.css/,file+" missing editorial shared styles");
   assert.match(p,/class="ff-detail__grid"/,file+" missing buyer\/output\/pricing blocks");
   assert.match(p,/class="ff-detail__actions"/,file+" missing actionable product CTA");
   for(const dest of localTargets(file)){
     assert.ok(dest.startsWith(root),file+" outside root: "+dest);
     assert.ok(existsSync(dest),file+" broken local asset or CTA: "+dest);
   }
   const heading=(p.match(/class="ff-detail__title">([^<]+)<\/h2>/)||[])[1];
   assert.ok(heading&&heading.length>30,file+" needs a meaningful unique title");
   assert.ok(!subjects.has(heading),file+" duplicated product content");
   subjects.add(heading);
 }
 assert.equal(subjects.size,files.length);
 const styles=html("assets/product-details.css");
 assert.match(styles,/max-width:760px/);
 assert.match(styles,/__action--primary/);
 assert.doesNotMatch(styles,/url\(/);
});
test("central product catalog is complete and avoids unsupported sales promises",()=>{const home=html("index.html"),catalog=html("products/index.html");assert.ok((catalog.match(/<article class="card"/g)||[]).length>=7);for(const name of ["OriginDuty","Digital Packager","Localization QA","Contract Guard","Merchant Issue Desk"])assert.match(catalog,new RegExp(name));assert.match(home,/products\//);assert.match(catalog,/Przedpremiera/);assert.match(catalog,/connect-to-forge-assessment/);assert.match(home,/integrations|solutions\/otomoto-vehicle-monitoring/);});

test("Polish localization product page has actual sample format, privacy and clear free access",()=>{
 const p=html("pl/lokalizacja.html");
 assert.match(p,/lang="pl"/);
 assert.match(p,/key,en,pl,de/);
 assert.match(p,/CSV UTF-8 do 2 MB/);
 assert.match(p,/Natywna wtyczka Unity Editor nie jest obecnie dostępna/);
 assert.match(p,/tools\/localization-qa\.html/);
 assert.match(p,/kontakt\.html\?product=localization-qa/);
 assert.equal((p.match(/<h1\b/g)||[]).length,1);
});
test("English Merchant Issue Desk page is complete and language-specific",()=>{
 const p=html("services/merchant-issue-desk-en.html");
 assert.match(p,/<html lang="en">/);
 assert.match(p,/from 690 PLN/);
 assert.match(p,/merchant-issue-desk-demo\.html/);
 assert.match(p,/contact\/\?product=merchant-issue-desk/);
 assert.match(p,/Synthetic data/);
 assert.match(p,/No live checkout/);
 assert.equal((p.match(/<h1\b/g)||[]).length,1);
 for(const d of localTargets("services/merchant-issue-desk-en.html"))assert.ok(existsSync(d),"Missing route "+d);
});
test("sitemap includes actual current store offer, pilots, locales and leads",()=>{
 const s=html("sitemap.xml"),urls=[...s.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,new Set(urls).size);
 for(const name of ["products/digital-packager.html","products/originduty/","services/merchant-issue-desk-en.html","services/merchant-issue-desk-demo.html","services/connect-to-forge-assessment/pl/","pl/kontakt.html","contact/"]){
  assert.ok(urls.some(u=>u.endsWith("/"+name)),name+" missing from sitemap");
 }
});
test("product-aware contact respects two newly included offerings",()=>{
 for(const f of ["pl/kontakt.html","contact/index.html"]){
   const s=html(f);
   assert.match(s,/<option value="digital-packager">/);
   assert.match(s,/<option value="originduty">/);
 }
 const js=html("assets/contact-form.js");
 assert.match(js,/\["digital-packager","Digital Packager"\]/);
 assert.match(js,/\["originduty","OriginDuty"\]/);
});


test("every interactive tool and sample report returns to the right product offer",()=>{
 const items={
 "services/merchant-issue-desk-demo.html":"merchant-issue-desk.html",
 "tools/localization-qa.html":"products/localization-qa.html",
 "tools/contract-guard-report.html":"products/contract-guard.html",
 "services/connect-to-forge-assessment/checklist.html":"contact/?product=connect-to-forge",
 "tools/localization-qa-guide.html":"products/localization-qa.html",
 "guides/mikrokulki-szklane-chiny-taric-2026-2162.html":"products/originduty/",
 "products/originduty/regulation-2026-2245-pva.html":"contact.html?product=originduty"
 };
 for(const [page,indicator] of Object.entries(items)){
  const s=html(page);
  assert.match(s,/class="ff-next"/,page+" should show product return path");
  assert.match(s,/assets\/reader-next\.css/,page+" needs tested shared editorial style");
  assert.ok(s.includes(indicator)||page.includes("originduty/regulation"),page+" missing contextual route");
  for(const path of localTargets(page)){
   assert.ok(path.startsWith(root),page+" escapes site root");
   assert.ok(existsSync(path),page+" broken local URL "+path);
  }
 }
 const css=html("assets/reader-next.css");
 assert.match(css,/max-width:730px/);
 assert.match(css,/focus-visible/);
});


test("OriginDuty points to a real product offer and independently hosted research remains available",()=>{const home=html("index.html"),catalog=html("products/index.html"),en=html("en/index.html");assert.match(home,/products\/originduty\//);assert.match(catalog,/products\/originduty\//);assert.match(en,/products\/originduty\//);});

test("domain binding uses the selected owned apex hostname",()=>{
 assert.equal(readFileSync(join(root,"CNAME"),"utf8").trim(),"forgeframelabs.app");
 const robots=readFileSync(join(root,"robots.txt"),"utf8");
 assert.match(robots,/Sitemap: https:\/\/forgeframelabs\.app\/sitemap\.xml/);
});

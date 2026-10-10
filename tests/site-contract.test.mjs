import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pages=[
 "index.html","support.html","privacy.html","products/localization-qa.html",
 "tools/localization-qa.html","tools/localization-qa-guide.html","products/contract-guard.html","integrations/otomoto-dealer-api.html","en/index.html","pl/pomoc.html","pl/prywatnosc.html","pl/lokalizacja.html"
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

test("default homepage is Polish and keeps verified live tools",()=>{
 const pl=html("index.html"); const en=html("en/index.html");
 assert.match(pl,/<html lang="pl">/); assert.match(en,/<html lang="en">/);
 for(const product of ["OTOMOTO Change Intelligence","Localization QA Inspector","Contract Guard"]){assert.ok(pl.includes(product));assert.ok(en.includes(product));}
 for(const p of [pl,en]) {assert.match(p,/href="https:\/\/apify\.com\/green_amazement\/otomoto-change-intelligence"/);assert.match(p,/products\/contract-guard\.html/);assert.match(p,/tools\/localization-qa\.html/);assert.match(p,/class="roadmap"/);assert.doesNotMatch(p,/AcqPath|ExtensionOps/);}
 assert.match(pl,/hreflang="en"/); assert.match(en,/hreflang="pl"/);
 assert.match(pl,/forgeframe.lab@gmail.com/);
});
test("unreleased tools remain separated from purchasable products",()=>{
 for(const path of ["index.html","en/index.html"]){
 const s=html(path);const i=s.indexOf('<details class="roadmap"');const j=s.indexOf('</details>',i);
 assert.ok(i>0 && j>i);const block=s.slice(i,j);
 assert.doesNotMatch(block,/href="mailto:/);assert.doesNotMatch(block,/href="https:\/\/apify\.com/);
 for(const name of ["Unity","Roblox","JetBrains"])assert.ok(block.includes(name));
 }
});
test("language-specific legal and help pages exist",()=>{
 for(const path of ["pl/pomoc.html","pl/prywatnosc.html","pl/lokalizacja.html"]){assert.match(html(path),/<html lang="pl">/);assert.match(html(path),/ForgeFrame Labs/);}
});
test("all local fragment links resolve to an id",()=>{
 for(const path of pages){const s=html(path);const ids=new Set([...s.matchAll(/\\bid="([^"]+)"/g)].map(x=>x[1]));for(const [,ref] of s.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(ref),path+" #"+ref);}
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
 assert.equal(urls.length,13);
 assert.ok(urls.some(url=>url.endsWith("/integrations/otomoto-dealer-api.html")));
 assert.ok(urls.some(url=>url.endsWith("/products/contract-guard.html")));
 for(const u of urls){
   const parsed=new URL(u);
   assert.equal(parsed.hostname,"reflectme-source.github.io");
   const relative=parsed.pathname.replace(/^\/forgeframe-labs-site\//,"")||"index.html";
   assert.ok(existsSync(join(root,relative)),u+" not found in repository");
 }
});
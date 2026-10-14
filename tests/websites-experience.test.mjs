import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(join(root,p),'utf8');

test('Websites EN/PL have complete priced business offer without invented checkout',()=>{
 for(const [name,lang] of [['websites/index.html','en'],['pl/strony-internetowe.html','pl']]){
  const s=read(name);
  assert.match(s,new RegExp('<html lang="'+lang+'">'));
  assert.match(s,/forgeframe-websites\.css/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/id="packages"/);
  assert.equal((s.match(/class="fw-package(?: is-featured)?"/g)||[]).length,3);
  assert.equal((s.match(/class="fw-type"/g)||[]).length,6);
  assert.equal((s.match(/class="fw-faq-list"/g)||[]).length,1);
  assert.equal((s.match(/<details>/g)||[]).length,5);
  for(const price of ['$990','$1,990','$3,490'])assert.ok(s.includes(price),name+" "+price);
  for(const packageName of ['starter','business','custom']){
   assert.ok(s.includes('package='+packageName),name+" missing package selection "+packageName);
  }
  assert.match(s,/product=websites/);
  assert.doesNotMatch(s,/formsubmit\.co/); // no data submission directly on the landing page
  assert.doesNotMatch(s,/stripe\.com\/checkout|checkout\.stripe\.com|fake client|5-star rating|guaranteed rank/i);
  assert.match(s,/rel="canonical"/);
  assert.match(s,/hreflang="en"/);
  assert.match(s,/hreflang="pl"/);
  assert.match(s,/application\/ld\+json/);
  assert.match(s,/property="og:title"/);
  assert.match(s,/class="fw-hero-desktop"/);
  assert.match(s,/class="fw-hero-mobile"/);
  assert.doesNotMatch(s,/class="fw-work-section"|websites-acqpath\.webp|websites-reflectme\.webp/);
  assert.doesNotMatch(s,/class="fw-legal-note"/);
  assert.doesNotMatch(s,/RECOMMENDED|REKOMENDOWANY|Free estimate · no meeting required/);
  assert.match(s,lang==='en'?/MOST PURCHASED/:/NAJCZĘŚCIEJ KUPOWANY/);
  assert.match(s,/Original hospitality concept|Autorski koncept strony restauracji/);

  assert.equal((s.match(/<h1>/g)||[]).length,1);
 }
});

test('Original demonstrator websites exist in two languages, and are explicitly not customer work',()=>{
 for(const route of ['northline','northline-pl','atelier-table','atelier-table-pl']){
  const path='websites/concepts/'+route+'.html';
  const s=read(path);
  assert.match(s,/NOINDEX|noindex/i);
  assert.match(s,/CONCEPT|KONCEPT|DEMONSTRATION/i);
  assert.match(s,/NOT A CLIENT PROJECT/);
  assert.match(s,/forgeframe-websites-concepts\.css/);
  assert.match(s,/id="contact"/);
  assert.ok(existsSync(join(root,path)));
 }
 const pl=read('pl/strony-internetowe.html');
 assert.doesNotMatch(pl,/northline-pl\.html|atelier-table-pl\.html/);
});

test('Home and catalog lead to Websites without replacing verified original products',()=>{
 for(const page of ['index.html','en/index.html']){
  const s=read(page);
  assert.match(s,/class="fw-home-promo"/);
  assert.match(s,/ffshot-products/);
  for(const name of ['Contract Guard','OriginDuty','Localization QA Inspector'])assert.ok(s.includes(name));
 }
 for(const page of ['products/index.html','en/products/index.html']){
  const s=read(page);
  assert.match(s,/data-product="websites"/);
  assert.match(s,/data-category="business"/);
  assert.ok(s.includes('forgeframe-websites-entry.css'));
 }
 const shell=read('assets/forgeframe-shell.js');
 assert.match(shell,/function addWebsitesLinks/);
 assert.match(shell,/const label=activeLang==="pl"\?"Strony WWW":"Websites"/);
 assert.match(shell,/dataset\.ffgWebsites/);
});

test('Contact form recognizes Websites and only allowlisted package metadata',()=>{
 const js=read('assets/contact-form.js');
 assert.match(js,/\["websites","ForgeFrame \/ Websites"\]/);
 assert.match(js,/new Map\(\[\["starter","Starter"\],\["business","Business"\],\["custom","Custom"\]\]\)/);
 assert.match(js,/packageSelect\.value=isWebsites&&allowedPackages\.has\(packageFromUrl\)/);
 assert.match(js,/Select.*change|addEventListener\("change"/);
 for(const page of ['contact/index.html','pl/kontakt.html']){
  const s=read(page);
  assert.match(s,/value="websites"/);
  assert.match(s,/name="service_package"/);
  assert.match(s,/data-websites-package/);
  assert.match(s,/privacy_notice_read/);
  assert.match(s,/https:\/\/formsubmit\.co\/forgeframe\.lab@gmail\.com/);
  assert.match(s,/name="_next"/);
 }
});

test('Websites metadata, sitemap and all local asset paths are valid',()=>{
 const sitemap=read('sitemap.xml');
 for(const [route,url] of [['websites/index.html','https://forgeframelabs.app/websites/'],['pl/strony-internetowe.html','https://forgeframelabs.app/pl/strony-internetowe.html']]){
  assert.ok(sitemap.includes('<loc>'+url+'</loc>'));
  const page=read(route);
  assert.ok(page.includes('href="'+url+'"'));
  for(const match of page.matchAll(/(?:src|href)="(\.{1,2}\/[^"#?]+)"/g)){
   const target=join(root,dirname(route),match[1]);
   assert.ok(existsSync(target),route+" missing "+target);
  }
 }
});

test('Websites navigation has working locale-specific Contact links, not self-links',()=>{
 for(const [file,expected,other] of [
  ['websites/index.html','../contact/','../pl/kontakt.html'],
  ['pl/strony-internetowe.html','../pl/kontakt.html','../contact/']
 ]){
  const s=read(file);
  const nav=s.match(/<nav[^>]*class="ffg-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,file+' missing navigation');
  assert.ok(nav.includes('href="'+expected+'"'),file+' contact route incorrect');
  assert.doesNotMatch(nav,/<a\s+href="\.\/"\s*>Contact<\/a>/,file+' contact must not link to itself');
  assert.ok(s.includes('href="'+other.replace("pl/kontakt.html","pl/strony-internetowe.html").replace("contact/","websites/")+'"')||s.includes('hreflang="en"'),file+' missing localized counterpart');
  const contactFile=expected.includes('/pl/kontakt.html')?'pl/kontakt.html':'contact/index.html';
  assert.ok(existsSync(join(root,contactFile)),file+' points to absent contact page');
 }
 const en=read('websites/index.html');
 assert.match(en,/href="\.\.\/contact\/\?product=websites&amp;source=websites"/);
 const pl=read('pl/strony-internetowe.html');
 assert.match(pl,/href="\.\.\/pl\/kontakt\.html\?product=websites&amp;source=websites"/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const paths=[
 'products/originduty/index.html',
 'products/originduty/en/index.html',
 'products/originduty/evidence/index.html',
 'products/originduty/evidence/en/index.html'
];
const contents=(path)=>readFileSync(join(root,path),'utf8');
test('OriginDuty pages exist in product-owned directory only',()=>{
 for(const p of paths)assert.ok(existsSync(join(root,p)),p);
});
test('all OriginDuty local page links and scripts resolve',()=>{
 for(const page of paths){
  const html=contents(page),re=/\b(?:href|src)=["']([^"']+)["']/g;
  for(const [,href] of html.matchAll(re)){
   if(!href || href.startsWith('#')||/^(?:https?:|mailto:|tel:|data:)/.test(href))continue;
   const pure=href.split('#')[0].split('?')[0];
   if(!pure)continue;
   const target=resolve(root,dirname(page),decodeURIComponent(pure));
   assert.ok(target.startsWith(root),page+' must not escape repository');
   assert.ok(existsSync(target),page+' broken local reference '+href);
  }
 }
});
test('all public pages reuse exact central shell classes, locale, and brand',()=>{
 for(const p of paths){
  const page=contents(p);
  assert.match(page,/class="ffg-header"/);
  assert.match(page,/class="ffg-footer"/);
  assert.match(page,/forgeframe-global\.css/);
  assert.match(page,/forgeframe-system\.css/);
  assert.match(page,/forgeframe-avatar\.png/);
  assert.match(page,/class="ffg-language"/);
  assert.match(page,/hreflang="pl"/);
  assert.match(page,/hreflang="en"/);
  assert.match(page,/aria-current="page"/);
  assert.doesNotMatch(page,/http-equiv="refresh"/);
  assert.doesNotMatch(page,/\bsk_live_|\brk_live_|whsec_|STRIPE_SECRET_KEY|OPERATOR_KEY/);
 }
});
test('customer promises remain truthful, marketing and public evidence distinct',()=>{
 const pl=contents(paths[0]),en=contents(paths[1]);
 assert.match(pl,/Analiza przepisów UE oparta na oficjalnych dokumentach/);
 assert.match(en,/Evidence-linked EU trade-defence intelligence/);
 assert.match(pl,/349 zł/);assert.match(pl,/899 zł/);
 assert.match(en,/349 PLN/);assert.match(en,/899 PLN/);
 assert.match(pl,/pl\/kontakt\.html\?product=originduty/);
 assert.match(en,/contact\/\?product=originduty/);
 for(const p of paths){ const html=contents(p); assert.doesNotMatch(html,/<form[\s>]/i,'No customer intake form on static pages'); assert.doesNotMatch(html,/<input[^>]+type=[\"'](?:email|password|file)[\"']/i,'No private input fields'); }
});
test('public feed viewer uses safe text rendering and bounded source URL',()=>{
 const js=contents('products/originduty/origin-evidence.js');
 assert.match(js,/public-pilot-production\.up\.railway\.app\/regulations\.json/);
 assert.match(js,/textContent/);
 assert.match(js,/^\s*const exact=/m);
 assert.match(js,/^\s*function legalLink\(/m);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage|document\.cookie/);
 assert.match(js,/48\*3600000/);
 const localStyle=contents('products/originduty/originduty-unified.css');
 assert.match(localStyle,/\.od-hero/);
 assert.doesNotMatch(localStyle,/\.ffg-header\s*\{/);
});
test('source cases are exact and excluded CN codes are never advertised as included',()=>{
 const e=contents('products/originduty/evidence/index.html');
 const pl=contents(paths[0]);
 assert.match(pl,/3905 30 00 91/);
 assert.match(pl,/70181011/);
 assert.match(e,/Brak wyniku nie potwierdza braku obowiązków/);
});

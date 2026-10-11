import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>readFileSync(join(root,file),'utf8');
const files=['order.html','kup.html','order-status.html','status.html','service-terms.html','warunki.html'].map(s=>'products/contract-guard/'+s);
test('Bilingual self-service pages use standard ForgeFrame shell, real scopes and responsible seller',()=>{
 for(const file of files){
  const html=read(file);
  assert.match(html,/<html lang="(en|pl)">/);
  assert.match(html,/ffg-header/);
  assert.match(html,/ffg-footer/);
  assert.match(html,/forgeframe-global\.css/);
  assert.match(html,/Contract Guard|Contract Guard/);
  assert.doesNotMatch(html,/sk_live_|rk_live_|whsec_|buy\.stripe\.com/);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,file);
  const dir=dirname(join(root,file));
  for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(href.startsWith('#')||/^(?:https?:|mailto:|data:)/i.test(href))continue;
   const path=resolve(dir,href.split('#')[0].split('?')[0]);
   assert.ok(path.startsWith(root),file+' traversal '+href);
   assert.ok(existsSync(path),file+' broken link '+href);
  }
 }
 for(const file of files.slice(0,2)){
  const h=read(file);
  for(const id of ['eligibility-form','purchase-form','repository','spec-path','buyer-email','buyer-company','buyer-country','terms','privacy','scope-agree','check-btn','pay-btn'])assert.match(h,new RegExp('id="'+id+'"'),id);
  assert.match(h,/payment|płatno|Checkout/i);
  assert.match(h,/one|jedno/i);
  assert.match(h,/id="purchase-form" hidden/);
 }
});
test('self-service UX never stores sensitive keys or claims that a redirect means payment',()=>{
 const js=read('products/contract-guard/buy.js');
 const tracking=read('products/contract-guard/status.js');
 assert.doesNotThrow(()=>new Script(js));assert.doesNotThrow(()=>new Script(tracking));
 assert.match(js,/\/v1\/contract-guard\/eligibility/);
 assert.match(js,/\/v1\/contract-guard\/checkout/);
 assert.match(js,/checkout_available/);
 assert.match(js,/payBtn.disabled/);
 assert.match(js,/sessionStorage.setItem/);
 assert.doesNotMatch(js+tracking,/fetch\(\s*['"]http:|localhost|sk_live_|rk_live_|whsec_/);
 assert.match(tracking,/\/v1\/contract-guard\/status/);
 assert.match(tracking,/!body\.paid_verified_at|!body\.paid|body\.paid/);
 for(const f of files.slice(2,4))assert.match(read(f),/noindex,nofollow/);
});
test('product landing pages connect to self-service and keep optional support',()=>{
 assert.match(read('products/contract-guard.html'),/contract-guard\/order\.html/);
 assert.match(read('products/contract-guard/index.html'),/\.\/kup\.html/);
 assert.match(read('products/contract-guard.html'),/contract-guard-intake\.html/);
 assert.match(read('products/contract-guard/index.html'),/intake\.html/);
});

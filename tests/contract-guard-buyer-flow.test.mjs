import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
const english=read('products/contract-guard.html');
const polish=read('products/contract-guard/index.html');
const enForm=read('products/contract-guard-intake.html');
const plForm=read('products/contract-guard/intake.html');
const client=read('products/contract-guard/intake.js');
const terms=read('terms.html');

test('both product locales retain canonical public URLs and shared ForgeFrame chrome',()=>{
 for(const [page,lang] of [[english,'en'],[polish,'pl']]){
   assert.match(page,new RegExp('<html lang="'+lang+'">'));
   assert.match(page,/class="ffg-header"/);
   assert.match(page,/class="ffg-footer"/);
   assert.match(page,/class="ffg-language"/);
   assert.match(page,/forgeframe-global\.css/);
   assert.match(page,/assets\/product-details\.css/);
   assert.match(page,/class="ff-detail__grid"/);
   assert.match(page,/class="ff-detail__actions"/);
   assert.equal((page.match(/<h1\b/g)||[]).length,1);
 }
 assert.match(english,/https:\/\/forgeframelabs\.app\/products\/contract-guard\.html/);
 assert.match(polish,/https:\/\/forgeframelabs\.app\/products\/contract-guard\//);
 assert.match(english,/href="\.\.\/products\/contract-guard\/"/);
 assert.match(polish,/href="\.\.\/\.\.\/products\/contract-guard\.html"/);
});
test('customer cannot pay without approved scope and verified checkout',()=>{
 for(const page of [english,polish,enForm,plForm]){
   assert.doesNotMatch(page,/buy\.stripe\.com|checkout\.stripe\.com|sk_live_|rk_live_|whsec_/);
   assert.match(page,/149|\$149/);
 }
 assert.match(english,/written|scope/);
 assert.match(polish,/pisem|zakres/);
 assert.match(terms,/Stripe/);assert.match(terms,/trusted backend/);
 assert.match(enForm,/No upfront payment/i);
 assert.match(plForm,/BEZ WPŁATY Z GÓRY/);
});
test('scope forms and local-only script are bilingual and accessible',()=>{
 for(const [page,lang] of [[enForm,'en'],[plForm,'pl']]){
   assert.match(page,new RegExp('<html lang="'+lang+'">'));
   assert.match(page,/<form id="scope-form" novalidate>/);
   for(const id of ['email','company','country','repository','format','runner','spec-path','references','delivery','notes','ack','scope-status','scope-preview']){
     assert.match(page,new RegExp('id="'+id+'"'));
   }
   assert.match(page,/aria-live="polite"/);
   assert.match(page,/role="status"/);
   assert.match(page,/contract-guard\/intake\.js|\.\/intake\.js/);
 }
 assert.doesNotMatch(client,/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|eval\(/);
 assert.match(client,/navigator\.clipboard\.writeText/);
 assert.match(client,/window\.location\.href/);
 assert.match(client,/form\.reportValidity\(\)/);
 assert.match(client,/url\.hostname!=='github\.com'/);
 assert.doesNotThrow(()=>new Script(client));
});
test('local product paths and shared assets resolve in the repository',()=>{
 for(const filename of ['products/contract-guard.html','products/contract-guard/index.html','products/contract-guard-intake.html','products/contract-guard/intake.html']){
  const html=read(filename);
  const base=dirname(join(root,filename));
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const value=match[1];
   if(value[0]==='#'||/^(https?:|mailto:|data:)/.test(value))continue;
   const filepath=resolve(base,value.split('#')[0].split('?')[0]);
   assert.ok(filepath.startsWith(root),filename+' points outside root');
   assert.ok(existsSync(filepath),filename+' missing '+value);
  }
 }
});

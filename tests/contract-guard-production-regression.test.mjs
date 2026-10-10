import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,join} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const en=readFileSync(join(root,'products/contract-guard.html'),'utf8');
const pl=readFileSync(join(root,'products/contract-guard/index.html'),'utf8');
const intakeEn=readFileSync(join(root,'products/contract-guard-intake.html'),'utf8');
const intakePl=readFileSync(join(root,'products/contract-guard/intake.html'),'utf8');

test('Contract Guard order-to-delivery section has a valid opening tag in both languages',()=>{
 for(const [name,page] of [['en',en],['pl',pl]]){
   assert.match(page,/<section class="cg-section cg-section--alt" id="process"><div class="cg-wrap">/,name);
   assert.doesNotMatch(page,/id="process"<div|<section[^>]*<div/,name);
   assert.equal((page.match(/id="process"/g)||[]).length,1,name);
   assert.match(page,/<\/main><footer class="ffg-footer">/,name);
 }
});
test('production canonical and language links point to the approved domain and two real intake pages',()=>{
 assert.match(en,/canonical" href="https:\/\/forgeframelabs\.app\/products\/contract-guard\.html"/);
 assert.match(pl,/canonical" href="https:\/\/forgeframelabs\.app\/products\/contract-guard\/"/);
 assert.match(en,/href="\.\/contract-guard-intake\.html"/);
 assert.match(pl,/href="\.\/intake\.html"/);
 assert.match(intakeEn,/https:\/\/forgeframelabs\.app\/products\/contract-guard-intake\.html/);
 assert.match(intakePl,/https:\/\/forgeframelabs\.app\/products\/contract-guard\/intake\.html/);
 for(const page of [en,pl,intakeEn,intakePl]){
  assert.match(page,/assets\/forgeframe-global\.css/);
  assert.match(page,/ffg-header/);
  assert.match(page,/ffg-footer/);
  assert.doesNotMatch(page,/https:\/\/buy\.stripe\.com\//);
 }
});

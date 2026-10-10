import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const pl=readFileSync(new URL('../products/ksef-status-evidence/index.html',import.meta.url),'utf8');
const en=readFileSync(new URL('../en/products/ksef-status-evidence/index.html',import.meta.url),'utf8');
for(const [code,html,root] of [['pl',pl,'../../'],['en',en,'../../../']]){
 test('KSeF '+code+' page matches shared ForgeFrame contract',()=>{
   assert.match(html,new RegExp('<html lang="'+code+'">'));
   assert.match(html,/assets\/forgeframe-global\.css/);
   assert.match(html,/class="ffg-header"/);
   assert.match(html,/class="ffg-footer"/);
   assert.match(html,/class="ffg-language"/);
   assert.match(html,/aria-current="page"/);
   assert.equal((html.match(/<h1\b/g)||[]).length,1);
   assert.match(html,/mailto:forgeframe\.lab@gmail\.com/);
   assert.doesNotMatch(html,/https:\/\/buy\.stripe\.com/);
   assert.doesNotMatch(html,/<form\b|<script\b/i);
   assert.doesNotMatch(html,/Obecna wersja została przetestowana offline/);
   assert.match(html,/hreflang="pl"/);
   assert.match(html,/hreflang="en"/);
 });
}
test('KSeF PL and EN cross-links and product URLs are stable',()=>{
 assert.match(pl,/href="\.\.\/\.\.\/en\/products\/ksef-status-evidence\/"/);
 assert.match(en,/href="\.\.\/\.\.\/\.\.\/products\/ksef-status-evidence\/"/);
 assert.match(pl,/https:\/\/forgeframelabs\.app\/products\/ksef-status-evidence\//);
 assert.match(en,/https:\/\/forgeframelabs\.app\/en\/products\/ksef-status-evidence\//);
});

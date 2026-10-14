import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('OTOMOTO PL EN: change events remain illustrative and not confused with confirmed sales',()=>{
 const css=read('assets/otomoto-v2.css');
 assert.match(css,/OTOMOTO event clarity and mobile data readability/);
 for(const page of ['solutions/otomoto-vehicle-monitoring.html','solutions/otomoto-vehicle-monitoring/index.html']){
  const html=read(page);
  assert.equal((html.match(/class="mock-line"/g)||[]).length,3);
  assert.equal((html.match(/class="ot-event-icon/g)||[]).length,3);
  assert.match(html, /not proof that the vehicle was sold|Nie oznacza to potwierdzonej sprzedaży/);
  assert.match(html,/https:\/\/apify\.com\/green_amazement\/otomoto-change-intelligence/);
 }
});

test('OriginDuty PL EN: consistent dark legal sample cards, scoped plan selection and honest source labeling',()=>{
 const css=read('assets/forgeframe-originduty-v2.css');
 assert.match(css,/\.od-v2 \.od-sample\s*\{[^}]*background:#102131!important/s);
 for(const page of ['products/originduty/index.html','products/originduty/en/index.html']){
  const html=read(page);
  assert.equal((html.match(/class="od-sample"/g)||[]).length,2);
  assert.match(html,/EUR-LEX REFERENCE|ŹRÓDŁO EUR-LEX/);
  assert.doesNotMatch(html,/SOURCE VERIFIED/);
  assert.equal((html.match(/class="od-button od-button--primary od-plan-start"/g)||[]).length,2);
  assert.match(html,/originduty-app\.forgeframelabs\.app\/signup\?plan=/);
 }
 assert.doesNotMatch(read('products/originduty/index.html'),/PLN \/ month/);
});

test('Public Evidence Desk PL EN: accessible refresh, honest no-data and source document states',()=>{
 const css=read('assets/forgeframe-originduty-evidence-v2.css');
 assert.match(css,/\.od-evidence-v2 \.od-empty\s*\{/);
 assert.match(css,/\.od-evidence-v2 \.od-document\s*\{/);
 for(const page of ['products/originduty/evidence/index.html','products/originduty/evidence/en/index.html']){
  const html=read(page);
  assert.match(html,/id="od-refresh"/);
  assert.match(html,/id="od-records"/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/id="od-code"/);
 }
});

test('Connect to Forge PL EN: one contextual contact CTA at bottom, plus quote and checklist paths',()=>{
 const examples=[
  ['services/connect-to-forge-assessment/index.html','checklist.html'],
  ['services/connect-to-forge-assessment/pl/index.html','../checklist.html']
 ];
 for(const [page,checklist] of examples){
  const html=read(page);
  assert.equal((html.match(/product=connect-to-forge/g)||[]).length,2,page);
  assert.match(html,/class="cx-bottom"[\s\S]*?cx-button--primary[\s\S]*?product=connect-to-forge/);
  assert.ok(html.includes('href="'+checklist+'"'));
  assert.match(html,/€490/);
 }
});

test('Contract Guard PL EN: visual buyer stages do not bypass preflight or backend checkout',()=>{
 const css=read('products/contract-guard/buy.css');
 assert.match(css,/\.cg-buy-side\s*\{top:102px\}/);
 assert.match(css,/\.cg-buy-input,\.cg-buy-select\s*\{font-size:16px\}/);
 for(const page of ['products/contract-guard/order.html','products/contract-guard/kup.html']){
  const html=read(page);
  assert.match(html,/id="eligibility-form"/);
  assert.match(html,/id="purchase-form" hidden/);
  assert.match(html,/id="pay-btn" type="submit" disabled/);
  assert.match(html,/id="buyer-email"/);
 }
});

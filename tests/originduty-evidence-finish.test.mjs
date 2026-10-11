import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("OriginDuty PL/EN has single active CTA per plan, preserved gated checkout and upgraded FAQ",()=>{
 for(const file of ["products/originduty/index.html","products/originduty/en/index.html"]){
  const s=read(file);
  assert.equal((s.match(/data-od-buy hidden/g)||[]).length,2);
  assert.equal((s.match(/data-od-contact-fallback/g)||[]).length,2);
  assert.doesNotMatch(s,/class="od-pricing-note"/);
  assert.equal((s.match(/<details>/g)||[]).length,4);
  assert.match(s,/origin-buy\.js/);
 }
 const css=read("assets/forgeframe-originduty-v2.css");
 assert.match(css,/\.od-v2 \[hidden\]\{display:none!important\}/);
 assert.match(css,/\.od-faq-list summary:after/);
});
test("Public Evidence Desk preserves data selectors and gets a unified PL/EN design",()=>{
 for(const file of ["products/originduty/evidence/index.html","products/originduty/evidence/en/index.html"]){
  const s=read(file);
  assert.match(s,/class="od od-evidence-v2"/);
  assert.match(s,/forgeframe-originduty-evidence-v2.css/);
  for(const id of ["od-stat-docs","od-stat-codes","od-stat-feed","od-records","od-code","od-origin","od-kind","od-action","od-clear","od-refresh"]){
   assert.ok(s.includes('id="'+id+'"'),file+" "+id);
  }
  assert.match(s,/origin-evidence\.js/);
 }
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("OriginDuty has two active plan selection links without bypassing paid entitlement gating",()=>{
 for(const p of ["products/originduty/index.html","products/originduty/en/index.html"]){
  const s=read(p);
  assert.equal((s.match(/class="od-button od-button--primary od-plan-start"/g)||[]).length,2);
  assert.match(s,/data-od-contact-fallback href="https:\/\/originduty-app\.forgeframelabs\.app\/signup\?plan=importer"/);
  assert.match(s,/data-od-contact-fallback href="https:\/\/originduty-app\.forgeframelabs\.app\/signup\?plan=agency"/);
  assert.equal((s.match(/data-od-buy hidden/g)||[]).length,2);
  assert.match(s,/origin-evidence\.js|origin-status\.js/);
 }
});
test("evidence PL EN bypass stale JS caches and retry temporary failures",()=>{
 for(const p of ["products/originduty/evidence/index.html","products/originduty/evidence/en/index.html"]){
  assert.match(read(p),/origin-evidence\.js\?v=20261011c/);
 }
 const js=read("products/originduty/origin-evidence.js");
 assert.match(js,/attempt<3/);
 assert.match(js,/cache:'no-store'/);
 const preview=read("origin_live_preview_server.py");
 assert.match(preview,/Cache-Control/);
});

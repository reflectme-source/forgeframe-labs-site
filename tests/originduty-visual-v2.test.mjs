import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("OriginDuty PL and EN retain verified sources and purchase readiness gating after redesign",()=>{
 for(const file of ["products/originduty/index.html","products/originduty/en/index.html"]){
  const s=read(file);
  assert.match(s,/class="od od-v2"/);
  assert.match(s,/forgeframe-originduty-v2.css/);
  assert.match(s,/CELEX:32026R2245/);
  assert.match(s,/3905 30 00 91/);
  assert.match(s,/data-od-buy/);
  assert.match(s,/data-od-contact-fallback/);
  assert.match(s,/originduty-app\.forgeframelabs\.app\/signup\?plan=importer/);
  assert.match(s,/originduty-app\.forgeframelabs\.app\/signup\?plan=agency/);
  assert.match(s,/349/);
  assert.match(s,/899/);
  assert.match(s,/origin-buy\.js/);
 }
});

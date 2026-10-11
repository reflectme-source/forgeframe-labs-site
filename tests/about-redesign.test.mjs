import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("About PL and EN share Poland-centered visual narrative and original site shell",()=>{
 for(const p of ["about/index.html","en/about/index.html"]){
  const s=read(p);
  assert.match(s,/class="ffabout"/);
  assert.match(s,/class="ffabout-globe"/);
  assert.match(s,/class="ffabout-roots"/);
  assert.equal((s.match(/class="ffabout-value"/g)||[]).length,4);
  assert.match(s,/forgeframe-about\.css/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.doesNotMatch(s,/50\+|10K\+|40\+|Trusted by|newsletter/i);
 }
});
test("globe is decorative illustration with explicit accessible label",()=>{
 for(const p of ["about/index.html","en/about/index.html"]){
  const s=read(p);
  assert.match(s,/role="img" aria-label="/);
  assert.match(s,/class="ffabout-polish-flag"/);
  assert.match(s,/FORGEFRAME LABS · EUROPE/);
 }
});

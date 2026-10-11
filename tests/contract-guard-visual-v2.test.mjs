import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("Contract Guard redesign uses real OpenAPI evidence and preserves purchase routes in PL and EN",()=>{
 for(const [file,order,intake] of [
  ["products/contract-guard.html","./contract-guard/order.html","./contract-guard-intake.html"],
  ["products/contract-guard/index.html","./kup.html","./intake.html"]
 ]){
  const s=read(file);
  assert.match(s,/cg-v2-hero/);
  assert.match(s,/forgeframe-contract-guard-v2.css/);
  assert.match(s,/GET \/payments/);
  assert.match(s,/required: true/);
  assert.match(s,/enum: chargeback/);
  assert.match(s,/examples\/breaking\/report.json/);
  assert.ok(s.includes('href="'+order+'"'));
  assert.ok(s.includes('href="'+intake+'"'));
  assert.match(s,/\$149/);
  assert.match(s,/oasdiff/);
  assert.match(s,/SHA-256/);
  assert.doesNotMatch(s,/Chrome Web Store|manifest\.json|500\+ scans|99% issues resolved|Pro \$79/);
 }
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("one bilingual company-wide terms and privacy pair",()=>{
 for(const [file,lang] of [["terms.html","en"],["pl/regulamin.html","pl"],["privacy.html","en"],["pl/prywatnosc.html","pl"]]){
  const s=read(file);
  assert.match(s,new RegExp('<html lang="'+lang+'">'));
  assert.match(s,/class="fflegal-toc"/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/forgeframe-legal-v2.css/);
  assert.match(s,/ReflectMe sp\. z o\.o\./);
  assert.match(s,/forgeframe\.lab@gmail\.com/);
 }
 assert.match(read("terms.html"),/id="consumer-terms"/);
 assert.match(read("pl/regulamin.html"),/id="warunki-konsumenckie"/);
});
test("deprecated Contract Guard legal pages point to general documents",()=>{
 for(const [file,target] of [["products/contract-guard/service-terms.html","../../terms.html"],["products/contract-guard/warunki.html","../../pl/regulamin.html"]]){
  const s=read(file);assert.match(s,/http-equiv="refresh"/);assert.match(s,/noindex,follow/);assert.ok(s.includes(target));
 }
});
test("checkout links to correct terms, consumer withdrawal and privacy",()=>{
 for(const [file,terms,privacy,consumer] of [
 ["products/contract-guard/order.html","../../terms.html","../../privacy.html","#consumer-terms"],
 ["products/contract-guard/kup.html","../../pl/regulamin.html","../../pl/prywatnosc.html","#warunki-konsumenckie"]
 ]){
  const s=read(file);
  assert.ok(s.includes(terms),file+" terms");
  assert.ok(s.includes(privacy),file+" privacy");
  assert.ok(s.includes(terms+consumer),file+" consumer");
  assert.match(s,/id="scope-agree"/);
  assert.match(s,/id="pay-btn"/);
 }
});
test("company product experience contract prohibits separate legal policies",()=>{
 const s=read("PRODUCT_PAGE_EXPERIENCE_CONTRACT.md");
 assert.match(s,/two global ForgeFrame legal documents/);
 assert.match(s,/server-side payment verification/);
 assert.match(s,/approved visualization/);
});

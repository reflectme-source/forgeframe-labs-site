import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("About lower panel has only one world network map and counts countries not companies",()=>{
 const map=read("assets/forgeframe-world-network.svg");
 assert.match(map,/Illustrative dotted world map, Poland marked/);
 assert.ok(statSync(join(root,"assets/forgeframe-world-network.svg")).size>10000);
 for(const p of ["about/index.html","en/about/index.html"]){
  const s=read(p);
  assert.match(s,/forgeframe-world-network\.svg/);
  assert.match(s,/ffabout-network-map/);
  assert.doesNotMatch(s,/ffabout-roots-visual|ffabout-roots-fact/);
  assert.match(s,/20 różnych krajów|20 countries/);
  assert.doesNotMatch(s,/>20<\/strong>/);
 }
});
test("Contact preserves real third-party delivery and required privacy consent",()=>{
 for(const p of ["pl/kontakt.html","contact/index.html"]){
  const s=read(p);
  assert.match(s,/class="ffcontact"/);
  assert.match(s,/forgeframe-contact\.css/);
  assert.match(s,/data-forgeframe-contact/);
  assert.match(s,/https:\/\/formsubmit\.co\/forgeframe\.lab@gmail\.com/);
  assert.match(s,/name="privacy_notice_read"/);
  assert.match(s,/id="contact-form"/);
  const productSelect=s.match(/<select[^>]*name="product"[^>]*>[\s\S]*?<\/select>/)?.[0]||"";assert.equal((productSelect.match(/<option value=/g)||[]).length,9);
  assert.doesNotMatch(s,/50\+ companies|guaranteed response|24\/7 support/i);
 }
});

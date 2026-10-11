import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("PL and EN developers pages share real developer resources and common shell",()=>{
 for(const file of ["developers/index.html","en/developers/index.html"]){
  const s=read(file);
  assert.match(s,/class="ffdev"/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/forgeframe-developers\.css/);
  assert.match(s,/forgeframe-developers\.js/);
  assert.equal((s.match(/class="ffdev-resource"/g)||[]).length,6);
  assert.equal((s.match(/role="tab"/g)||[]).length,3);
  assert.match(s,/NOT A LIVE SCAN|NIE JEST SKANEM LIVE/);
  assert.doesNotMatch(s,/api\.forgeframe\.dev|@forgeframe\/sdk/);
 }
});
test("developer example interaction is keyboard-accessible and does not claim a real scan",()=>{
 const js=read("assets/forgeframe-developers.js");
 assert.match(js,/ArrowRight/);
 assert.match(js,/aria-selected/);
 assert.match(js,/navigator\.clipboard\.writeText/);
 assert.match(js,/Illustrative OpenAPI change/);
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
test("Poland highlighted on real geographic globe and bottom section redesigned",()=>{
 const globe=read("assets/forgeframe-earth-europe.svg");
 assert.match(globe,/Orthographic Earth map centered on Europe, Poland highlighted/);
 assert.match(globe,/<path d=/);
 assert.ok(statSync(join(root,"assets/forgeframe-earth-europe.svg")).size>30000);
 for(const file of ["about/index.html","en/about/index.html"]){
  const s=read(file);
  assert.match(s,/forgeframe-earth-europe\.svg/);
  assert.match(s,/class="ffabout-wrap ffabout-roots-new"/);
  assert.match(s,/class="ffabout-roots-fact"/);
  assert.match(s,/<strong>20<\/strong>/);
  assert.doesNotMatch(s,/ffabout-city-skyline|ffabout-map-grid/);
 }
});

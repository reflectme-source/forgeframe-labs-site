import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Digital Packager retains local checker and honest prelaunch offer in both languages',()=>{
 for(const p of ['products/digital-packager.html','products/digital-packager/index.html']){
  const s=read(p);
  assert.match(s,/class="dp-v2"/);
  assert.match(s,/forgeframe-digital-packager.css/);
  assert.match(s,/id="files"/);
  assert.match(s,/id="folder"/);
  assert.match(s,/id="result"/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/lang="en" href="[^"]*digital-packager\.html"/);
  assert.match(s,/lang="pl" href="[^"]*digital-packager\/"/);
  assert.match(s,/49/);
  assert.match(s,/forgeframe-shell.js/);
 }
});

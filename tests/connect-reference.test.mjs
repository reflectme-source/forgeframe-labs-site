import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Connect Forge reference layout PL EN avoids unsupported checkout and duplicate inquiry blocks',()=>{
 for(const p of ['services/connect-to-forge-assessment/index.html','services/connect-to-forge-assessment/pl/index.html']){
  const s=read(p);
  assert.match(s,/class="cx-page"/);
  assert.equal((s.match(/class="cx-feature"/g)||[]).length,3);
  assert.equal((s.match(/class="cx-offer"/g)||[]).length,1);
  assert.match(s,/€490/);
  assert.match(s,/connect-reference\.css/);
  assert.match(s,/ffg-footer/);
  assert.doesNotMatch(s,/within one business day/i);
 }
});

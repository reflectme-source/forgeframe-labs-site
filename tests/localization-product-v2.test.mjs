import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Localization QA public product PL EN has honest offer and usable inspection route',()=>{
 for(const p of ['products/localization-qa.html','products/localization-qa/index.html']){
  const s=read(p);
  assert.match(s,/forgeframe-localization.css/);
  assert.match(s,/class="lq-demo"/);
  assert.match(s,/class="ff-detail"/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/tools\/localization-qa.html/);
  assert.match(s,/tools\/localization-qa-guide.html/);
  assert.match(s,/LOCAL · NO UPLOAD/);
  assert.match(s,/forgeframe-shell.js/);
  assert.equal((s.match(/class="ffg-menu-toggle"/g)||[]).length,0);
  assert.match(s,/direct-contact.js/);
 }
});

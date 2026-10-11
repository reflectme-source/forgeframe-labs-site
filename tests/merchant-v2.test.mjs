import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Merchant Issue Desk PL and EN share ForgeFrame shell and keep real report offer',()=>{
 for(const p of ['services/merchant-issue-desk.html','services/merchant-issue-desk-en.html']){
  const s=read(p);
  assert.match(s,/class="mid-v2"/);
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/forgeframe-merchant.css/);
  assert.match(s,/forgeframe-shell.js/);
  assert.match(s,/merchant-issue-desk-demo.html/);
  assert.match(s,/690/);
  assert.match(s,/direct-contact.js/);
 }
});

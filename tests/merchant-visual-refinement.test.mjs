import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Merchant Issue Desk feature visuals use accessible stable SVG across PL EN',()=>{
 for(const p of ['services/merchant-issue-desk-en.html','services/merchant-issue-desk.html']){
  const s=read(p);
  assert.equal((s.match(/class="mid-feature-icon" aria-hidden="true"><svg /g)||[]).length,3,p);
  assert.match(s,/class="mid-report-file"><svg /,p);
  assert.match(s,/Synthetic data|PRZYKŁAD SYNTETYCZNY/,p);
  assert.match(s,/merchant-issue-desk-demo/,p);
  assert.match(s,/product=merchant-issue-desk/,p);
 }
 const css=read('assets/merchant-final.css');
 assert.match(css,/\.mid-feature \.mid-feature-icon\{/);
});
test('Merchant Issue Desk Polish sample is localized and offer never implies direct checkout',()=>{
 const s=read('services/merchant-issue-desk.html');
 assert.match(s,/>6 problemów</);
 assert.match(s,/<th>Problem<\/th>/);
 assert.match(s,/<th>Priorytet<\/th>/);
 assert.match(s,/>Brak GTIN</);
 assert.match(s,/>Do poprawy<\/span>/);
 assert.match(s,/>Ustal zakres Standard/);
 assert.doesNotMatch(s,/Incorrect product ID|To fix|>Zamów Standard/);
 assert.match(s,/od 690 zł/);
});


test('Merchant Issue Desk sample tables announce horizontal scrolling and support keyboard focus',()=>{
 const pairs=[
  ['services/merchant-issue-desk.html','Przesuń tabelę'],
  ['services/merchant-issue-desk-en.html','Scroll horizontally']
 ];
 for(const [p,hint] of pairs){
  const s=read(p);
  assert.equal((s.match(/class="mid-scroll-hint"/g)||[]).length,2);
  assert.equal((s.match(/class="mid-table-scroll" role="region"/g)||[]).length,2);
  assert.equal((s.match(/tabindex="0"/g)||[]).length,2);
  assert.ok(s.includes(hint));
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('Digital Packager PL EN: stable icons and truthful prelaunch, without malformed locale links',()=>{
  for(const p of ['products/digital-packager.html','products/digital-packager/index.html']){
    const html=read(p);
    assert.equal((html.match(/class="dp-step-icon" aria-hidden="true"><svg /g)||[]).length,3);
    assert.equal((html.match(/dp-type-zip/g)||[]).length,2);
    assert.doesNotMatch(html,/\{root\}|â|Â|Ĺ|�/);
    assert.match(html,/#checker/);
    assert.match(html,/download|pobierani/i);
    assert.match(html,/checkout|płatnośc/i);
  }
  const pl=read('products/digital-packager/index.html');
  assert.match(pl,/href="\.\.\/\.\.\/products\/digital-packager\.html"/);
  assert.match(pl,/01 \/ PLIKI/);
});
test('Localization QA PL EN: vector pictograms, real inspector links, and a scoped dark facts panel',()=>{
  for(const p of ['products/localization-qa.html','products/localization-qa/index.html']){
    const html=read(p);
    assert.equal((html.match(/class="lq-feature-icon" aria-hidden="true"><svg /g)||[]).length,3);
    assert.match(html,/tools\/localization-qa\.html/);
    assert.match(html,/SAMPLE REPORT|PRZYKŁADOWY RAPORT/);
  }
  const css=read('assets/forgeframe-localization.css');
  assert.match(css,/\.lq-page \.ff-detail\s*\{[^}]*background:#0d1927/s);
  assert.match(css,/\.lq-page \.ff-detail__body/);
});

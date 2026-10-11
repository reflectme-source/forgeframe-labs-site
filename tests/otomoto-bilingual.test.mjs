import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('OTOMOTO product uses shared ForgeFrame shell and truthful Apify handoff in PL EN',()=>{
 for(const [path,lang] of [['solutions/otomoto-vehicle-monitoring.html','en'],['solutions/otomoto-vehicle-monitoring/index.html','pl']]){
  const s=read(path);
  assert.match(s,new RegExp('<html lang="'+lang+'">'));
  assert.match(s,/class="ffg-header"/);
  assert.match(s,/class="ffg-footer"/);
  assert.match(s,/otomoto-v2.css/);
  assert.match(s,/forgeframe-shell.js/);
  assert.match(s,/apify.com\/green_amazement\/otomoto-change-intelligence/);
  assert.match(s,/bmw-3-series-price-changes/);
  assert.match(s,/audi-a4-market-price-watch/);
  assert.match(s,/skoda-octavia-new-listing-monitor/);
  assert.match(s,/lang="pl"/);
  assert.match(s,/lang="en"/);
 }
});

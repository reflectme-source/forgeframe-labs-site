import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('live source proxy and gated CTA',()=>{
 assert.match(read('products/originduty/origin-evidence.js'),/__origin_live_feed/);
 assert.match(read('products/originduty/origin-status.js'),/__origin_source_status/);
 for(const p of ['products/originduty/index.html','products/originduty/en/index.html']){
 const s=read(p);
 assert.equal((s.match(/class="od-buy-helper"/g)||[]).length,2);
 assert.equal((s.match(/data-od-buy hidden/g)||[]).length,2);
 }
});

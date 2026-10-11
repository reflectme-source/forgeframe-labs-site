import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../products/originduty/'+f,import.meta.url),'utf8');
test('OriginDuty Buy CTA remains hidden unless locale and backend readiness match',()=>{
 const js=read('origin-buy.js');
 const pl=read('index.html'),en=read('en/index.html');
 assert.match(js,/status\.available!==true/);
 assert.match(js,/status\.supported_locales/);
 assert.match(js,/status\.supported_locales\.includes\(locale\)/);
 assert.match(pl,/data-od-buy hidden/);
 assert.match(en,/data-od-buy hidden/);
});
test('OriginDuty product-scoped stylesheet includes adequate readable fallback and link affordance',()=>{
 const css=read('originduty-unified.css');
 assert.match(css,/\.ff-detail__action--primary\{background:#15516e/);
 assert.match(css,/\.od-footnotes a\{text-decoration:underline/);
 assert.match(css,/\.od-faq h2 span\{color:#086b9b/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../products/contract-guard.html',import.meta.url),'utf8');
test('Checkout stays behind written scope',()=>{assert.match(html,/approved-checkout/);assert.match(html,/Request a scope check/);});

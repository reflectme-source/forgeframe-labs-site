import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const file='integrations/otomoto-dealer-api.html';
const pl=readFileSync(join(root,file),'utf8');
const home=readFileSync(join(root,'index.html'),'utf8');
const en=readFileSync(join(root,'solutions/otomoto-vehicle-monitoring.html'),'utf8');
test('Polish B2B landing is discoverable, honest and commercially actionable',()=>{
 assert.match(pl,/<html lang="pl">/);
 assert.match(pl,/<main id="main">/);
 assert.match(pl,/class="skip"/);
 assert.match(pl,/property="og:locale" content="pl_PL"/);
 assert.match(pl,/rel="canonical"/);
 assert.match(pl,/name="description"/);
 assert.match(pl,/BASELINE_CREATED/);
 assert.match(pl,/PRICE_CHANGE/);
 assert.match(pl,/NEW_LISTING/);
 assert.match(pl,/REMOVED_LISTING/);
 assert.match(pl,/nie dowód sprzedaży/);
 assert.match(pl,/nie jest oficjalnym API/);
 assert.match(pl,/modelu Pay-per-Event/);
 assert.match(pl,/indywidualnie/);
 assert.ok(pl.includes("product=otomoto"),"Missing contextual form for OTOMOTO");
 assert.ok((pl.match(/https:\/\/apify.com\/green_amazement\/otomoto-change-intelligence/g)||[]).length>=4);
 assert.doesNotMatch(pl,/reflectme.project@gmail.com|extensionops@gmail.com|AcqPath/i);
 assert.doesNotMatch(pl,/\\b\d+\s+(płacących klientów|zadowolonych dealerów)\b/i);
 assert.match(home,/integrations\/otomoto-dealer-api\.html/);
 assert.match(en,/href="\.\.\/integrations\/otomoto-dealer-api\.html"/);
});
test('Landing has no broken local links or unapproved third-party scripts',()=>{
 for(const [,src] of pl.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)){
   if(!src.startsWith('../')&&!src.startsWith('./'))continue;
   const path=resolve(root,dirname(file),decodeURIComponent(src.split('#')[0].split('?')[0]));
   assert.ok(path.startsWith(root));
   assert.ok(existsSync(path),"Missing local target: "+src);
 }
 assert.doesNotMatch(pl,/<script[^>]*src=/);
 assert.doesNotMatch(pl,/google-analytics|gtag|hotjar|segment\.com/i);
});

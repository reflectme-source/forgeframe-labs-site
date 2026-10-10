import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
const en=read('products/contract-guard.html'),pl=read('products/contract-guard/index.html');
const site=read('index.html'),guide=read('guides/openapi-breaking-changes-github-actions.html');
test('Contract Guard is discoverable and current routes remain intact',()=>{
 assert.match(site,/products\/contract-guard\.html/);
 assert.match(read('sitemap.xml'),/products\/contract-guard\.html/);
 assert.match(en,/href="\.\/contract-guard-intake\.html"/);
 assert.match(pl,/href="\.\/intake\.html"/);
 assert.match(en,/guides\/openapi-breaking-changes-github-actions\.html/);
 assert.match(guide,/github\.com\/reflectme-source\/forgeframe-contract-guard/);
});
test('website shows verified product, price and limitations without inventing features',()=>{
 for(const p of [en,pl]){
  assert.match(p,/GitHub Action/);
  assert.match(p,/\$149/);
  assert.match(p,/SHA-256/);
  assert.match(p,/oasdiff/);
  assert.match(p,/examples\/breaking\/report\.json/);
  assert.match(p,/examples\/safe\/report\.json/);
  assert.match(p,/forgeframe-contract-guard@47857973aeba8bf5bb6b034544bddaa2be6c8ad5/);
  assert.match(p,/upload-evidence: 'false'/);
  assert.match(p,/ff-detail__title/);
  assert.doesNotMatch(p,/guaranteed compliance|customer testimonials|instant checkout available|https:\/\/buy\.stripe\.com/gi);
 }
});
test('production pages share the approved header, footer and mobile responsive stylesheet',()=>{
 for(const p of [en,pl]){
  assert.match(p,/class="ffg-header"/);
  assert.match(p,/class="ffg-footer"/);
  assert.match(p,/aria-label="Main navigation"|aria-label="Nawigacja główna"/);
  assert.match(p,/class="ffg-locale"/);
  assert.match(p,/class="cg-icon/);
 }
 const css=read('products/contract-guard/site.css');
 assert.match(css,/@media\(max-width:720px\)/);
 assert.match(css,/:focus-visible/);
 assert.doesNotMatch(css,/\.ffg-header\s*\{|\.ffg-footer\s*\{|\.ffg-nav\s*\{/);
});

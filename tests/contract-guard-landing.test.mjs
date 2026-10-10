import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,join} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const landing=readFileSync(join(root,'products/contract-guard.html'),'utf8');
const home=readFileSync(join(root,'index.html'),'utf8');

test('landing is reachable from portfolio and sitemap',()=>{
  assert.match(home,/href="\.\/products\/contract-guard\.html"/);
  assert.match(readFileSync(join(root,'sitemap.xml'),'utf8'),/products\/contract-guard\.html/);
  assert.match(landing,/<link rel="canonical" href="https:\/\/reflectme-source\.github\.io\/forgeframe-labs-site\/products\/contract-guard\.html">/);
});
test('landing has honest monetization path and does not claim payments exist',()=>{
  assert.match(landing,/Managed setup · \$149/i);
  assert.match(landing,/one GitHub repository with an existing OpenAPI 3\.x contract/i);
  assert.match(landing,/mailto:forgeframe\.lab@gmail\.com/);
  assert.match(landing,/confirm repository scope and delivery schedule by email before paying/i);
  assert.match(landing,/https:\/\/buy\.stripe\.com\/fZu8wR6FX4q962E81z73G00/);
  assert.match(landing,/one GitHub repository with an existing OpenAPI 3\.x contract/i);
  assert.doesNotMatch(landing,/up to two repositories|buy\.stripe\.com\/test_/i);
  assert.doesNotMatch(landing,/customer testimonials|guaranteed income|guaranteed compliance|instant checkout available/i);
});
test('landing offers source-verified runnable software rather than a dead concept',()=>{
  assert.match(landing,/github\.com\/reflectme-source\/forgeframe-contract-guard/);
  assert.match(landing,/GitHub Action/);
  assert.match(landing,/tools\/contract-guard-report\.html/);
  assert.match(landing,/SHA-256/);
  assert.match(landing,/breaking OpenAPI changes/i);
  assert.match(landing,/scope|limitations|not a runtime contract test/i);
});
test('responsive, accessible and no third-party JS tracking',()=>{
  assert.match(landing,/<main id="main">/);
  assert.match(landing,/<h1>/);
  assert.match(landing,/aria-label="Main navigation"/);
  assert.match(landing,/:focus-visible/);
  assert.match(landing,/@media\(max-width:850px\)/);
  assert.doesNotMatch(landing,/<script\s+[^>]*src=/);
  assert.doesNotMatch(landing,/google-analytics|gtag\(|hotjar|mixpanel/i);
});

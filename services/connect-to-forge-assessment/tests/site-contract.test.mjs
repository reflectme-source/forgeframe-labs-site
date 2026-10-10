import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const en=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const pl=readFileSync(new URL("../pl/index.html",import.meta.url),"utf8");
const sample=readFileSync(new URL("../sample.html",import.meta.url),"utf8");
const origin="https://forgeframelabs.app/services/connect-to-forge-assessment/";
test("both live-language pages use the approved ForgeFrame domain",()=>{
 for(const page of [en,pl]){
  assert.ok(page.includes('href="'+origin), "canonical/hreflang target");
  assert.ok(!page.includes("reflectme-source.github.io"),"stale former primary domain");
 }
 assert.ok(en.includes('rel="canonical" href="'+origin+'"'));
 assert.ok(pl.includes('rel="canonical" href="'+origin+'pl/"'));
});
test("shared branding styles and stable shell are present, not a copied competitor design",()=>{
 for(const page of [en,pl]){
  assert.match(page,/class="ffg-header"/);
  assert.match(page,/class="ffg-footer"/);
  assert.match(page,/forgeframe-global\.css/);
  assert.match(page,/connect-theme\.css/);
  assert.match(page,/forgeframe-avatar\.png/);
  assert.match(page,/class="ffg-language"/);
 }
});
test("PL and EN links are reciprocal within existing service",()=>{
 assert.match(en,/href="\.\.\/\.\.\/services\/connect-to-forge-assessment\/pl\/"/);
 assert.match(pl,/href="\.\.\/\.\.\/\.\.\/services\/connect-to-forge-assessment\/"/);
 assert.match(en,/hreflang="pl"/);
 assert.match(pl,/hreflang="en"/);
});
test("pricing and availability are truthful, contact stays in shared ForgeFrame flow",()=>{
 for(const page of [en,pl]){
  assert.match(page,/490/);
  assert.doesNotMatch(page,/buy\.stripe\.com|paypal\.com\/checkout|checkout\.stripe\.com/i);
  assert.match(page,/product=connect-to-forge/);
  assert.doesNotMatch(page,/we have migrated hundreds|certified Atlassian partner/i);
 }
});
test("sample is explicitly synthetic rather than claimed client delivery",()=>{
 assert.match(sample,/Illustrative sample only/i);
 assert.match(sample,/noindex,nofollow/i);
 assert.doesNotMatch(sample,/production result verified|paid customer migration completed/i);
});
test("static service pages contain valid main landmarks and source-path relative assets",()=>{
 for(const page of [en,pl]){
  assert.equal([...page.matchAll(/<h1\b/g)].length,1);
  assert.match(page,/<main\s+id="main"/);
  assert.match(page,/<html\s+lang="(?:pl|en)"/);
  assert.match(page,/name="viewport"/);
 }
});
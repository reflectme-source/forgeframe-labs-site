import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join,dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {Script} from "node:vm";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(join(root,p),"utf8");
const intake=read("products/contract-guard-intake.html");
const landing=read("products/contract-guard.html");
const guide=read("guides/openapi-breaking-changes-github-actions.html");
const terms=read("terms.html");

test("Contract Guard customer journey requires written approval before payment",()=>{
  assert.match(landing,/href="\.\/contract-guard-intake\.html"/);
  assert.match(guide,/href="\.\.\/products\/contract-guard-intake\.html"/);
  assert.match(read("support.html"),/contract-guard-intake\.html/);
  assert.match(read("sitemap.xml"),/contract-guard-intake\.html/);
  assert.match(intake,/one GitHub repository/i);
  assert.match(terms,/unique Stripe-hosted payment link/i);
  assert.doesNotMatch(landing+intake+guide,/https:\/\/buy\.stripe\.com\//);
});
test("Scope request is local-only, validated and has usable copy/email fallbacks",()=>{
  assert.match(intake,/<form id="scope-form" novalidate>/);
  for(const id of ["email","company","country","repository","format","runner","spec-path","references","delivery","ack","notes"])
    assert.match(intake,new RegExp('id="'+id+'"'));
  assert.match(intake,/Opening your email application/);
  assert.match(intake,/press Send/);
  assert.match(intake,/navigator\.clipboard\.writeText/);
  assert.match(intake,/window\.open\(url/);
  assert.match(intake,/\.reportValidity\(\)/);
  assert.match(intake,/parsed\.hostname!==\x27github\.com\x27/);
  assert.doesNotMatch(intake,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|google-analytics|hotjar|mixpanel/);
});
test("Standalone intake script parses and form controls are labeled",()=>{
  const match=intake.match(/<script>([\s\S]+?)<\/script>/);
  assert.ok(match);
  assert.doesNotThrow(()=>new Script(match[1]));
  for(const [,id] of intake.matchAll(/<label\b[^>]*for="([^"]+)"/g))
    assert.match(intake,new RegExp('id="'+id+'"'));
  assert.match(intake,/role="status"/);
  assert.match(intake,/@media\(max-width:860px\)/);
});
test("One-repo service scope and client acceptance criteria are consistent",()=>{
  for(const p of [landing,guide,terms,intake])
    assert.doesNotMatch(p,/up to two repositories|two compatible repositories/);
  assert.match(terms,/one eligible GitHub repository/);
  assert.match(terms,/Completion and acceptance/);
  assert.match(intake,/No upfront payment/);
  assert.match(intake,/Customer country: /);
  assert.match(landing,/no public instant checkout/i);
  assert.match(landing,/unique one-order Stripe link/i);
});

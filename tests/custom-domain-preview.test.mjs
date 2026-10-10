import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const cli=resolve(root,"scripts","preview-custom-domain.mjs");
test("custom-domain migration preview is read-only and detects legacy URLs",()=>{
 const before=readFileSync(resolve(root,"sitemap.xml"),"utf8");
 const p=spawnSync(process.execPath,[cli,"forgeframelabs.app"],{cwd:root,encoding:"utf8",timeout:5000});
 assert.equal(p.status,0,p.stderr);
 const result=JSON.parse(p.stdout);
 assert.equal(result.preview_only,true);
 assert.equal(result.target,"https://forgeframelabs.app/");
 assert.ok(result.absolute_link_occurrences>=20);
 assert.ok(result.files.some(x=>x.file==="sitemap.xml"));
 assert.ok(result.files.some(x=>x.file==="index.html"));
 assert.ok(result.files.some(x=>x.file==="pl/kontakt.html"));
 assert.equal(readFileSync(resolve(root,"sitemap.xml"),"utf8"),before);
 assert.equal(existsSync(resolve(root,"CNAME")),false,"No CNAME before buyer owns domain");
});
test("reject invalid registration hostnames before any migration work",()=>{
 for(const value of ["../tmp/foo","https://forgeframelabs.app/","forgeframelabs.app/path",
                      "forgeframelabs.github.io","a..com"]){
  const p=spawnSync(process.execPath,[cli,value],{cwd:root,encoding:"utf8",timeout:5000});
  assert.equal(p.status,2,"Unexpectedly accepted "+value);
 }
});

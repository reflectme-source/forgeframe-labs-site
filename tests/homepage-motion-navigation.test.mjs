import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {join,relative} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=p=>readFileSync(join(root,p),"utf8");
const files=[];
function scan(dir){for(const d of readdirSync(dir,{withFileTypes:true})){if([".git","audit-local","node_modules"].includes(d.name))continue;const p=join(dir,d.name);if(d.isDirectory())scan(p);else if(d.name.endsWith(".html"))files.push(relative(root,p));}}
scan(root);
test("no Solutions item in shared navigation or footer",()=>{
 let checked=0;
 for(const p of files){const s=read(p);if(!s.includes("ffg-header"))continue;checked++;
  for(const section of s.matchAll(/<nav class="ffg-nav"[\s\S]*?<\/nav>|<nav class="ffg-footer-links"[\s\S]*?<\/nav>/g)){
   assert.doesNotMatch(section[0],/<a\b[^>]*>\s*(?:Rozwiązania|Solutions)\s*<\/a>/,p);
  }
 }
 assert.ok(checked>=30);
});
test("homepage proof strip removed and three product cards have full-surface links",()=>{
 for(const p of ["index.html","en/index.html"]){const s=read(p);
  assert.doesNotMatch(s,/ffshot-proofs|ffshot-proof"/);
  assert.equal((s.match(/class="ffshot-card-link"/g)||[]).length,3,p);
  assert.equal((s.match(/class="ffshot-card"/g)||[]).length,3,p);
 }
});
test("motion is respectful of reduced-motion preferences",()=>{
 const s=read("assets/forgeframe-screenshot.css");
 assert.match(s,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(s,/\.ffshot-card-link::after/);
 assert.match(s,/\.ffshot-card:focus-within/);
});

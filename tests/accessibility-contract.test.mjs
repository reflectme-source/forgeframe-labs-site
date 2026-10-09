import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join,resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pages=[
 "index.html","support.html","privacy.html",
 "products/localization-qa.html","tools/localization-qa.html",
 "tools/localization-qa-guide.html"
];

test("all public pages include accessible skip navigation",()=>{
 for(const path of pages) {
  const html=readFileSync(join(root,path),"utf-8");
  const label=path+" missing accessible skip or main landmark";
  assert.equal((html.match(/class="skip-link"/g)||[]).length,1,label);
  assert.match(html,/<a class="skip-link" href="#main-content">Skip to main content<\/a>/,label);
  assert.equal((html.match(/<main\b/g)||[]).length,1,label);
  assert.equal((html.match(/id="main-content"/g)||[]).length,1,label);
  assert.equal((html.match(/<\/main>/g)||[]).length,1,label);
  assert.match(html,/<html lang="en">/,label);
  assert.match(html,/<meta[^>]+viewport/,label);
 }
});

test("all pages load a real first-party keyboard and target stylesheet",()=>{
 const css=readFileSync(join(root,"assets/interaction.css"),"utf-8");
 assert.match(css,/\.skip-link:focus/);
 assert.match(css,/min-height:\s*44px/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion:\s*reduce/);
 for(const path of pages) {
  const html=readFileSync(join(root,path),"utf-8");
  const match=html.match(/<link rel="stylesheet" href="([^"]*interaction\.css)">/);
  assert.ok(match,path+" is not loading common stylesheet");
  assert.ok(existsSync(resolve(root,dirname(path),match[1])),path+" missing CSS asset");
 }
});

test("public skip targets do not depend on JS and are not hidden",()=>{
 const css=readFileSync(join(root,"assets/interaction.css"),"utf-8");
 assert.match(css,/\.skip-link\s*{/);
 assert.match(css,/transform:\s*translateY\(-160%\)/);
 assert.match(css,/\.skip-link:focus/);
 const skipRule=css.match(/\.skip-link\s*\{([^}]+)\}/)?.[1] ?? "";
 assert.doesNotMatch(skipRule,/\bdisplay:\s*none\b/);
});

test("primary site CTA and live product route remain unchanged",()=>{
 const main=readFileSync(join(root,"index.html"),"utf-8");
 assert.match(main,/href="\.\/tools\/localization-qa\.html"/);
 const tool=readFileSync(join(root,"tools/localization-qa.html"),"utf-8");
 assert.match(tool,/type="module" src="\.\/localization-qa\.mjs"/);
 assert.match(tool,/id="analyze"/);
 assert.match(tool,/id="sample"/);
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join,resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const page="products/vscode-localization-qa.html";
const html=readFileSync(join(root,page),"utf8");
const home=readFileSync(join(root,"index.html"),"utf8");
const sitemap=readFileSync(join(root,"sitemap.xml"),"utf8");
const all=[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(x=>x[1]);

test("public VS Code preview landing has working repository and release targets",()=>{
 assert.ok(all.includes("https://github.com/reflectme-source/forgeframe-localization-vscode/releases/tag/v0.1.0"));
 assert.ok(all.includes("https://github.com/reflectme-source/forgeframe-localization-vscode"));
 assert.match(html,/Download preview VSIX/);
 assert.match(html,/not yet listed in the Visual Studio Marketplace/);
});
test("landing links only to real local files and known external hosts",()=>{
 for(const ref of all){
   if(ref.startsWith("../")||ref.startsWith("./")){
     const target=resolve(root,dirname(page),decodeURIComponent(ref.split("#")[0].split("?")[0]));
     assert.ok(target.startsWith(root));
     assert.ok(existsSync(target),"missing link "+ref);
   }else if(ref.startsWith("http")){
     const url=new URL(ref);
     assert.ok(["github.com","reflectme-source.github.io"].includes(url.hostname),url.hostname);
     assert.equal(url.username,"");
     assert.equal(url.password,"");
   }
 }
});
test("home footer links to VS Code product preview",()=>{
 assert.match(home,/products\/vscode-localization-qa\.html/);
});
test("copy doesn't suggest unsupported live Marketplace distribution or revenue",()=>{
 assert.match(html,/early preview/);
 assert.match(html,/No file uploads/);
 assert.match(html,/validate results against your development CSV/i);
 assert.doesNotMatch(html,/available in the visual studio marketplace now|guaranteed|sold|revenue|buyer-paid|internal testing notes|owner gate/i);
});
test("page includes responsive layout, navigation and accessibility",()=>{
 assert.match(html,/<html lang="en">/);
 assert.match(html,/name="viewport"/);
 assert.match(html,/:focus-visible/);
 assert.match(html,/@media\(max-width:600px\)/);
 assert.match(html,/<main>/);
 assert.match(html,/rel="canonical"/);
});
test("structured metadata is machine-readable and release-linked",()=>{
 const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
 assert.ok(match);
 const data=JSON.parse(match[1]);
 assert.equal(data["@type"],"SoftwareApplication");
 assert.equal(data.offers.price,"0");
 assert.match(data.downloadUrl,/github\.com\/reflectme-source\/forgeframe-localization-vscode/);
});
test("sitemap lists all current public offering pages",()=>{
 for(const item of [
  "/products/vscode-localization-qa.html",
  "/solutions/otomoto-vehicle-monitoring.html",
  "/tools/localization-qa.html",
  "/products/localization-qa.html"
 ])assert.ok(sitemap.includes("https://reflectme-source.github.io/forgeframe-labs-site"+item));
 assert.ok(sitemap.includes("<urlset"));
});

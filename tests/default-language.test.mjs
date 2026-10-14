import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {join} from "node:path";
import vm from "node:vm";
const root=fileURLToPath(new URL("../",import.meta.url));
const read=path=>readFileSync(join(root,path),"utf8");
const script=read("assets/root-language.js");
function visit({host="https://forgeframelabs.app",prefix="/",search="",hash="",choice=null,storageBlocked=false}={}){
 let redirected=null;
 const scriptUrl=host+prefix+"assets/root-language.js";
 const location={pathname:prefix,search,hash,replace(url){redirected=url}};
 const sessionStorage={getItem(key){if(storageBlocked)throw Error("Blocked");return key==="ffg-site-locale"?choice:null}};
 vm.runInNewContext(script,{URL,URLSearchParams,document:{currentScript:{src:scriptUrl}},location,sessionStorage},{timeout:400});
 return redirected;
}
test("new visits to the domain root start in English",()=>{
 assert.equal(visit(),"https://forgeframelabs.app/en/");
 assert.equal(visit({search:"?product=general",hash:"#main"}),"https://forgeframelabs.app/en/?product=general#main");
});
test("explicit Polish choice keeps the Polish root without loops",()=>{
 assert.equal(visit({search:"?lang=pl"}),null);
 assert.equal(visit({choice:"pl"}),null);
 assert.equal(visit({search:"?lang=en",choice:"pl"}),"https://forgeframelabs.app/en/");
});
test("root redirect stays valid on the GitHub Pages project URL",()=>{
 assert.equal(visit({host:"https://reflectme-source.github.io",prefix:"/forgeframe-labs-site/"}),"https://reflectme-source.github.io/forgeframe-labs-site/en/");
});
test("Polish switch remains usable even when storage is disabled",()=>{
 assert.equal(visit({search:"?lang=pl",storageBlocked:true}),null);
 assert.match(read("en/index.html"),/lang="pl" href="\.\.\/\?lang=pl"/);
 assert.match(read("index.html"),/assets\/root-language\.js/);
 assert.match(read("assets/forgeframe-shell.js"),/sessionStorage\.setItem\("ffg-site-locale",chosen\)/);
});

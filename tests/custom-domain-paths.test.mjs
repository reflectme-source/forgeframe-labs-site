import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const js=readFileSync(resolve(root,"assets","direct-contact.js"),"utf8");

function makeElement(tag){
  return {
    tag,style:{},attributes:{},children:[],href:"",textContent:"",
    setAttribute(name,value){this.attributes[name]=value;},
    append(...items){this.children.push(...items);}
  };
}
function runOnHost({origin,basePath,path,lang}){
  const scriptURL=origin+basePath+"assets/direct-contact.js";
  let section=null;
  const footer={parentNode:{insertBefore(node){section=node;}}};
  const document={
    currentScript:{src:scriptURL},
    documentElement:{lang},
    createElement:makeElement,
    querySelector(selector){
      if(selector==="footer")return footer;
      if(selector==='[data-forgeframe-direct-contact]')return null;
      return null;
    },
    body:{append(node){section=node;}}
  };
  vm.runInNewContext(js,{document,location:{pathname:basePath+path},URL,encodeURIComponent},{timeout:400});
  if(!section)return [];
  const found=[];
  const walk=node=>{
    if(node.tag==="a")found.push({href:node.href,text:node.textContent});
    for(const child of node.children)walk(child);
  };
  walk(section);
  return found;
}
test("GitHub Pages project site keeps working before domain purchase",()=>{
  const a=runOnHost({
    origin:"https://reflectme-source.github.io",
    basePath:"/forgeframe-labs-site/",
    path:"services/merchant-issue-desk.html",lang:"pl"
  });
  assert.equal(a[0].href,"/forgeframe-labs-site/pl/kontakt.html?product=merchant-issue-desk");
  assert.match(a[1].href,/^mailto:forgeframe.lab@gmail.com/);
});
test("apex domain contact has no outdated GitHub project prefix",()=>{
  const a=runOnHost({
    origin:"https://forgeframelabs.app",basePath:"/",
    path:"services/merchant-issue-desk.html",lang:"pl"
  });
  assert.equal(a[0].href,"/pl/kontakt.html?product=merchant-issue-desk");
  assert.doesNotMatch(a[0].href,/forgeframe-labs-site/);
});
test("English product routes work on custom domain",()=>{
  const a=runOnHost({origin:"https://forgeframelabs.app",
    basePath:"/",path:"products/contract-guard.html",lang:"en"});
  assert.equal(a[0].href,"/contact/?product=contract-guard");
  assert.ok(a[1].href.includes("forgeframe.lab@gmail.com"));
});
test("form is not duplicated inside form page",()=>{
  const a=runOnHost({origin:"https://forgeframelabs.app",
    basePath:"/",path:"pl/kontakt.html",lang:"pl"});
  assert.equal(a.length,0);
});
test("another project-site prefix is resolved from script URL too",()=>{
  const a=runOnHost({origin:"https://reflectme-source.github.io",
    basePath:"/forgeframe-labs-site/",path:"guides/otomoto-price-monitoring.html",lang:"pl"});
  assert.equal(a[0].href,"/forgeframe-labs-site/pl/kontakt.html?product=otomoto");
});

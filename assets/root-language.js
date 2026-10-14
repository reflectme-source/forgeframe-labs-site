(()=>{"use strict";
const script=document.currentScript;
if(!script)return;
// Resolve relative to the script so both the custom domain and GitHub Pages preview work.
const base=new URL("../",script.src);
if(location.pathname!==base.pathname && location.pathname!==new URL("index.html",base).pathname)return;
const params=new URLSearchParams(location.search);
if(params.get("lang")==="pl")return;
if(params.get("lang")!=="en"){
 try{if(sessionStorage.getItem("ffg-site-locale")==="pl")return;}catch{}
}
params.delete("lang");
const target=new URL("en/",base);
target.search=params.toString();
target.hash=location.hash;
location.replace(target.href);
})();

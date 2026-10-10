(()=>{"use strict";
const form=document.querySelector('[data-forgeframe-contact]');
if(!form)return;
const products=new Map([
["general","ForgeFrame Labs"],
["merchant-issue-desk","Merchant Issue Desk"],
["contract-guard","ForgeFrame Contract Guard"],
["connect-to-forge","Connect to Forge assessment"],
["otomoto","OTOMOTO Change Intelligence"],
["localization-qa","Localization QA Inspector"],
["api-integration","API integration"],
["roblox","Roblox Creator tools"],
["unity","Unity assets"],
["jetbrains","JetBrains MV3 Inspector"],
["shopify","Shopify workflows"],
["other","Other ForgeFrame product"]]);
const params=new URLSearchParams(location.search);
const requested=(params.get("product")||"general").trim().toLowerCase();
const product=products.has(requested)?requested:"general";
const select=form.elements.namedItem("product");
if(select&&Array.from(select.options).some(o=>o.value===product))select.value=product;
const src=form.elements.namedItem("source_page");
const value=(params.get("source")||"").trim();
if(src)src.value=/^[a-z0-9_./-]{1,80}$/i.test(value)?value:"";
const output=document.querySelector("[data-copy-status]");
document.querySelectorAll("[data-copy-email]").forEach(button=>button.addEventListener("click",async()=>{
 const address="forgeframe.lab@gmail.com";
 try{if(!navigator.clipboard?.writeText)throw new Error("Clipboard unavailable");await navigator.clipboard.writeText(address);
 if(output)output.textContent=document.documentElement.lang==="pl"?"Adres skopiowany":"Address copied";
 }catch{if(output)output.textContent=document.documentElement.lang==="pl"?"Zaznacz i skopiuj adres wyświetlony powyżej":"Select and copy the email shown above";}
}));
form.addEventListener("submit",event=>{
 const email=form.elements.namedItem("email"),message=form.elements.namedItem("message");
 if((email?.value||"").length>180||(message?.value||"").length>2000){
  event.preventDefault();
  const invalid=(message?.value||"").length>2000?message:email;
  invalid?.setCustomValidity(document.documentElement.lang==="pl"?"Przekroczono maksymalną długość":"Maximum length exceeded");
  invalid?.reportValidity();
 }
});
form.querySelectorAll("input,textarea").forEach(el=>el.addEventListener("input",()=>el.setCustomValidity("")));
})();

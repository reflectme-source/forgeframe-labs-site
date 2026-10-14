(()=>{"use strict";
const form=document.querySelector('[data-forgeframe-contact]');
if(!form)return;
const products=new Map([
["general","ForgeFrame Labs"],
["websites","ForgeFrame / Websites"],
["merchant-issue-desk","Merchant Issue Desk"],
["contract-guard","ForgeFrame Contract Guard"],
["connect-to-forge","Connect to Forge assessment"],
["otomoto","OTOMOTO Change Intelligence"],
["localization-qa","Localization QA Inspector"],
["digital-packager","ForgeFrame Digital Packager"],
["api-integration","API integration"],
["roblox","Roblox Creator tools"],
["unity","Unity assets"],
["jetbrains","JetBrains MV3 Inspector"],
["shopify","Shopify workflows"],
["digital-packager","Digital Packager"],
["originduty","OriginDuty"],
["other","Other ForgeFrame product"]]);
const params=new URLSearchParams(location.search);
const requested=(params.get("product")||"general").trim().toLowerCase();
const product=products.has(requested)?requested:"general";
const select=form.elements.namedItem("product");
if(select&&Array.from(select.options).some(o=>o.value===product))select.value=product;
const src=form.elements.namedItem("source_page");
const value=(params.get("source")||"").trim();
if(src)src.value=/^[a-z0-9_./-]{1,80}$/i.test(value)?value:"";
const packageFromUrl=(params.get("package")||"").trim().toLowerCase();
const allowedPackages=new Map([["starter","Starter"],["business","Business"],["custom","Custom"]]);
const packageSelect=form.elements.namedItem("service_package");
const packageBadge=document.querySelector("[data-websites-package]");
const isWebsites=product==="websites" && select?.value==="websites";
if(packageSelect)packageSelect.value=isWebsites&&allowedPackages.has(packageFromUrl)?allowedPackages.get(packageFromUrl):"";
const subject=form.elements.namedItem("_subject");
const defaultSubject=subject?.value||"ForgeFrame Labs | Website contact inquiry";
if(subject&&isWebsites)subject.value="ForgeFrame Labs | Websites quote inquiry";
function syncWebsitesSelection(){
 const current=select?.value==="websites";
 if(!current&&packageSelect)packageSelect.value="";
 if(packageBadge){
  packageBadge.hidden=!(current&&packageSelect?.value);
  if(current&&packageSelect?.value){
   packageBadge.textContent=document.documentElement.lang==="pl"?"Wybrany pakiet: "+packageSelect.value+" · bezpłatna wycena":"Selected package: "+packageSelect.value+" · free estimate";
  }
 }
 if(subject)subject.value=current?"ForgeFrame Labs | Websites quote inquiry":defaultSubject;
}
select?.addEventListener("change",syncWebsitesSelection);
if(packageBadge&&isWebsites&&packageSelect?.value){
 packageBadge.hidden=false;
 packageBadge.textContent=document.documentElement.lang==="pl"?"Wybrany pakiet: "+packageSelect.value+" · bezpłatna wycena, bez zobowiązania":"Selected package: "+packageSelect.value+" · free estimate, no obligation";
}
document.querySelectorAll("[data-copy-email]").forEach(button=>button.addEventListener("click",async()=>{
 const address=button.getAttribute("data-copy-email");
 const output=button.parentElement.querySelector("[data-copy-status]");
 if(!address)return;
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

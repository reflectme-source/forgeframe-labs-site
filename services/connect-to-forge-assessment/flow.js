"use strict";
/* Public no-data scope preflight. Payment is disabled until server-side release gates pass. */
export const STANDARD_EUR_CENTS=49000;
export function classifyScope(s){
 const reasons=[];
 if(!s||typeof s!=="object"||Array.isArray(s))return {eligible:false,reasons:["invalid_scope"]};
 if(s.ownsApp!==true)reasons.push("authority");
 if(s.privateApp!==true)reasons.push("private");
 if(!["jira","confluence"].includes(s.platform))reasons.push("platform");
 if(s.appCount!==1)reasons.push("app_count");
 if(!Number.isSafeInteger(s.moduleCount)||s.moduleCount<1||s.moduleCount>10)reasons.push("module_count");
 if(!Number.isSafeInteger(s.backendCount)||s.backendCount<0||s.backendCount>1)reasons.push("backend_count");
 if(s.dataMigration===true)reasons.push("data_migration");
 if(s.productionDeployment===true)reasons.push("deployment");
 if(s.tenantProductionAccess===true)reasons.push("production_access");
 return {eligible:reasons.length===0,reasons,amountCents:reasons.length===0?STANDARD_EUR_CENTS:null,currency:"EUR"};
}
const copy={
 en:{
  ok:"Your app fits the standard assessment scope",
  no:"A custom scope is required",
  price:"Indicative one-time assessment: €490. Applicable tax and final contract terms must be reviewed before payment.",
  custom:"We can assess larger applications separately. No call or credential sharing is needed for an initial enquiry.",
  closed:"Online purchase is being prepared and is not available yet. This page does not collect payments.",
  contact:"Request a custom written assessment",pay:"Secure checkout — pending release",
  request:"Request a written quote",authorityTitle:"Buyer authorization required",
  authorityText:"Ask the owner or an authorized representative to commission the assessment. We cannot accept an order without their authority.",
  required:"Complete all required details before checking scope.",
  error:"Unable to check the scope."
 },
 pl:{
  ok:"Aplikacja mieści się w standardowym zakresie audytu",
  no:"Potrzebna jest indywidualna wycena",
  price:"Orientacyjna cena jednorazowego audytu: 490 EUR. Przed płatnością trzeba ustalić podatki i warunki umowy.",
  custom:"Większe aplikacje wyceniamy oddzielnie. Na początek nie jest potrzebna rozmowa ani przesyłanie haseł.",
  closed:"Zakup internetowy jest przygotowywany i nie jest jeszcze aktywny. Ta strona nie pobiera opłat.",
  contact:"Poproś o indywidualną ofertę pisemną",pay:"Bezpieczny Checkout — przed uruchomieniem",
  request:"Poproś o pisemną wycenę",authorityTitle:"Wymagane uprawnienie do zamówienia",
  authorityText:"Poproś właściciela aplikacji lub uprawnionego przedstawiciela o zlecenie audytu. Nie możemy przyjąć zamówienia bez takich uprawnień.",
  required:"Uzupełnij wszystkie wymagane dane.",error:"Nie udało się sprawdzić zakresu."
 }
};
const reasonsText={
 en:{
  authority:"Buyer authority is required.",private:"Only private/custom Connect apps qualify.",
  platform:"Only Jira and Confluence are covered.",app_count:"Only one app qualifies.",
  module_count:"The standard limit is 1–10 Connect module instances.",
  backend_count:"The standard limit is one backend.",
  data_migration:"Data conversion is a separate service.",
  deployment:"Production deployment is excluded.",production_access:"No production access is accepted.",
  invalid_scope:"Invalid scope."
 },
 pl:{
  authority:"Wymagane są uprawnienia do zlecenia audytu.",private:"Oferta obejmuje wyłącznie aplikacje prywatne.",
  platform:"Obsługujemy Jira i Confluence.",app_count:"Standard obejmuje jedną aplikację.",
  module_count:"Limit standardowy to 1–10 instancji modułów Connect.",
  backend_count:"Limit standardowy to jeden backend.",
  data_migration:"Konwersja danych to osobne zlecenie.",
  deployment:"Wdrożenie produkcyjne nie jest objęte ofertą.",
  production_access:"Nie przyjmujemy dostępu produkcyjnego.",invalid_scope:"Nieprawidłowy zakres."
 }
};
export function wirePreflight(root=document){
 const form=root.querySelector("#scope-form"),output=root.querySelector("#scope-result");
 if(!form||!output)return;
 const lang=root.documentElement?.lang==="pl"?"pl":"en", t=copy[lang];
 const quoteUrl=lang==="pl"?"https://forgeframelabs.app/pl/kontakt.html?product=connect-to-forge":"https://forgeframelabs.app/contact/?product=connect-to-forge";
 form.addEventListener("submit",event=>{
  event.preventDefault();output.hidden=false;output.replaceChildren();
  output.dataset.status="pending";
  const data=new FormData(form);
  if(!["jira","confluence"].includes(data.get("platform"))||data.get("moduleCount")===""||data.get("backendCount")===""){
   output.dataset.status="error";
   const p=root.createElement("p");p.setAttribute?.("role","alert");
   p.textContent=t.required;output.append(p);output.focus?.({preventScroll:true});return;
  }
  const result=classifyScope({
   platform:data.get("platform"),ownsApp:data.get("ownsApp")==="yes",
   privateApp:data.get("privateApp")==="yes",appCount:1,
   moduleCount:Number(data.get("moduleCount")),backendCount:Number(data.get("backendCount")),
   dataMigration:data.get("dataMigration")==="yes",
   productionDeployment:data.get("productionDeployment")==="yes",
   tenantProductionAccess:false
  });
  const noAuthority=result.reasons.includes("authority");
  output.dataset.status=noAuthority?"blocked":result.eligible?"eligible":"custom";
  const heading=root.createElement("h2");
  heading.textContent=noAuthority?t.authorityTitle:result.eligible?t.ok:t.no;
  output.append(heading);
  const info=root.createElement("p");
  info.textContent=noAuthority?t.authorityText:result.eligible?t.price:t.custom;
  output.append(info);
  if(result.eligible){
   const notice=root.createElement("p");notice.className="ff-notice";notice.textContent=t.closed;
   output.append(notice);
   const alternative=root.createElement("a");alternative.className="ff-button ff-action";
   alternative.href=quoteUrl;alternative.textContent=t.request;output.append(alternative);
  }else if(!noAuthority){
   const ul=root.createElement("ul");
   for(const reason of result.reasons){
    const li=root.createElement("li");li.textContent=reasonsText[lang][reason];ul.append(li);
   }
   output.append(ul);
   const a=root.createElement("a");a.href=quoteUrl;
   a.className="ff-button";a.textContent=t.contact;output.append(a);
  }
  output.focus?.({preventScroll:true});
  output.scrollIntoView?.({block:"nearest",behavior:"auto"});
 });
 // Only enable form submission once the local-only handler exists.
 form.inert=false;
}
if(typeof document!=="undefined")wirePreflight(document);

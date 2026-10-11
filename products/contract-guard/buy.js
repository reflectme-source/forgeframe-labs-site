(() => {
'use strict';
const api='https://contract-guard-api-production-e4a2.up.railway.app';
const lang=document.documentElement.lang==='pl'?'pl':'en';
const pl=lang==='pl';
const $=id=>document.getElementById(id);
const countryCodes='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
function populateCountrySelect(){
 const select=$('buyer-country');if(!select||typeof Intl.DisplayNames!=='function')return;
 const selected=select.value,regions=new Intl.DisplayNames([lang],{type:'region'});
 const options=[new Option(pl?'Wybierz kraj':'Choose a country','')];
 for(const code of countryCodes){try{options.push(new Option(regions.of(code)||code,code));}catch{options.push(new Option(code,code));}}
 select.replaceChildren(...options);select.value=selected;
}
populateCountrySelect();
const msg=(text,state='info')=>{const el=$('buy-message');el.hidden=false;el.dataset.state=state;el.textContent=text;};
const words={
 checking:pl?'Sprawdzam publiczne repozytorium i specyfikację OpenAPI…':'Checking the public repository and OpenAPI specification…',
 unsupported:pl?'To repozytorium nie spełnia warunków zakupu automatycznego. Możesz skorzystać z darmowej Action lub opisać niestandardową konfigurację w formularzu pomocy. Nie pobrano płatności.':'This repository is not supported by automatic checkout. You can use the free Action or request help for a custom environment. No payment has been taken.',
 ready:pl?'Repozytorium zostało sprawdzone. Wybierz, w jaki sposób kupujesz.':'Repository verified. Choose how you are buying.',
 closed:pl?'Płatność firmowa jest chwilowo wyłączona do zakończenia kontroli podatków i transakcji. Żadna płatność nie została pobrana.':'Business checkout is temporarily disabled while tax and transaction checks are completed. No payment has been taken.',
 personalUnavailable:pl?'Zakup prywatny dla tego kraju nie jest jeszcze włączony. Sprawdzenie repozytorium jest darmowe; nie pobieramy płatności.':'Personal checkout is not enabled for this billing country yet. Repository checks are free; no payment will be taken.',
 issue:pl?'Nie udało się teraz połączyć z usługą. Spróbuj ponownie — żadna płatność nie została pobrana.':'We could not reach the service. Retry; no payment has been taken.',
 processing:pl?'Przygotowuję bezpieczny Stripe Checkout…':'Preparing secure Stripe Checkout…',
 selectBuyer:pl?'Wybierz, czy kupujesz prywatnie, czy w imieniu firmy.':'Choose whether you are buying as an individual or a business.',
 businessAvailable:pl?'Zakup firmowy jest dostępny dla tego kraju. Należny podatek zostanie pokazany w Stripe Checkout.':'Business checkout is available for this country. Any applicable tax is shown in Stripe Checkout.',
 personalAvailable:pl?'Zakup prywatny jest dostępny dla tego kraju. Końcowa cena z podatkiem jest pokazywana przed płatnością.':'Personal checkout is available for this country. The final price including applicable tax is shown before payment.'
};
let assessment=null;
let availabilityByType={business:false,individual:false};
let lastAvailabilityCountry='';
const buyerType=()=>document.querySelector('input[name="buyer-type"]:checked')?.value||'';
const stringify=v=>String(v??'');
async function post(path,body) {
 let result;
 try{result=await fetch(api+path,{method:'POST',mode:'cors',headers:{'content-type':'application/json'},body:JSON.stringify(body),cache:'no-store'});}
 catch{throw new Error(words.issue);}
 const data=await result.json().catch(()=>({}));
 if(!result.ok){const error=new Error(data.reason||data.error||words.issue);error.status=result.status;throw error;}
 return data;
}
const check=$('eligibility-form'),purchase=$('purchase-form'),checkBtn=$('check-btn'),payBtn=$('pay-btn');
function showAvailabilityMessage(){
 const type=buyerType(),country=$('buyer-country').value;
 let message=words.selectBuyer,state='info';
 if(type==='business'&&!availabilityByType.business)message=words.closed;
 if(type==='individual'&&!availabilityByType.individual)message=words.personalUnavailable;
 if(type&&availabilityByType[type]){message=type==='business'?words.businessAvailable:words.personalAvailable;state='ok';}
 $('availability-message').textContent=message;
 $('availability-message').dataset.state=state;
}
async function refreshAvailability(){
 const country=$('buyer-country').value.trim().toUpperCase();
 if(country===lastAvailabilityCountry&&lastAvailabilityCountry!=='') {showAvailabilityMessage();updatePay();return;}
 lastAvailabilityCountry=country;
 try{
  const r=await fetch(api+'/v1/contract-guard/availability?country='+encodeURIComponent(country),{cache:'no-store'});
  if(!r.ok)throw new Error();
  const data=await r.json();
  availabilityByType={business:Boolean(data.buyer_types?.business?.available),individual:Boolean(data.buyer_types?.individual?.available)};
 }catch{availabilityByType={business:false,individual:false};}
 showAvailabilityMessage();updatePay();
}
function setEnabled(id,enabled,required){
 const node=$(id);if(!node)return;node.disabled=!enabled;if(required!==undefined)node.required=Boolean(enabled&&required);
}
function updateBuyerFields(){
 const type=buyerType(),selected=Boolean(type),business=type==='business',individual=type==='individual';
 $('buyer-details').hidden=!selected;
 $('consumer-terms-wrap').hidden=!individual;
 $('buyer-company-wrap').hidden=!business;
 $('consumer-assertion').hidden=!individual;
 for(const id of ['buyer-name','buyer-email','buyer-country'])setEnabled(id,selected,true);
 setEnabled('buyer-company',business,true);
 setEnabled('business-purchase',business,true);
 setEnabled('consumer-purchase',individual,true);
 setEnabled('consumer-terms',individual,true);
 setEnabled('withdrawal-notice',individual,true);
 showAvailabilityMessage();updatePay();
 if(selected)refreshAvailability();
}
function updatePay(){
 const type=buyerType();
 // Payment stays blocked until the backend approves this buyer type and billing country.
 payBtn.disabled=!assessment||!type||!availabilityByType[type];
}
document.querySelectorAll('input[name="buyer-type"]').forEach(node=>node.addEventListener('change',updateBuyerFields));
$('buyer-country').addEventListener('change',()=>{lastAvailabilityCountry='';refreshAvailability();});

check.addEventListener('submit',async ev=>{
 ev.preventDefault();if(!check.reportValidity())return;
 checkBtn.disabled=true;assessment=null;purchase.hidden=true;$('purchase-form-wrap').hidden=true;updatePay();msg(words.checking);
 try{
  const data=await post('/v1/contract-guard/eligibility',{
   repository:$('repository').value.trim(),specPath:$('spec-path').value.trim(),
   runner:'github-hosted-linux-x64',singleBundledSpec:$('bundled').checked,canAuthorizeRepo:$('can-authorize').checked
  });
  if(!data.eligible){msg((data.reason||words.unsupported)+' '+words.unsupported,'error');return;}
  assessment=data.assessment_token;
  $('verified-repo').textContent=stringify(data.scope.repository);
  $('verified-spec').textContent=stringify(data.scope.specPath);
  $('verified-version').textContent=stringify(data.scope.openapiVersion);
  availabilityByType={business:Boolean(data.buyer_types?.business?.available),individual:false};
  lastAvailabilityCountry='';
  purchase.hidden=false;$('purchase-form-wrap').hidden=false;msg(words.ready,'ok');
  updateBuyerFields();
  purchase.scrollIntoView({behavior:'smooth',block:'start'});
 }catch(e){msg(e.message||words.issue,'error');}
 finally{checkBtn.disabled=false;}
});
purchase.addEventListener('submit',async ev=>{
 ev.preventDefault();if(!purchase.reportValidity()||!assessment)return;
 const type=buyerType();
 await refreshAvailability();
 if(!availabilityByType[type]){showAvailabilityMessage();msg(type==='individual'?words.personalUnavailable:words.closed,'error');return;}
 payBtn.disabled=true;msg(words.processing);
 try{
  const data=await post('/v1/contract-guard/checkout',{
   assessment_token:assessment,buyerType:type,customerName:$('buyer-name').value.trim(),email:$('buyer-email').value.trim(),
   company:type==='business'?$('buyer-company').value.trim():'',country:$('buyer-country').value.trim().toUpperCase(),locale:lang,
   businessPurchaseAccepted:type==='business'&&$('business-purchase').checked,
   consumerPurchaseAccepted:type==='individual'&&$('consumer-purchase').checked,
   consumerTermsAccepted:type==='individual'&&$('consumer-terms').checked,
   withdrawalNoticeAccepted:type==='individual'&&$('withdrawal-notice').checked,
   termsAccepted:$('terms').checked,privacyAccepted:$('privacy').checked,serviceScopeAccepted:$('scope-agree').checked
  });
  const next=new URL(data.checkout_url);
  if(next.protocol!=='https:'||next.hostname!=='checkout.stripe.com')throw new Error(words.issue);
  sessionStorage.setItem('cg_customer_order',JSON.stringify({id:data.order_id,token:data.order_access_token,createdAt:Date.now()}));
  window.location.assign(data.checkout_url);
 }catch(e){
  if(e.status===503)msg(type==='individual'?words.personalUnavailable:words.closed,'error');
  else msg(e.message||words.issue,'error');
  payBtn.disabled=true;
 }
});
updateBuyerFields();
refreshAvailability();
})();
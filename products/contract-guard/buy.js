(() => {
'use strict';
const api='https://contract-guard-api-production-e4a2.up.railway.app';
const lang=document.documentElement.lang==='pl'?'pl':'en';
const pl=lang==='pl';
const $=id=>document.getElementById(id);
const msg=(text,state='info')=>{const el=$('buy-message');el.hidden=false;el.dataset.state=state;el.textContent=text;};
const words={
  checking:pl?'Sprawdzam publiczne repozytorium i specyfikację OpenAPI…':'Checking the public repository and OpenAPI specification…',
  unsupported:pl?'To repozytorium nie spełnia warunków zakupu automatycznego. Możesz skorzystać z darmowej Action lub opisać niestandardową konfigurację w formularzu pomocy. Nie pobrano płatności.':'This repository is not supported by automatic checkout. You can use the free Action or request help for a custom environment. No payment has been taken.',
  ready:pl?'Repozytorium zostało sprawdzone. Możesz uzupełnić dane zakupu.':'Repository verified. Complete the purchase details.',
  closed:pl?'Automatyczny Checkout jest obecnie w trakcie certyfikacji. Możesz sprawdzić repozytorium bez płacenia.':'Self-service Checkout is completing certification. You can verify the repository without paying.',
  issue:pl?'Nie udało się teraz połączyć z usługą. Spróbuj ponownie — żadna płatność nie została pobrana.':'We could not reach the service. Retry; no payment has been taken.',
  processing:pl?'Przygotowuję bezpieczny Stripe Checkout…':'Preparing secure Stripe Checkout…',
  payUnavailable:pl?'Płatności internetowe nie są jeszcze otwarte. Twoja kwalifikacja nie stanowi zamówienia.':'Online payment is not open yet. Eligibility does not create an order.'
};
let assessment=null,opened=false;
const stringify=v=>String(v??'');
async function post(path,body) {
  let result;
  try {result=await fetch(api+path,{method:'POST',mode:'cors',headers:{'content-type':'application/json'},body:JSON.stringify(body),cache:'no-store'});}
  catch {throw new Error(words.issue);}
  const data=await result.json().catch(()=>({}));
  if(!result.ok)throw new Error(data.reason||data.error||words.issue);
  return data;
}
const check=$('eligibility-form'),purchase=$('purchase-form'),checkBtn=$('check-btn'),payBtn=$('pay-btn');
async function availability() {
  try {
    const r=await fetch(api+'/v1/contract-guard/availability',{cache:'no-store'});
    const data=await r.json();opened=Boolean(data.checkout_available);
    $('availability-message').textContent=opened?(pl?'Weryfikacja i zakup samoobsługowy dostępne.':'Self-service verification and checkout available.'):words.closed;
    $('availability-message').dataset.state=opened?'ok':'info';
  }catch{$('availability-message').textContent=words.issue;opened=false;}
  updatePay();
}
function updatePay(){payBtn.disabled=!opened||!assessment;}
check.addEventListener('submit',async ev=>{
  ev.preventDefault();
  if(!check.reportValidity())return;
  checkBtn.disabled=true;assessment=null;purchase.hidden=true;$('purchase-form-wrap').hidden=true;updatePay();msg(words.checking);
  try {
    const data=await post('/v1/contract-guard/eligibility',{
      repository:$('repository').value.trim(),specPath:$('spec-path').value.trim(),
      runner:'github-hosted-linux-x64',singleBundledSpec:$('bundled').checked,canAuthorizeRepo:$('can-authorize').checked
    });
    if(!data.eligible){msg((data.reason||words.unsupported)+' '+words.unsupported,'error');return;}
    assessment=data.assessment_token;
    $('verified-repo').textContent=stringify(data.scope.repository);
    $('verified-spec').textContent=stringify(data.scope.specPath);
    $('verified-version').textContent=stringify(data.scope.openapiVersion);
    purchase.hidden=false;$('purchase-form-wrap').hidden=false;msg(words.ready,'ok');
    opened=Boolean(data.checkout_available);
    updatePay();
    purchase.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){msg(e.message||words.issue,'error');}
  finally{checkBtn.disabled=false;}
});
purchase.addEventListener('submit',async ev=>{
  ev.preventDefault();if(!purchase.reportValidity()||!assessment)return;
  if(!opened){msg(words.payUnavailable,'error');return;}
  payBtn.disabled=true;msg(words.processing);
  try{
    const data=await post('/v1/contract-guard/checkout',{
      assessment_token:assessment,email:$('buyer-email').value.trim(),company:$('buyer-company').value.trim(),
      country:$('buyer-country').value.trim().toUpperCase(),locale:lang,termsAccepted:$('terms').checked,
      privacyAccepted:$('privacy').checked,serviceScopeAccepted:$('scope-agree').checked
    });
    const next=new URL(data.checkout_url);
    if(next.protocol!=='https:'||next.hostname!=='checkout.stripe.com')throw new Error(words.issue);
    const order={id:data.order_id,token:data.order_access_token,createdAt:Date.now()};
    sessionStorage.setItem('cg_customer_order',JSON.stringify(order));
    window.location.assign(data.checkout_url);
  }catch(e){msg(e.message||words.issue,'error');payBtn.disabled=false;}
});
availability();
})();

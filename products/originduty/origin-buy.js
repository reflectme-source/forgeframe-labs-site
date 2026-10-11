// Production fail-closed activation for OriginDuty self-service checkout.
// Never display a buy CTA unless the application explicitly reports readiness.
(async()=>{
 const buyLinks=[...document.querySelectorAll('[data-od-buy]')];
 if(!buyLinks.length)return;
 try{
  const response=await fetch('https://originduty-app.forgeframelabs.app/api/signup/status',{
   mode:'cors',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(6500)
  });
  if(!response.ok)return;
  const status=await response.json();
  const locale=document.documentElement.lang==='en'?'en':'pl';
  if(status.available!==true||!status.terms_version||!status.terms_url)return;
  if(!Array.isArray(status.supported_locales)||!status.supported_locales.includes(locale))return;
  for(const a of buyLinks)a.hidden=false;
  for(const a of document.querySelectorAll('[data-od-contact-fallback]'))a.hidden=true;
  for(const note of document.querySelectorAll('[data-od-buy-note]')){
   note.textContent=document.documentElement.lang==='en'
    ?'Secure self-service sign-up and Stripe checkout. Access is granted only after subscription confirmation.'
    :'Samodzielna rejestracja i bezpieczna płatność Stripe. Dostęp po potwierdzeniu subskrypcji.';
  }
 }catch{
  // No domain, TLS, CORS or backend readiness: keep all buy buttons hidden.
 }
})();

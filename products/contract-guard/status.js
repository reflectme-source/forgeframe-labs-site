(() => {
'use strict';
const pl=document.documentElement.lang==='pl';
const api='https://contract-guard-api-production-e4a2.up.railway.app';
const el=id=>document.getElementById(id);
const labels={
 OFFER_ACCEPTED:pl?'Zamówienie rozpoczęte':'Order started',
 PAYMENT_PENDING:pl?'Oczekujemy na potwierdzenie Stripe':'Awaiting Stripe confirmation',
 PAID:pl?'Płatność potwierdzona — dostęp do repozytorium':'Paid — repository access required',
 IMPLEMENTING:pl?'Trwa przygotowanie pull requesta':'Implementation pull request in progress',
 DELIVERED:pl?'Wdrożenie gotowe do przeglądu':'Delivery ready for review',
 ACCEPTED:pl?'Zamówienie zaakceptowane':'Accepted by customer',
 CLOSED:pl?'Zamówienie zakończone':'Order completed',
 EXPIRED:pl?'Sesja wygasła bez płatności':'Checkout expired without payment'
};
const fallback=pl?'Nie znaleziono zamówienia. Wprowadź numer i prywatny kod dostępu poniżej.':'Order not found in this browser. Enter your order reference and private access code below.';
const key='cg_customer_order';
const status=(s,kind='info')=>{el('order-result').textContent=s;el('order-result').dataset.state=kind;};
let running=false;
function stored(){
 try{const item=JSON.parse(sessionStorage.getItem(key)||'null');if(item&&/^[a-f0-9-]{36}$/i.test(item.id)&&typeof item.token==='string'&&item.token.length>=25&&item.token.length<=90)return item;}catch{}
 return null;
}
async function refresh(){
 if(running)return;
 const order=stored();
 if(!order){status(fallback);el('copy-order').hidden=true;return;}
 running=true;
 el('order-refresh').disabled=true;
 status(pl?'Pobieram aktualny status zamówienia…':'Fetching current order status…');
 try {
  const r=await fetch(api+'/v1/contract-guard/status',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({orderId:order.id,accessToken:order.token}),cache:'no-store'});
  const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error('Status unavailable');
  el('order-reference').textContent=body.order_id;
  el('order-stage').textContent=labels[body.stage]||body.stage;
  el('order-access').hidden=!body.paid||!['PAID','IMPLEMENTING'].includes(body.stage);
  el('copy-order').hidden=false;
  el('restore-order').value=order.id;
  if(body.risk_hold)status(pl?'Płatność wymaga weryfikacji. Realizacja jest wstrzymana.':'Payment requires review; fulfillment is on hold.','error');
  else if(body.paid)status(pl?'Stripe potwierdził zapłatę. Status realizacji możesz sprawdzać tutaj, bez korespondencji e-mail.':'Stripe confirmed payment. Track fulfillment here without progress emails.','ok');
  else status(pl?'Płatność nie została jeszcze potwierdzona. Sam powrót ze Stripe nie oznacza zapłaty.':'Payment is not yet confirmed. A redirect from Stripe is not proof of payment.');
  for(const [name,url] of [['pr-link',body.pr_url],['safe-link',body.safe_ci_url],['breaking-link',body.breaking_ci_url]]){
   const node=el(name);node.removeAttribute('href');node.hidden=true;
   try{const u=new URL(url);if(u.protocol==='https:'&&u.hostname==='github.com'){node.href=u.href;node.hidden=false;}}catch{}
  }
 }catch{
  status(pl?'Nie udało się odświeżyć zamówienia. Sprawdź kod i spróbuj ponownie.':'Could not refresh the order. Check your access code and retry.','error');
 }finally{running=false;el('order-refresh').disabled=false;}
}
el('restore-form').addEventListener('submit',ev=>{
 ev.preventDefault();if(!ev.currentTarget.reportValidity())return;
 const id=el('restore-order').value.trim().toLowerCase(),token=el('restore-token').value.trim();
 if(!/^[a-f0-9-]{36}$/.test(id)||!/^[a-zA-Z0-9_-]{25,90}$/.test(token)){status(pl?'Nieprawidłowy numer lub kod dostępu.':'Invalid order number or access code.','error');return;}
 try{sessionStorage.setItem(key,JSON.stringify({id,token,createdAt:Date.now()}));el('restore-token').value='';refresh();}
 catch{status(pl?'Przeglądarka blokuje zapis sesji; sprawdź ustawienia prywatności.':'Your browser blocks session storage. Check privacy settings.','error');}
});
el('copy-order').addEventListener('click',async()=>{
 const item=stored();if(!item)return;
 try{
  await navigator.clipboard.writeText((pl?'Numer zamówienia: ':'Order reference: ')+item.id+'\n'+(pl?'Kod dostępu: ':'Access code: ')+item.token);
  status(pl?'Skopiowano numer zamówienia i prywatny kod. Zapisz je w bezpiecznym miejscu.':'Order reference and private access code copied. Store them securely.','ok');
 }catch{status(pl?'Kopiowanie jest niedostępne. Skorzystaj z formularza poniżej.':'Clipboard unavailable. Use the recovery form below.','error');}
});
el('order-refresh').addEventListener('click',refresh);
refresh();
})();
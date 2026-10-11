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
function status(s,kind='info'){el('order-result').textContent=s;el('order-result').dataset.state=kind;}
async function refresh(){
 const raw=sessionStorage.getItem('cg_customer_order');
 if(!raw){status(pl?'Nie znaleziono zamówienia na tym urządzeniu. Jeśli kupiłeś na innym urządzeniu, skontaktuj się z pomocą i podaj numer zamówienia.':'No order was found on this device. If you purchased on another device, contact support with your order reference.');return;}
 let order;try{order=JSON.parse(raw);}catch{status(pl?'Nieprawidłowe dane zamówienia.':'Invalid order reference.','error');return;}
 status(pl?'Pobieram aktualny status zamówienia…':'Fetching current order status…');
 try{
   const r=await fetch(api+'/v1/contract-guard/status',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({orderId:order.id,accessToken:order.token}),cache:'no-store'});
   const body=await r.json();if(!r.ok)throw Error(body.error||'Status unavailable');
   el('order-reference').textContent=body.order_id;
   el('order-stage').textContent=labels[body.stage]||body.stage;
   el('order-access').hidden=!body.paid||!['PAID','IMPLEMENTING'].includes(body.stage);
   if(body.risk_hold)status(pl?'Płatność wymaga weryfikacji. Realizacja jest wstrzymana.':'Payment requires review; fulfillment is on hold.','error');
   else if(body.paid)status(pl?'Stripe potwierdził zapłatę. Status realizacji możesz sprawdzać tutaj, bez korespondencji e-mail.':'Stripe has confirmed your payment. Track fulfillment here without writing emails.','ok');
   else status(pl?'Płatność nie jest jeszcze potwierdzona. Samo przekierowanie ze Stripe nie oznacza zapłaty.':'Payment is not confirmed yet. A redirect from Stripe is not payment proof.');
   const links=[['pr-link',body.pr_url],['safe-link',body.safe_ci_url],['breaking-link',body.breaking_ci_url]];
   for(const [name,url] of links){const node=el(name);try{const u=new URL(url);if(u.protocol==='https:'&&u.hostname==='github.com'){node.href=u.href;node.hidden=false;}else node.hidden=true;}catch{node.hidden=true;}}
 }catch(e){status(pl?'Status jest chwilowo niedostępny. Odśwież za chwilę.':'Status is temporarily unavailable. Please refresh later.','error');}
}
el('order-refresh').addEventListener('click',refresh);
refresh();
})();

'use strict';
(async()=>{
 const root=document.querySelector('.od');
 if(!root)return;
 const box=document.getElementById('od-feed-state');
 if(!box)return;
 const en=document.documentElement.lang==='en';
 try{
  const res=await fetch('https://public-pilot-production.up.railway.app/api/source-status',{mode:'cors',cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!res.ok)throw new Error('Source unavailable');
  const data=await res.json();
  const age=Date.now()-Date.parse(data.generated_at);
  const healthy=data.status==='ok'&&Number.isFinite(age)&&age>=-3600000&&age<48*3600000;
  box.textContent=healthy?(en?'Source last checked: ':'Ostatni przegląd źródła: ')+new Date(data.generated_at).toLocaleString(en?'en-GB':'pl-PL',{dateStyle:'medium',timeStyle:'short'}):en?'Source data may be incomplete or outdated.':'Dane źródła mogą być niepełne lub nieaktualne.';
 }catch{box.textContent=en?'Live source check temporarily unavailable.':'Weryfikacja źródła chwilowo niedostępna.';}
})();

const form=document.getElementById('lookup-form');
const output=document.getElementById('lookup-result');
const sourceState=document.getElementById('source-state');
let snapshot=null;
const el=(tag,text,className)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(className)x.className=className;return x;};
async function loadSnapshot(){
 const res=await fetch('./regulations.json',{cache:'no-cache'});
 if(!res.ok)throw new Error('HTTP_'+res.status);
 const data=await res.json();
 if(!Array.isArray(data.acts)||!data.generatedAt)throw new Error('BAD_DATA');
 return data;
}
function sourceDescription(d){
 const date=new Date(d.generatedAt);
 const age=Date.now()-date.getTime();
 if(d.status!=='ok'||!Number.isFinite(age)||age>2*864e5)
  return 'Dane monitoringu nie są aktualnie zweryfikowane. Brak wyniku nie stanowi dowodu braku zmian.';
 return 'Ostatni przegląd dokumentów: '+date.toLocaleString('pl-PL',{dateStyle:'medium',timeStyle:'short'})+'. Zakres: '+(d.window||'wybrane akty UE')+'.';
}
(async()=>{try{snapshot=await loadSnapshot();sourceState.textContent=sourceDescription(snapshot);}catch{
 sourceState.textContent='Usługa danych chwilowo niedostępna. Zobacz przykład historyczny i oficjalny TARIC.';
}})();
form.addEventListener('submit',async e=>{
 e.preventDefault();
 const code=String(document.getElementById('code').value||'').replace(/[\s.-]/g,'');
 const country=String(document.getElementById('country').value||'').toUpperCase();
 output.replaceChildren();
 if(!/^(?:\d{8}|\d{10})$/.test(code)||!/^[A-Z]{2}$/.test(country)){
  output.append(el('strong','Podaj poprawny 8- lub 10-cyfrowy kod CN/TARIC i kraj pochodzenia.'));
  return;
 }
 let d=snapshot;
 if(!d){try{d=await loadSnapshot();}catch{output.append(el('strong','Źródło jest niedostępne. Nie możemy wiarygodnie wykonać sprawdzenia.'));return;}}
 const stale=d.status!=='ok'||Date.now()-Date.parse(d.generatedAt)>2*864e5;
 if(stale){output.append(el('strong','Zestaw danych jest nieaktualny lub niezweryfikowany. Poniższy wynik nie jest sprawdzeniem aktualnych przepisów.')); }
 const matches=d.acts.filter(a=>Array.isArray(a.codes)&&a.codes.some(c=>String(c).slice(0,8)===code.slice(0,8))&&
  (!Array.isArray(a.countries)||!a.countries.length||a.countries.includes(country)));
 const head=el('p',matches.length?'Potencjalnie powiązane dokumenty: '+matches.length:
  'Nie znaleziono dopasowania w aktualnie dostępnym zestawie kandydackim.');
 head.style.margin='0 0 12px';
 output.append(head);
 if(matches.length)for(const item of matches.slice(0,15)){
  const card=el('div',undefined,'match');
  card.append(el('strong',item.title||item.celex));
  const details=el('p','CELEX: '+item.celex+' · Kody rozpoznane w tekście: '+(item.codes||[]).join(', '));
  details.style.margin='8px 0';card.append(details);
  const link=el('a','Sprawdź oryginalny akt UE ↗');
  link.href=item.source_url;link.target='_blank';link.rel='noopener noreferrer';card.append(link);
  output.append(card);
 }
 const notice=el('p','Uwaga: dopasowanie kodu jest sygnałem, a nie decyzją o zastosowaniu cła. Weryfikuj pochodzenie, dodatkowe kody producenta i datę obowiązywania w TARIC.');
 notice.style.margin='16px 0 0';output.append(notice);
 const email=el('a','Zapytaj o monitoring tego kodu ↗','inline-cta');
 email.href='mailto:forgeframe.lab@gmail.com?subject='+encodeURIComponent('OriginDuty - monitoring '+code)+
 '&body='+encodeURIComponent('Kod CN/TARIC: '+code+'\nPochodzenie: '+country+'\nFirma:\nPortfolio kodów:\n');
 const block=el('p');block.style.margin='15px 0 0';block.append(email);output.append(block);
});

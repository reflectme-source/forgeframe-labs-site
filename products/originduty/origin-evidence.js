'use strict';
const URL_SOURCE='https://public-pilot-production.up.railway.app/regulations.json';
const root=document.querySelector('[data-od-evidence]');
if(root){
const en=root.getAttribute('data-lang')==='en';
const msg=en?{
 wait:'Loading official documents…',unavailable:'Unable to load current legal data. We do not show cached results as current.', partial:'Source coverage is partial or more than 48 hours old. Do not rely on a negative match.',ok:'Official EU source feed processed. This is a non-exhaustive candidate-document set, not a tariff ruling.',none:'No documents match these filters. This does not prove an import is free from duties.',docs:'Documents: ',asOf:'Last source check: ',source:'Open EUR-Lex document ↗',unknown:'Not specified',review:'Review required',codes:'Exact TARIC',origin:'Origin',action:'Action',check:'Source status: ',filter:'Available documents',refresh:'Refresh failed; source data unavailable.',other:'Document code not available'
}:{
 wait:'Pobieranie urzędowych dokumentów…',unavailable:'Nie udało się odczytać aktualnego źródła. Nie pokazujemy zapisanych danych jako bieżących.',partial:'Zakres źródła jest częściowy lub starszy niż 48 godzin. Brak wyniku niczego nie potwierdza.',ok:'Odczytano urzędowy feed UE. Lista kandydackich dokumentów jest niepełna i nie stanowi decyzji celnej.',none:'Brak dokumentów pasujących do filtrów. Nie jest to dowód braku należności importowych.',docs:'Dokumenty: ',asOf:'Ostatni odczyt: ',source:'Otwórz EUR-Lex ↗',unknown:'Nieustalone',review:'Do weryfikacji',codes:'Dokładny TARIC',origin:'Pochodzenie',action:'Działanie',check:'Stan źródła: ',filter:'Dostępne dokumenty',refresh:'Odświeżenie nie powiodło się; źródło niedostępne.',other:'Brak kodów w dokumencie'
};
const qs=(x)=>document.getElementById(x);
const t=(tag,value,cls)=>{const n=document.createElement(tag);if(value!=null)n.textContent=String(value);if(cls)n.className=cls;return n;};
const exact=(item)=>(Array.isArray(item.codes)?item.codes:[]).map(String).filter(x=>/^\d{10}$/.test(x));
const country=(item)=>(Array.isArray(item.countries)?item.countries:[]).filter(x=>/^[A-Z]{2}$/.test(x));
const action={
 'registration':en?'Import registration':'Rejestracja importu',
 'amendment':en?'Legal amendment':'Zmiana aktu',
 'potential-refund':en?'Potential refund':'Potencjalny zwrot',
 'new-measure':en?'New measure':'Nowy środek'
};
const countries={CN:en?'China':'Chiny',IN:en?'India':'Indie',KR:en?'South Korea':'Korea Płd.',TR:en?'Turkey':'Turcja',MY:en?'Malaysia':'Malezja',VN:en?'Vietnam':'Wietnam',US:'USA',ID:en?'Indonesia':'Indonezja',MX:en?'Mexico':'Meksyk'};
let snapshot=null,loading=false;
function legalLink(doc){
 if(!/^3\d{4}[A-Z]\d{4,6}$/.test(String(doc.celex??'')))return null;
 const url=new URL('https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:'+doc.celex);
 return url.href;
}
function renderDocument(doc){
 const item=t('article',null,'od-document'),top=t('div',null,'od-document-top');
 top.append(t('span',(doc.kind||'EU legal act').toString().replace(/[^A-Za-z\s-]/g,''),'od-tag'));
 const dt=new Date(doc.published_at||'');
 top.append(t('span',Number.isFinite(dt.getTime())?dt.toLocaleDateString(en?'en-GB':'pl-PL',{dateStyle:'medium'}):msg.unknown));item.append(top);
 item.append(t('h3',doc.title||doc.celex||'EU legal act'));
 item.append(t('p',msg.review+' · '+msg.origin+': '+(country(doc).map(x=>countries[x]||x).join(', ')||msg.unknown)+' · '+msg.action+': '+(action[doc.action]||doc.action||msg.unknown)));
 const codes=t('div',null,'od-code-list');
 const c=exact(doc);
 if(!c.length)codes.append(t('span',msg.other));else c.slice(0,20).forEach(x=>codes.append(t('code',x)));
 item.append(codes);const bottom=t('div',null,'od-document-bottom');
 bottom.append(t('small','CELEX '+String(doc.celex||'—')));
 const source=legalLink(doc);
 if(source){const a=t('a',msg.source);a.href=source;a.target='_blank';a.rel='noopener noreferrer';bottom.append(a);}
 item.append(bottom);return item;
}
function matchDoc(doc){
 const raw=qs('od-code').value.replace(/[\s.-]/g,'');
 if(raw&&!/^\d{1,10}$/.test(raw))return false;
 if(raw&&!exact(doc).some(x=>x.startsWith(raw)))return false;
 const cr=qs('od-origin').value,kind=qs('od-kind').value,act=qs('od-action').value;
 return (!cr||country(doc).includes(cr))&&(!kind||doc.kind===kind)&&(!act||doc.action===act);
}
function draw(){
 const output=qs('od-records');output.replaceChildren();
 if(!snapshot){output.append(t('div',msg.unavailable,'od-empty'));qs('od-count').textContent='';return;}
 const docs=snapshot.acts.filter(matchDoc).slice().sort((a,b)=>Date.parse(b.published_at||0)-Date.parse(a.published_at||0));
 qs('od-count').textContent=msg.docs+docs.length+' / '+snapshot.acts.length;
 if(!docs.length){output.append(t('div',msg.none,'od-empty'));return;}
 for(const doc of docs.slice(0,100))output.append(renderDocument(doc));
}
function populateCountries(items){
 const v=qs('od-origin').value,selector=qs('od-origin');
 const values=[...new Set(items.flatMap(country))].sort();
 const first=selector.options[0].cloneNode(true);selector.replaceChildren(first);
 values.forEach(c=>{const op=t('option',(countries[c]||c)+' ('+c+')');op.value=c;selector.append(op);});
 selector.value=values.includes(v)?v:'';
}
async function load(){
 if(loading)return;loading=true;qs('od-refresh').disabled=true;qs('od-updated').textContent=msg.wait;
 try{
  const r=await fetch(URL_SOURCE,{mode:'cors',cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!r.ok)throw Error('HTTP '+r.status);
  const data=await r.json();
  if(!data||!Array.isArray(data.acts)||typeof data.generatedAt!=='string'||data.acts.length>10000)throw Error('Bad data');
  snapshot=data;
  const date=new Date(data.generatedAt);
  const age=Date.now()-date.getTime();
  const fresh=data.status==='ok'&&Number.isFinite(age)&&age>=-3600000&&age<48*3600000;
  qs('od-stat-docs').textContent=String(data.acts.length);
  qs('od-stat-codes').textContent=String(new Set(data.acts.flatMap(exact)).size);
  qs('od-stat-feed').textContent=fresh?'OK':en?'Partial':'Częściowy';
  qs('od-feed-description').textContent=msg.check+String(data.status||'unknown');
  qs('od-updated').textContent=msg.asOf+(Number.isFinite(date.getTime())?date.toLocaleString(en?'en-GB':'pl-PL',{dateStyle:'medium',timeStyle:'short'}):msg.unknown)+' · EUR-Lex / CELLAR';
  qs('od-note').textContent=fresh?msg.ok:msg.partial;
  qs('od-note').dataset.state=fresh?'ok':'warning';
  populateCountries(data.acts);draw();
 }catch{
  snapshot=null;
  qs('od-stat-docs').textContent='—';qs('od-stat-codes').textContent='—';
  qs('od-stat-feed').textContent='OFFLINE';
  qs('od-note').dataset.state='warning';qs('od-note').textContent=msg.unavailable;
  qs('od-updated').textContent=msg.refresh;draw();
 }finally{loading=false;qs('od-refresh').disabled=false;}
}
for(const id of ['od-code','od-origin','od-kind','od-action'])qs(id).addEventListener(id==='od-code'?'input':'change',draw);
qs('od-clear').addEventListener('click',()=>{for(const id of ['od-code','od-origin','od-kind','od-action'])qs(id).value='';draw();});
qs('od-refresh').addEventListener('click',load);
load();
}

import crypto from 'node:crypto';
export const OFFICIAL_TARIC='https://taxation-customs.ec.europa.eu/online-services/online-services-and-databases-customs/eu-customs-tariff-taric_en';
export const OFFICIAL_OJ='https://eur-lex.europa.eu/oj/browse-oj.html?COLL_OJ=OJ-L&type=days';
const ORIGINS={CN:/China/i,KR:/Korea/i,MX:/Mexico/i,SA:/Saudi Arabia/i,IN:/India/i,TR:/T[uü]rkiye|Turkey/i,US:/United States/i,RU:/Russia/i,ID:/Indonesia/i,TH:/Thailand/i,TW:/Taiwan/i,VN:/Viet ?Nam/i};
export function normalizeCode(v){
 const s=String(v??'').replace(/[\s.-]/g,'');
 return /^(\d{8}|\d{10})$/.test(s)?s:null;
}
export function normalizeCountry(v){const s=String(v??'').trim().toUpperCase();return /^[A-Z]{2}$/.test(s)?s:null;}
export function classifyAct(v){
 const s=String(v??'');
 return /anti[-\s]?dumping/i.test(s)?'anti-dumping':/countervailing|anti[-\s]?subsidy/i.test(s)?'countervailing':/safeguard/i.test(s)?'safeguard':null;
}
export function countriesFromTitle(title){
 const text=String(title??'');
 return Object.entries(ORIGINS).filter(([,rx])=>rx.test(text)).map(([name])=>name);
}
export function extractCandidateCodes(text) {
 const s=String(text??'').replace(/\u00a0/g,' ');
 const codes=new Set();
 const re=/(?<!\d)(?:ex\s+)?(\d{4})[ \t]?(\d{2})[ \t]?(\d{2})(?:[ \t]?(\d{2}))?(?!\d)/gi;
 for(const m of s.matchAll(re)){
  const at=m.index??0;
  const nearby=s.slice(Math.max(0,at-110),at).replace(/[\n\r]+/g,' ');
  if(!/\b(CN|TARIC|commodity|subheading|code(?:s)?|heading)\b/i.test(nearby))continue;
  const code=m[1]+m[2]+m[3]+(m[4]||'');
  if(normalizeCode(code))codes.add(code);
 }
 return [...codes].sort();
}
export function sourceUrl(celex){
 return /^3\d{4}[A-Z]\d{4,6}$/.test(celex)?'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:'+celex:null;
}
export function matchCandidate(act,watch){
 if(!act||!watch)return false;
 const code=normalizeCode(watch.code);
 if(!code)return false;
 const hit=Array.isArray(act.codes)&&act.codes.some(x=>normalizeCode(x)?.slice(0,8)===code.slice(0,8));
 const origin=normalizeCountry(watch.country);
 return Boolean(hit&&(!origin||!act.countries?.length||act.countries.includes(origin)));
}
export function sha256(s){return crypto.createHash('sha256').update(String(s)).digest('hex');}
export function safeText(s,max=1000){return String(s??'').trim().slice(0,max);}

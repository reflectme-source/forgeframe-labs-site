import {load} from 'cheerio';
import {q,db} from './db.mjs';
import {OFFICIAL_OJ,classifyAct,countriesFromTitle,extractCandidateCodes,sourceUrl,sha256} from './core.mjs';
const HEADERS={'User-Agent':'OriginDuty/0.1 EU regulatory change research (+https://forgeframelabs.app/)','Accept-Language':'en'};
async function fetchOfficial(url){
 const parsed=new URL(url);
 if(parsed.protocol!=='https:'||!['eur-lex.europa.eu'].includes(parsed.hostname))throw new Error('UNAPPROVED_SOURCE');
 for(let attempt=1;attempt<=3;attempt++){
  const res=await fetch(url,{headers:HEADERS,signal:AbortSignal.timeout(20000),redirect:'follow'});
  const body=await res.text();
  const mime=res.headers.get('content-type')||'';
  if(res.status===200&&/html|xml/i.test(mime)&&body.length>=1000&&body.length<=3_000_000)return body;
  if(attempt===3)throw new Error('UPSTREAM_FAILED status='+res.status+' bytes='+body.length+' path='+parsed.pathname);
  await new Promise(ok=>setTimeout(ok,800*attempt));
 }
 throw new Error('UNREACHABLE_FETCH');
}
export function extractIndex(html){
 const $=load(html);
 const seen=new Map();
 $('div.BrowseOjSearchResult h2 a[href*="CELEX:"]').each((_,node)=>{
  const href=$(node).attr('href')||'';
  const match=href.match(/CELEX:(3\d{4}[A-Z]\d{4,6})/i);
  const title=$(node).text().replace(/\s+/g,' ').trim();
  if(!match||!classifyAct(title))return;
  const celex=match[1].toUpperCase();
  if(sourceUrl(celex))seen.set(celex,{celex,title,kind:classifyAct(title)});
 });
 return [...seen.values()];
}
export function extractText(html){
 const $=load(html);
 $('script,style,nav,footer,header').remove();
 return $.text().replace(/[\r\n\t]+/g,' ').replace(/ {2,}/g,' ').trim();
}
export async function fetchIndex({pages=12}={}){
 const results=new Map(),pagesFetched=[]; let maxAvailable=1;
 for(let i=1;i<=Math.min(pages,20);i++){
  const url=i===1?OFFICIAL_OJ:OFFICIAL_OJ+'&page='+i;
  const html=await fetchOfficial(url);
  const $=load(html);
  if(i===1){
   const last=$('a[title="Last Page"]').attr('href')||'';
   const m=last.match(/[?&]page=(\d+)/);
   maxAvailable=m?Math.min(20,Number(m[1])):1;
  }
  const documentLinks=$('div.BrowseOjSearchResult h2 a[href*="CELEX:"]').length;
  if(!documentLinks)break;
  pagesFetched.push(i);
  for(const act of extractIndex(html))results.set(act.celex,act);
  if(i>=maxAvailable)break;
 }
 if(!pagesFetched.length)throw new Error('OFFICIAL_INDEX_NOT_PARSEABLE');
 return {acts:[...results.values()],pagesFetched};
}
export async function readAct(celex,title,kind){
 const url=sourceUrl(celex);
 if(!url)throw new Error('INVALID_CELEX');
 const raw=await fetchOfficial(url);
 const text=extractText(raw);
 if(!text.includes('COMMISSION')&&!text.includes('Commission'))throw new Error('OFFICIAL_ACT_NOT_PARSED');
 return {
  celex,title,kind,source_url:url,
  countries:countriesFromTitle(title),
  codes:extractCandidateCodes(text),
  content_sha256:sha256(text),
  snippet_length:text.length
 };
}
export async function ingest({dryRun=false,pages=12,seed=[]}={}){
 const {acts,pagesFetched}=await fetchIndex({pages});
 for(const celex of seed){
  if(!acts.some(a=>a.celex===celex)){
   // A historical act is not discovered live; never present it as a current alert.
   const titles={
    '32026R2089':'Commission Implementing Regulation (EU) 2026/2089 amending definitive anti-dumping duties on certain iron or steel fasteners originating in China',
    '32026R2088':'Commission Implementing Regulation (EU) 2026/2088 imposing definitive anti-dumping duties on alkyl phosphonic acids originating in China'
   };
   if(titles[celex])acts.push({celex,title:titles[celex],kind:'anti-dumping',historical:true});
  }
 }
 const output={scanned:acts.length,stored:0,candidates:[],pagesFetched,errors:[]};
 let runId=null;
 if(!dryRun){
  if(!db)throw new Error('DATABASE_UNCONFIGURED');
  const rows=await q("INSERT INTO ingest_runs(status) VALUES('running') RETURNING id");
  runId=rows.rows[0].id;
 }
 for(const act of acts){
  try{
   const full=await readAct(act.celex,act.title,act.kind);
   output.candidates.push({celex:full.celex,title:full.title,codes:full.codes,countries:full.countries,historical:!!act.historical});
   if(!dryRun){
    await q(`INSERT INTO legal_acts(celex,title,kind,source_url,content_sha256,codes,countries)
       VALUES($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT(celex) DO UPDATE SET
       title=EXCLUDED.title,kind=EXCLUDED.kind,source_url=EXCLUDED.source_url,
       codes=EXCLUDED.codes,countries=EXCLUDED.countries,
       review_state=CASE WHEN legal_acts.content_sha256=EXCLUDED.content_sha256
         THEN legal_acts.review_state ELSE 'candidate' END,
       content_sha256=EXCLUDED.content_sha256,checked_at=now()`,
       [full.celex,full.title,full.kind,full.source_url,full.content_sha256,full.codes,full.countries]);
    output.stored++;
   }
  }catch(e){output.errors.push({celex:act.celex,error:String(e.message||e).slice(0,160)});}
 }
 const status=output.errors.length?'partial':'ok';
 if(runId)await q('UPDATE ingest_runs SET finished_at=now(),status=$2,fetched=$3,stored=$4,error=$5 WHERE id=$1',
   [runId,status,output.scanned,output.stored,output.errors.length?JSON.stringify(output.errors).slice(0,4000):null]);
 return {...output,status};
}

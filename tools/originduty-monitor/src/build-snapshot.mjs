
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ingest} from './ingest.mjs';
import {sourceUrl,classifyAct,OFFICIAL_OJ} from './core.mjs';
const target=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../products/originduty/regulations.json');
try{
 const r=await ingest({dryRun:true,pages:12});
 if(r.errors.length)throw new Error('INCOMPLETE_UPSTREAM_'+JSON.stringify(r.errors).slice(0,800));
 const docs=r.candidates.map(a=>({
  celex:a.celex,title:a.title,kind:classifyAct(a.title),source_url:sourceUrl(a.celex),
  codes:a.codes,countries:a.countries,review_state:'candidate'
 }));
 const data={
  generatedAt:new Date().toISOString(),status:'ok',source:OFFICIAL_OJ,
  window:'OJ-L, najnowsze siedem dni, akty z frazami trade-defence w tytule; nie jest to pełna baza TARIC',
  method:'CN/TARIC codes extracted from official legal text. Matches are preliminary and may need human review.',
  pagesFetched:r.pagesFetched,acts:docs
 };
 await fs.writeFile(target+'.tmp',JSON.stringify(data,null,2)+'\n','utf8');
 await fs.rename(target+'.tmp',target);
 console.log(JSON.stringify({status:'ok',acts:docs.length,pages:r.pagesFetched,generatedAt:data.generatedAt}));
}catch(e){console.error('SNAPSHOT_NOT_UPDATED',e.message);process.exitCode=1;}

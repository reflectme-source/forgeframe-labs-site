import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const catalog=JSON.parse(readFileSync(resolve(root,'data/products.json'),'utf8'));
const supported=new Set(['free','contact','external','external_or_contact','checkout']);
const slugs=new Set();
const errors=[];
for(const p of catalog.products){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))errors.push('Invalid slug: '+p.slug);
 if(slugs.has(p.slug))errors.push('Duplicate slug: '+p.slug);
 slugs.add(p.slug);
 if(!p.path.startsWith('/')||p.path.includes('..')||p.path.includes('?'))errors.push('Unsafe product path: '+p.slug);
 if(!supported.has(p.salesMode))errors.push('Unsupported salesMode: '+p.slug);
 if(p.checkoutReady!==false)errors.push('Catalog must not claim verified checkout readiness without separate release evidence: '+p.slug);
 if(p.commerce){
  if(p.commerce.releaseState!=='disabled')errors.push('Commerce release cannot be enabled from static catalog: '+p.slug);
  if(!['one_time','subscription','external','free'].includes(p.commerce.billingType))errors.push('Invalid billingType: '+p.slug);
  if(!['business','individual'].every(t=>p.commerce.buyerTypes.includes(t)))errors.push('Both buyer types must be supported by shared customer UX: '+p.slug);
  if(p.commerce.priceSource!=='stripe_server_side'&&p.commerce.billingType!=='external'&&p.commerce.billingType!=='free')errors.push('Unsafe price source: '+p.slug);
  if(!p.commerce.fulfillmentOwner)errors.push('Missing fulfillment owner: '+p.slug);
 }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('Product catalog valid: '+catalog.products.length+' products; all paid checkout release flags disabled.');

#!/usr/bin/env node
// Read-only preflight for future GitHub Pages custom-domain cutover.
// Does not alter DNS, GitHub settings, files, registration or payment.
// Usage: node scripts/preview-custom-domain.mjs forgeframelabs.app
import {readdirSync, readFileSync, statSync} from "node:fs";
import {resolve, dirname, join, relative, extname} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const oldOrigin="https://reflectme-source.github.io/forgeframe-labs-site";
const oldBasePath="/forgeframe-labs-site/";
const exclude=new Set([".git",".github","node_modules","tests","scripts",".venv","__pycache__"]);
const textExtensions=new Set([".html",".css",".js",".mjs",".json",".xml",".txt",".svg",".webmanifest"]);
const safeName=/^(?=.{4,253}$)(?!-)[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+\.[a-z]{2,}$/;
function domainArg(candidate){
 if(typeof candidate!=="string"||!safeName.test(candidate)||candidate.includes("github.io")
    ||candidate.endsWith(".localhost")||candidate.split(".").length!==2)throw new Error("Use a registrable, lowercase two-label apex hostname, e.g. forgeframelabs.app");
 return candidate;
}
function* publicFiles(dir=root){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  if(exclude.has(entry.name)||entry.name.startsWith(".env"))continue;
  const path=join(dir,entry.name);
  if(entry.isSymbolicLink())continue;
  if(entry.isDirectory())yield* publicFiles(path);
  else if(entry.isFile()&&textExtensions.has(extname(entry.name).toLowerCase()))yield path;
 }
}
function audit(domain){
 const host="https://"+domain;
 const hits=[];
 for(const path of publicFiles()){
  const data=readFileSync(path,"utf8");
  const baseHits=data.split(oldOrigin).length-1;
  // Leftover absolute links and base-path-sensitive scripts are migration hazards.
  const nakedPrefixHits=(data.split(oldBasePath).length-1)-baseHits;
  if(baseHits>0||nakedPrefixHits>0)hits.push({
   file:relative(root,path).replaceAll("\\","/"),
   absolute_old_urls:baseHits,
   other_old_prefix_references:Math.max(0,nakedPrefixHits)
  });
 }
 return {
  preview_only:true,
  input_domain:domain,
  source:oldOrigin+"/",
  target:host+"/",
  files_requiring_review:hits.length,
  absolute_link_occurrences:hits.reduce((s,x)=>s+x.absolute_old_urls,0),
  residual_basepath_occurrences:hits.reduce((s,x)=>s+x.other_old_prefix_references,0),
  files:hits,
  followup:[
    "Purchase and verify registrant's legal ownership; do not auto-register.",
    "Verify apex domain ownership with GitHub before touching DNS.",
    "Rewrite exact old origin in public HTML/SEO/sitemap/form _next URLs; keep the independent originduty-site hostname unchanged.",
    "Update domain-sensitive site-contract checks for the chosen hostname.",
    "Configure GitHub Pages domain in Settings > Pages first, then Cloudflare DNS; do not wildcard subdomains.",
    "Check HTTPS certificates and all 29 sitemap routes, localized forms, and optional third-party FormSubmit origin handling.",
    "Keep old URLs reachable or redirecting, then update Search Console and sitemap; monitor for errors."
  ]
 };
}
const input=process.argv[2];
try{
 const domain=domainArg(input);
 console.log(JSON.stringify(audit(domain),null,2));
}catch(e){console.error(String(e));process.exitCode=2;}

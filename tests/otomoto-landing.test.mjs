import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const page="solutions/otomoto-vehicle-monitoring.html";
const text=readFileSync(join(root,page),"utf8");
const home=readFileSync(join(root,"index.html"),"utf8");
const htmlLinks=[...text.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(x=>x[1]);
const tasks=[
  "bmw-3-series-price-changes",
  "audi-a4-market-price-watch",
  "skoda-octavia-new-listing-monitor"
];

test("landing page links to real public Actor and three existing examples",()=>{
  assert.match(text,/https:\/\/apify\.com\/green_amazement\/otomoto-change-intelligence/);
  for(const task of tasks){
    assert.ok(htmlLinks.some(x=>x.endsWith("/"+task)),"missing "+task);
  }
  assert.match(text,/Open on Apify/);
});
test("every relative image and page link exists in checked out website",()=>{
  for (const ref of htmlLinks){
    if(!ref.startsWith("../")&&!ref.startsWith("./"))continue;
    const target=resolve(root,dirname(page),decodeURIComponent(ref.split("#")[0].split("?")[0]));
    assert.ok(target.startsWith(root),"link escapes repository root");
    assert.ok(existsSync(target),"broken local link "+ref);
  }
});
test("website links back to dedicated landing page for discovery",()=>{
  assert.match(home,/solutions\/otomoto-vehicle-monitoring\.html|integrations\/otomoto-dealer-api\.html/);
});
test("copy avoids unverified sales claims and false real-time email promises",()=>{
  assert.match(text,/first successful run stores a comparison baseline/i);
  assert.match(text,/not proof that the vehicle was sold/i);
  assert.match(text,/Alert delivery requires your configured schedule/i);
  assert.match(text,/not affiliated with, endorsed by or an official API of OTOMOTO/i);
  assert.doesNotMatch(text,/guaranteed revenue|guaranteed leads|instant notifications delivered|approved by OTOMOTO/i);
  assert.doesNotMatch(text,/private draft|internal runbook|OWNER-GATE|operator tooling|staging artifact|STOP\.flag/i);
});
test("pricing is scoped to published seller listing and possible additional charges",()=>{
  assert.match(text,/US\$10 per 1,000 source scans/);
  assert.match(text,/additional event charges possible/);
  assert.match(text,/Review Apify's current pricing/i);
});
test("outbound links use expected HTTPS host and non-credential URL",()=>{
  const outgoing=htmlLinks.filter(x=>x.startsWith("https://"));
  assert.ok(outgoing.length>=5);
  for(const url of outgoing){
    const parsed=new URL(url);
    assert.ok(["apify.com","reflectme-source.github.io"].includes(parsed.hostname),parsed.hostname);
    assert.equal(parsed.username,"");
    assert.equal(parsed.password,"");
    assert.equal(parsed.search,"");
  }
});
test("responsive accessible and indexable standalone page",()=>{
  assert.match(text,/<html lang="en">/);
  assert.match(text,/<meta name="viewport"/);
  assert.match(text,/<link rel="canonical"/);
  assert.match(text,/:focus-visible/);
  assert.match(text,/@media\(max-width:600px\)/);
  assert.match(text,/<main>/);
  assert.match(text,/<h1>/);
  assert.match(text,/<details><summary>/);
  assert.doesNotMatch(text,/<script[^>]+src="https?:\/\//);
});

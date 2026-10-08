import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const cli=fileURLToPath(new URL('../tools/localization-cli.mjs',import.meta.url));
function runCsv(csv,options=[]){
  const dir=mkdtempSync(join(tmpdir(),'forgeframe-qa-'));
  const file=join(dir,'table.csv');
  writeFileSync(file,csv,'utf8');
  try{
    return spawnSync(process.execPath,[cli,'--file',file,...options],
      {encoding:'utf8',timeout:3500,maxBuffer:3*1024*1024});
  } finally {rmSync(dir,{recursive:true,force:true});}
}
test('valid table passes CI',()=>{
  const x=runCsv('key,en,pl\nwelcome,Hello {name},Czesc {name}\n');
  assert.equal(x.status,0);
  assert.match(x.stdout,/Localization QA PASS/);
});
test('mismatched token blocks CI with exit 2',()=>{
  const x=runCsv('key,en,pl\nx,Hello {name},Czesc {wrong}');
  assert.equal(x.status,2);
  assert.match(x.stdout,/TOKEN_MISMATCH/);
});
test('ICU_REVIEW advisory by default',()=>{
  const x=runCsv('key,en,pl\nx,"{count, plural, one{a} other{b}}","{count, plural, one{a} other{b}}"');
  assert.equal(x.status,0);
  assert.match(x.stdout,/ICU_REVIEW/);
});
test('strict any mode blocks ICU_REVIEW',()=>{
  const x=runCsv('key,en,pl\nx,"{count, plural, one{a} other{b}}","{count, plural, one{a} other{b}}"',['--fail-on','any']);
  assert.equal(x.status,2);
});
test('never mode reports findings but never fails CI',()=>{
  const x=runCsv('key,en,pl\nx,Hello {name},Hej {wrong}',['--fail-on','never']);
  assert.equal(x.status,0);
  assert.match(x.stdout,/TOKEN_MISMATCH/);
});
test('JSON format is machine-readable and preserves issue fields',()=>{
  const x=runCsv('key,en,pl\nx,Hi,',['--format','json']);
  assert.equal(x.status,2);
  const j=JSON.parse(x.stdout);
  assert.equal(j.status,'FAIL');
  assert.equal(j.report.findings[0].code,'EMPTY_TRANSLATION');
});
test('invalid source locale or CSV exits 64',()=>{
  const x=runCsv('wrong,en,pl\nx,a,b');
  assert.equal(x.status,64);
  assert.match(x.stderr,/INPUT_ERROR/);
});
test('unknown options are rejected',()=>{
  const x=runCsv('key,en,pl\nx,a,b',['--no-such-option']);
  assert.equal(x.status,64);
});
test('omitted file reports usage',()=>{
  const x=spawnSync(process.execPath,[cli],{encoding:'utf8',timeout:3000});
  assert.equal(x.status,64);
  assert.match(x.stderr,/Missing --file/);
});

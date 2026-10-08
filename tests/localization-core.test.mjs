import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCsv,inspectLocalizationCsv as scan} from '../tools/localization-core.mjs';

test('parse CSV including UTF8 BOM and CRLF',()=>{
  assert.deepEqual(parseCsv('\uFEFFkey,en,pl\r\ngreet,Hello,Cześć\r\n'),[
    ['key','en','pl'],['greet','Hello','Cześć']
  ]);
});
test('quoted commas and escaped quotes work',()=>{
  assert.deepEqual(parseCsv('key,en,pl\nx,"Hi, ""Bob""","Cześć, Bob"'),[
    ['key','en','pl'],['x','Hi, "Bob"','Cześć, Bob']
  ]);
});
test('quoted newlines remain one cell',()=>{
  assert.equal(parseCsv('key,en,pl\nx,"Line 1\nLine 2",OK')[1][1],'Line 1\nLine 2');
});
test('unterminated CSV quote fails',()=>assert.throws(()=>parseCsv('key,en,pl\nx,"bad'),/Unterminated/));
test('quote inside unquoted cell fails',()=>assert.throws(()=>parseCsv('key,en,pl\nx,abc"def,x'),/Quote inside/));
test('unquoted junk after a quote fails',()=>assert.throws(()=>parseCsv('key,en,pl\nx,"x"abc,y'),/Unexpected character/));
test('valid localized rows have no warnings',()=>{
  const r=scan('key,en,pl,de\nhello,Hello {name},Cześć {name},Hallo {name}');
  assert.equal(r.summary.findings,0);
  assert.deepEqual(r.locales,['pl','de']);
});
test('detect missing translation',()=>{
  const r=scan('key,en,pl\nhello,Hello,');
  assert.equal(r.findings[0].code,'EMPTY_TRANSLATION');
});
test('detect missing source',()=>{
  const r=scan('key,en,pl\nx,,Cześć');
  assert.equal(r.findings[0].code,'MISSING_SOURCE');
});
test('detect duplicated keys, case-insensitive',()=>{
  const r=scan('key,en,pl\nStart,Start,Start\nstart,Start,Start');
  assert.equal(r.findings[0].code,'DUPLICATE_KEY');
});
test('different placeholder names are errors',()=>{
  const r=scan('key,en,pl\nx,Hello {name},Cześć {user}');
  assert.equal(r.findings[0].code,'TOKEN_MISMATCH');
});
test('same placeholder duplicated in translation is error',()=>{
  const r=scan('key,en,pl\nx,Hi {name},Cześć {name} {name}');
  assert.equal(r.findings[0].code,'TOKEN_MISMATCH');
});
test('printf %s and %d mismatches are errors; escaped percent ignored',()=>{
  const r=scan('key,en,pl\nx,Used %s for %d%%,Użyto %s dla %s%%');
  assert.equal(r.findings[0].code,'TOKEN_MISMATCH');
});
test('missing HTML tag pair detected',()=>{
  const r=scan('key,en,pl\nx,<b>Hi</b>,Cześć');
  assert.equal(r.findings[0].code,'TOKEN_MISMATCH');
});
test('opening tags cannot masquerade as closing tags',()=>{
  const r=scan('key,en,pl\nx,<b>Hi</b>,<b>Witaj<b>');
  assert.equal(r.findings[0].code,'TOKEN_MISMATCH');
});
test('invalid row widths reject silent shifting',()=>{
  const r=scan('key,en,pl\nx,Hi');
  assert.equal(r.findings[0].code,'ROW_WIDTH');
});
test('bad headers are rejected',()=>{
  assert.throws(()=>scan('hello,en,pl\nx,a,b'),/First column/);
  assert.throws(()=>scan('key,en,en\nx,a,b'),/Duplicate/);
  assert.throws(()=>scan('key,pl,de\nx,a,b'),/not found/);
});
test('empty key is reported',()=>{
  const r=scan('key,en,pl\n,Hi,Cześć');
  assert.equal(r.findings[0].code,'MISSING_KEY');
});
test('ICU expressions receive explicit manual review instead of a false PASS',()=>{
  const r=scan('key,en,pl\nx,"{count, plural, one{one} other{many}}","{count, plural, one{jeden} other{wiele}}"');
  assert.ok(r.findings.some(f=>f.code==='ICU_REVIEW'));
});
test('uses a different explicit source locale',()=>{
  const r=scan('key,en,pl,de\nx,Hello,Cześć,Hallo',{sourceLocale:'pl'});
  assert.equal(r.summary.sourceLocale,'pl');
  assert.equal(r.summary.findings,0);
});

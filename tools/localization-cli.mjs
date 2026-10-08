#!/usr/bin/env node
// ForgeFrame Labs Localization QA CI gate: local-only CSV validation, no network calls.
import {readFileSync,statSync} from 'node:fs';
import {inspectLocalizationCsv} from './localization-core.mjs';

const MAX_FILE_BYTES=8*1024*1024;
const ERROR_CODES=new Set([
  'ROW_WIDTH','MISSING_KEY','DUPLICATE_KEY','MISSING_SOURCE',
  'EMPTY_TRANSLATION','TOKEN_MISMATCH'
]);
function usage(){
  return [
    'Localization QA Inspector — command-line release gate',
    '',
    'node tools/localization-cli.mjs --file <path.csv> [--source en] [--format text|json] [--fail-on error|any|never]',
    '',
    'Exit 0: PASS  |  Exit 2: configured gate failed  |  Exit 64: CLI/config/file error',
    'No network calls. CSV is processed locally. ICU_REVIEW is advisory in --fail-on error mode.'
  ].join('\n');
}
function parse(argv){
  const opts={file:null,source:'en',format:'text',failOn:'error'};
  const accepted=new Map([
    ['--file','file'],['--source','source'],['--format','format'],['--fail-on','failOn']
  ]);
  for(let i=0;i<argv.length;i++){
    const flag=argv[i];
    if(flag==='--help'||flag==='-h')return {help:true};
    if(!accepted.has(flag)||!argv[i+1]||argv[i+1].startsWith('--'))
      throw new Error('Invalid argument: '+flag);
    opts[accepted.get(flag)]=argv[++i];
  }
  if(!opts.file)throw new Error('Missing --file');
  if(!['text','json'].includes(opts.format))throw new Error('Unknown --format');
  if(!['any','error','never'].includes(opts.failOn))throw new Error('Unknown --fail-on');
  return opts;
}
async function main(){
  let options;
  try {options=parse(process.argv.slice(2));}
  catch(e){console.error('ERROR: '+e.message+'\n'+usage());process.exitCode=64;return;}
  if(options.help){console.log(usage());return;}
  let report;
  try{
    const stats=statSync(options.file);
    if(!stats.isFile())throw new Error('Not a regular file');
    if(stats.size>MAX_FILE_BYTES)throw new Error('CSV exceeds 8 MB limit');
    const contents=readFileSync(options.file,'utf8');
    report=inspectLocalizationCsv(contents,{sourceLocale:options.source});
  }catch(e){
    console.error('INPUT_ERROR: '+(e?.message||String(e)));
    process.exitCode=64;return;
  }
  const blocking=report.findings.filter(f=>options.failOn==='any' ||
      (options.failOn==='error'&&ERROR_CODES.has(f.code)));
  const failed=options.failOn!=='never'&&blocking.length>0;
  if(options.format==='json'){
    console.log(JSON.stringify({
      tool:'ForgeFrame Labs Localization QA',version:'0.1.0',
      status:failed?'FAIL':'PASS',blockingFindings:blocking.length,report
    },null,2));
  }else{
    console.log('Localization QA '+(failed?'FAIL':'PASS')+' | '+
       report.summary.parsedRows+' checked CSV rows | '+
       report.summary.findings+' findings | '+blocking.length+' blocking');
    for(const f of report.findings.slice(0,100))
      console.log(f.code+' row='+f.row+' key='+JSON.stringify(f.key)+
          ' locale='+f.locale+' — '+f.details);
    if(report.findings.length>100)console.log('Showing first 100 findings; use --format json for the full report.');
  }
  process.exitCode=failed?2:0;
}
await main();

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEvidence, selectFindings, csvCell, exportCsv
} from '../tools/contract-guard-report.mjs';

function sample() {
  return {
    schema: 'urn:forgeframe:contract-guard:evidence:v1',
    generator: { name: 'ForgeFrame Contract Guard', version: '0.1.0' },
    generatedAt: '2026-10-10T13:00:00.000Z',
    status: 'blocked',
    blockingCount: 1,
    inputs: { base: { sha256: 'a'.repeat(64) }, head: { sha256: 'b'.repeat(64) } },
    policy: { sha256: 'c'.repeat(64), failOn: 'ERR' },
    findings: [
      { id: 'response-property-removed', severity: 'ERR', path: '/api/users',
        operation: 'GET', text: 'Removed property title', fingerprint: 'a1b2c3d4e5f6', excepted: false },
      { id: 'request-parameter-became-required', severity: 'WARN', path: '/orders',
        operation: 'POST', text: 'Changed query parameter', fingerprint: 'a2b2c3d4e5f6', excepted: true,
        exceptionExpires: '2027-01-01' }
    ]
  };
}
test('valid schema report and all metrics pass validation', () => {
  assert.deepEqual(validateEvidence(sample()), sample());
});
test('wrong generator or foreign document fails closed', () => {
  assert.throws(() => validateEvidence({}), /schema/);
  const r=sample();r.generator.name='Unknown Generator';
  assert.throws(() => validateEvidence(r), /generator/);
});
test('tampered input fingerprint or blocking count fails closed', () => {
  const r=sample();r.inputs.base.sha256='deadbeef';
  assert.throws(() => validateEvidence(r), /SHA-256/);
  const b=sample();b.blockingCount=0;
  assert.throws(() => validateEvidence(b), /blocking count/);
});
test('report cannot pretend passed if it has blocking findings', () => {
  const r=sample();r.status='passed';
  assert.throws(() => validateEvidence(r), /contradicts/);
});
test('an unsupported severity cannot modify the verdict', () => {
  const r=sample();r.findings[0].severity='CRITICAL';
  assert.throws(() => validateEvidence(r), /severity/);
});
test('findings filter searches rule, endpoint, detail and optional exceptions', () => {
  const r=sample();
  assert.equal(selectFindings(r,{severity:'ERR'}).length,1);
  assert.equal(selectFindings(r,{show:'exceptions'}).length,1);
  assert.equal(selectFindings(r,{show:'active'}).length,1);
  assert.equal(selectFindings(r,{search:'users'}).length,1);
  assert.equal(selectFindings(r,{search:'QUERY PARAMETER'}).length,1);
  assert.equal(selectFindings(r,{search:'nonexistent'}).length,0);
});
test('CSV escapes embedded quotes and mitigates spreadsheet formula injection', () => {
  assert.equal(csvCell('a"b'),'"a""b"');
  for (const prefix of ['=', '+', '-', '@', '\t']) {
    assert.match(csvCell(prefix+'cmd'), /^"'/);
  }
  const r=sample();
  r.findings[0].text='=HYPERLINK("https://evil.invalid")';
  const csv=exportCsv(r.findings);
  assert.ok(csv.includes("'=HYPERLINK"));
  assert.equal(csv.split('\r\n').filter(Boolean).length,3);
});

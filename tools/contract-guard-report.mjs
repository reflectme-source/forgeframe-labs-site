const EVIDENCE_SCHEMA = 'urn:forgeframe:contract-guard:evidence:v1';
const SEVERITY = Object.freeze({ INFO: 1, WARN: 2, ERR: 3 });
const MAX_REPORT_BYTES = 3 * 1024 * 1024;

function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function required(condition, message) { if (!condition) throw new Error(message); }

export function validateEvidence(report) {
  required(isRecord(report), 'The selected file must contain one JSON object.');
  required(report.schema === EVIDENCE_SCHEMA, 'Unsupported report schema. Select a ForgeFrame Contract Guard v1 report.json.');
  required(isRecord(report.generator) && report.generator.name === 'ForgeFrame Contract Guard',
    'The file does not declare the expected report generator.');
  required(isRecord(report.inputs) && isRecord(report.inputs.base) && isRecord(report.inputs.head),
    'Missing input provenance.');
  const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
  required(hash(report.inputs.base.sha256) && hash(report.inputs.head.sha256),
    'Baseline or revision SHA-256 is missing or malformed.');
  required(isRecord(report.policy) && hash(report.policy.sha256) && Object.hasOwn(SEVERITY, report.policy.failOn),
    'Invalid policy evidence.');
  required(Array.isArray(report.findings) && report.findings.length <= 2500, 'Finding list is missing or too large.');
  required(['blocked', 'passed'].includes(report.status), 'Unsupported compatibility verdict.');
  required(Number.isInteger(report.blockingCount) && report.blockingCount >= 0 &&
    report.blockingCount <= report.findings.length, 'Invalid blocking count.');
  required(typeof report.generatedAt === 'string' && report.generatedAt.length < 100,
    'Missing report timestamp.');
  for (const [index, finding] of report.findings.entries()) {
    required(isRecord(finding), 'Invalid finding #' + (index + 1) + '.');
    required(typeof finding.id === 'string' && finding.id.length < 200 &&
      Object.hasOwn(SEVERITY, finding.severity), 'Invalid rule or severity at finding #' + (index + 1) + '.');
    required(typeof finding.text === 'string' && finding.text.length <= 5000,
      'Invalid finding description at #' + (index + 1) + '.');
    required(finding.excepted === true || finding.excepted === false,
      'Finding #' + (index + 1) + ' needs an explicit exception decision.');
    for (const key of ['path', 'operation', 'fingerprint']) {
      required(finding[key] == null || (typeof finding[key] === 'string' && finding[key].length <= 2000),
        'Invalid ' + key + ' at finding #' + (index + 1));
    }
  }
  const actualBlockingCount = report.findings.filter(finding =>
    !finding.excepted && SEVERITY[finding.severity] >= SEVERITY[report.policy.failOn]
  ).length;
  required(actualBlockingCount === report.blockingCount, 'Evidence disagrees with its blocking count.');
  required((actualBlockingCount > 0 ? 'blocked' : 'passed') === report.status,
    'Evidence verdict contradicts its findings.');
  return report;
}

export function selectFindings(report, { search = '', severity = 'all', show = 'all' } = {}) {
  const needle = search.toLocaleLowerCase().trim();
  return report.findings.filter(f => {
    if (severity !== 'all' && f.severity !== severity) return false;
    if (show === 'active' && f.excepted) return false;
    if (show === 'exceptions' && !f.excepted) return false;
    if (!needle) return true;
    return [f.id, f.path, f.operation, f.text, f.fingerprint]
      .some(value => String(value ?? '').toLocaleLowerCase().includes(needle));
  });
}

export function csvCell(value) {
  let str = String(value ?? '').replace(/[\x00-\x08\x0b-\x1f]/g, ' ');
  if (/^\s*[=+\-@\t\r]/.test(str)) str = "'" + str;
  return '"' + str.replace(/"/g, '""') + '"';
}

export function exportCsv(findings) {
  const header = ['Severity', 'Rule', 'Endpoint', 'Description', 'Fingerprint', 'Excepted', 'Expiry'];
  const rows = findings.map(finding => [
    finding.severity, finding.id, (finding.operation ? finding.operation + ' ' : '') + (finding.path ?? ''),
    finding.text, finding.fingerprint ?? '', finding.excepted ? 'Yes' : 'No',
    finding.exceptionExpires ?? ''
  ].map(csvCell).join(','));
  return [header.map(csvCell).join(','), ...rows].join('\r\n') + '\r\n';
}

const synthetic = {
  schema: EVIDENCE_SCHEMA,
  generator: { name: 'ForgeFrame Contract Guard', version: '0.1.0', engine: 'oasdiff' },
  generatedAt: '2026-10-10T12:00:00.000Z',
  status: 'blocked',
  blockingCount: 2,
  inputs: {
    base: { name: 'example-base.yaml', sha256: 'a'.repeat(64) },
    head: { name: 'example-revision.yaml', sha256: 'b'.repeat(64) }
  },
  policy: { failOn: 'ERR', sha256: 'c'.repeat(64), exceptionCount: 0 },
  findings: [
    { severity: 'ERR', id: 'request-parameter-became-required', operation: 'GET', path: '/payments',
      text: "request parameter 'page' became required", fingerprint: 'a1b2c3d4e5f6',
      excepted: false, exceptionExpires: null },
    { severity: 'ERR', id: 'response-property-enum-value-added', operation: 'GET', path: '/payments',
      text: "response 'status' enum gained the value 'chargeback'", fingerprint: '0123456789ab',
      excepted: false, exceptionExpires: null }
  ]
};

if (typeof document !== 'undefined') {
  const $ = selector => document.querySelector(selector);
  const dropzone = $('#dropzone');
  const fileInput = $('#report-file');
  const output = $('#result');
  const findingsBody = $('#findings-body');
  const error = $('#validation-error');
  let current = null;

  function message(text) {
    error.textContent = text;
    error.hidden = !text;
  }
  function text(selector, value) { $(selector).textContent = String(value ?? '—'); }
  function addCell(row, value, className = '') {
    const cell = document.createElement('td');
    cell.textContent = String(value ?? '—');
    if (className) cell.className = className;
    row.appendChild(cell);
  }
  function renderFindings() {
    if (!current) return;
    const filtered = selectFindings(current, {
      search: $('#search').value,
      severity: $('#severity').value,
      show: $('#visibility').value
    });
    findingsBody.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const item of filtered) {
      const row = document.createElement('tr');
      addCell(row, item.severity, 'severity ' + item.severity.toLowerCase());
      addCell(row, item.id);
      addCell(row, (item.operation ? item.operation + ' ' : '') + (item.path ?? ''), 'path');
      addCell(row, item.text);
      addCell(row, item.excepted ? 'Until ' + item.exceptionExpires : '—');
      fragment.appendChild(row);
    }
    findingsBody.appendChild(fragment);
    text('#shown-count', filtered.length);
    $('#empty').hidden = filtered.length !== 0;
    $('#export').disabled = filtered.length === 0;
  }
  function render(report, demo = false) {
    current = validateEvidence(report);
    text('#report-source', demo ? 'Example report (synthetic data)' : 'Locally selected report.json');
    text('#status', report.status === 'blocked' ? 'BLOCKED' : 'PASS');
    $('#status').dataset.state = report.status;
    text('#blocking', report.blockingCount);
    text('#total', report.findings.length);
    text('#exceptions', report.findings.filter(f => f.excepted).length);
    text('#threshold', report.policy.failOn);
    text('#base-name', report.inputs.base.name || 'Baseline');
    text('#head-name', report.inputs.head.name || 'Revision');
    text('#base-hash', report.inputs.base.sha256);
    text('#head-hash', report.inputs.head.sha256);
    text('#policy-hash', report.policy.sha256);
    text('#generated', report.generatedAt);
    output.hidden = false;
    message('');
    renderFindings();
  }
  async function openReport(file) {
    if (!file) return;
    try {
      if (file.size > MAX_REPORT_BYTES) throw new Error('Please choose a report under 3 MiB.');
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      render(parsed, false);
    } catch (failure) {
      current = null;
      output.hidden = true;
      message('Cannot open report: ' + failure.message);
    }
  }
  $('#demo').addEventListener('click', () => render(structuredClone(synthetic), true));
  fileInput.addEventListener('change', event => openReport(event.target.files?.[0]));
  for (const type of ['dragenter', 'dragover']) {
    dropzone.addEventListener(type, event => { event.preventDefault(); dropzone.classList.add('drag'); });
  }
  for (const type of ['dragleave', 'drop']) {
    dropzone.addEventListener(type, event => { event.preventDefault(); dropzone.classList.remove('drag'); });
  }
  dropzone.addEventListener('drop', event => openReport(event.dataTransfer?.files?.[0]));
  for (const selector of ['#search', '#severity', '#visibility']) {
    $(selector).addEventListener(selector === '#search' ? 'input' : 'change', renderFindings);
  }
  $('#export').addEventListener('click', () => {
    if (!current) return;
    const csv = exportCsv(selectFindings(current, {
      search: $('#search').value, severity: $('#severity').value, show: $('#visibility').value
    }));
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'contract-guard-findings.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  });
}

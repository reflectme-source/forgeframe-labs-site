import test from "node:test";
import assert from "node:assert/strict";
import {parseCsv} from "../tools/localization-core.mjs";
import {csvCell, exportIssuesCsv, issuePresentation} from "../tools/report-export.mjs";

test("human-readable titles and priorities for real issue types", () => {
  assert.deepEqual(
    ["TOKEN_MISMATCH","ROW_WIDTH","EMPTY_TRANSLATION"].map(code =>
      issuePresentation({code}).severity), ["blocking","blocking","blocking"]);
  assert.equal(issuePresentation({code:"ICU_REVIEW"}).severity,"review");
  assert.equal(issuePresentation({code:"TOKEN_MISMATCH"}).title,
    "Formatting mismatch");
});
test("exports actionable descriptions instead of raw diagnostic codes", () => {
  const out=exportIssuesCsv({findings:[
    {row:2,key:"welcome",locale:"de",code:"TOKEN_MISMATCH",details:"{name} vs {user}"}
  ]});
  assert.match(out,/Formatting mismatch/);
  assert.match(out,/Suggested fix/);
  assert.doesNotMatch(out,/TOKEN_MISMATCH/);
  assert.equal(parseCsv(out).length,2);
});
test("spreadsheet formulas are escaped in every CSV cell", () => {
  for(const text of ["=HYPERLINK(1)","+SUM(1,2)","-10","@fn","  =cmd","\t=1"]) {
    const cell=csvCell(text);
    assert.equal(cell[0],'"');
    assert.equal(cell[1],"'");
  }
  assert.equal(csvCell("normal"),'"normal"');
});
test("escaped quotes, newlines and commas round-trip", () => {
  const value='Text "quoted", with\nnewline';
  const row=csvCell(value)+","+csvCell("done");
  assert.deepEqual(parseCsv(row),[[value,"done"]]);
});
test("formula-like source values cannot become active spreadsheet formulas", () => {
  const report={findings:[
    {row:1,key:"=1+1",locale:"en",code:"EMPTY_TRANSLATION",details:"@NOW()"}
  ]};
  const cells=parseCsv(exportIssuesCsv(report));
  assert.ok(cells[1][2].startsWith("'"));
  assert.ok(cells[1][5].startsWith("'"));
});
test("invalid export input fails closed", () => {
  assert.throws(()=>exportIssuesCsv(null),/Invalid localization report/);
  assert.throws(()=>exportIssuesCsv({findings:"oops"}),/Invalid localization report/);
});

import assert from "node:assert/strict";
import test from "node:test";
import { checkJpets } from "./jpets";
import { EXAMPLE_SHARED, EXAMPLE_SSW, isIndexable, parseShared, resultPath, sharedQuery, toCheckInput } from "./share";

test("example round-trips and is indexable", () => {
  const back = parseShared(new URLSearchParams(sharedQuery(EXAMPLE_SHARED)));
  assert.deepEqual(back, EXAMPLE_SHARED);
  assert.ok(isIndexable(EXAMPLE_SHARED) && isIndexable(EXAMPLE_SSW));
  assert.equal(resultPath(EXAMPLE_SHARED), "/r?n=indonesia&s=student&d=2027-01-15");
});

test("share link → same verdict as API", () => {
  assert.equal(checkJpets({ ...toCheckInput(EXAMPLE_SHARED), today: "2026-10-15" }).verdict, "required");
  assert.equal(checkJpets({ ...toCheckInput(EXAMPLE_SSW), today: "2026-10-15" }).verdict, "exempt");
  const s = parseShared({ n: "nepal", s: "student", d: "2026-11-01", live: "other", x: "2026-10-01", v: "1" })!;
  assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(s))), s);
  assert.equal(checkJpets({ ...toCheckInput(s), today: "2026-10-15" }).verdict, "exempt");
});

test("parseShared rejects junk", () => {
  assert.equal(parseShared({ n: "mars", s: "student", d: "2027-01-15" }), null);
  assert.equal(parseShared({ n: "indonesia", s: "wizard", d: "2027-01-15" }), null);
  assert.equal(parseShared({ n: "indonesia", s: "student", d: "2027-02-30" }), null);
  assert.equal(parseShared({ n: "indonesia", s: "student" }), null);
  assert.equal(parseShared({}), null);
});

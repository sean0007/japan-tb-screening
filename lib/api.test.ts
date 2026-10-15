import assert from "node:assert/strict";
import test from "node:test";
import { apiHandler, openapiDoc, preflight } from "./agent-api";
import { API_DISCLAIMER, API_INFO, ENDPOINTS, EXAMPLE_GET, PUBLIC_URL } from "./api";

const e = ENDPOINTS.check;
const handler = apiHandler(e.compute, { disclaimer: API_DISCLAIMER, docs: `${PUBLIC_URL}/openapi.json`, example: `${PUBLIC_URL}${e.example}` });

test(`GET ${EXAMPLE_GET} → required, CORS, disclaimer`, async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${EXAMPLE_GET}`));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const body = await res.json();
  assert.equal(body.disclaimer, API_DISCLAIMER);
  assert.equal(body.verdict, "required");
  assert.equal(body.submitWith, "coe_application");
  assert.deepEqual(body.certificate.xrayWindowForApplicationDate, { earliest: "2026-11-02", latest: "2027-01-15" });
  assert.equal(body.panelClinics.country, "indonesia");
  assert.ok(body.sources.length);
});

test("POST JSON body matches GET", async () => {
  const url = new URL(`${PUBLIC_URL}${EXAMPLE_GET}`);
  const post = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(url.searchParams)) }));
  const get = await handler(new Request(url));
  assert.equal(post.status, 200);
  const a = await post.json();
  const b = await get.json();
  assert.deepEqual(a, b);
});

test("POST with aliases, booleans and city", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nationality: "VN", status: "gijinkoku", applicationDate: "2026-11-01", xrayDate: "2026-10-01", city: "Da Nang" }) }));
  assert.equal(res.status, 200);
  const b = await res.json();
  assert.equal(b.verdict, "required");
  assert.equal(b.certificate.validOnApplicationDate, true);
  assert.equal(b.panelClinics.count, 2);
  const ssw = await (await handler(new Request(`${PUBLIC_URL}${e.path}?nationality=indonesia&status=tokutei_ginou&applicationDate=2027-02-01`))).json();
  assert.equal(ssw.verdict, "exempt");
  const re = await (await handler(new Request(`${PUBLIC_URL}${e.path}?nationality=philippines&status=student&hasReentryPermit=true`))).json();
  assert.equal(re.reasonCode, "reentry_permit");
});

test("missing nationality → 400 with example", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}`));
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /nationality/);
  assert.equal(body.disclaimer, API_DISCLAIMER);
  assert.ok(body.example);
});

test("bad status, bad date, bad route → 400", async () => {
  for (const q of ["nationality=indonesia&status=wizard", "nationality=indonesia&applicationDate=2027-13-01", "nationality=indonesia&route=boat", "nationality=indonesia&xrayDate=yesterday", "nationality=indonesia&stayMonths=0"]) {
    const res = await handler(new Request(`${PUBLIC_URL}${e.path}?${q}`));
    assert.equal(res.status, 400, q);
  }
});

test("malformed JSON body → 400", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{nope" }));
  assert.equal(res.status, 400);
});

test("OPTIONS preflight is CORS open", () => {
  const res = preflight();
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("OpenAPI lists /api/check GET and POST with nationality required", () => {
  const spec = openapiDoc(API_INFO, PUBLIC_URL, [e]) as { openapi: string; paths: Record<string, { get: { parameters: { name: string; required?: boolean }[] }; post: unknown }> };
  assert.ok(spec.openapi.startsWith("3."));
  assert.ok(spec.paths["/api/check"]?.get);
  assert.ok(spec.paths["/api/check"]?.post);
  assert.ok(spec.paths["/api/check"].get.parameters.find((p) => p.name === "nationality")?.required);
});

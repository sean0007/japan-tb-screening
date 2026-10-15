import { openapiDoc, preflight, staticJson } from "@/lib/agent-api";
import { API_INFO, ENDPOINTS, PUBLIC_URL } from "@/lib/api";

export function GET() {
  const base = openapiDoc(API_INFO, PUBLIC_URL, Object.values(ENDPOINTS)) as {
    paths: Record<string, unknown>;
    [k: string]: unknown;
  };
  base.paths["/api/rules"] = {
    get: {
      operationId: "japanTbScreeningRules",
      summary: "All JPETS rules: target countries and dates, exemptions, validity, transition rule, statuses, and the designated Panel Clinic list",
      description: "Returns the dated JPETS rules (Philippines, Nepal, Viet Nam, Indonesia, Myanmar, China), the temporary exemption list, certificate validity, when to submit, all Panel Clinics by country, sources, and disclaimer. No inputs.",
      responses: {
        "200": {
          description: "Rules JSON with rulesAsOf and sources.",
          content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
        },
      },
    },
  };
  return staticJson(base);
}
export const OPTIONS = preflight;

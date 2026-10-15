# Japan TB Screening Check (JPETS)

Free checker for **Japan Pre-Entry Tuberculosis Screening (JPETS, 入国前結核スクリーニング)**: do nationals of the Philippines, Nepal, Viet Nam, Indonesia, Myanmar or China need a TB Clearance Certificate from a designated Panel Clinic for a Japan Certificate of Eligibility (COE) or visa?

- Live: https://japan-tb-screening.vercel.app
- API: `GET/POST /api/check`, `GET /api/rules`
- Agent docs: `/llms.txt`, `/openapi.json`, `/.well-known/ai-plugin.json`
- MCP tool: `japan_tb_screening_check` on https://free-agent-tools.vercel.app/mcp

**Educational guide, not immigration, legal or medical advice.** ISA, the embassy and the Panel Clinic decide.

## Example

```
GET https://japan-tb-screening.vercel.app/api/check?nationality=indonesia&status=student&applicationDate=2027-01-15
```
→ `verdict: "required"`, `submitWith: "coe_application"`, X-ray window 2026-11-02 → 2027-01-15, 10 Panel Clinics.

## Rules implemented (verified 2026-10-15)

| Nationality | Panel Clinics open | Mandatory for applications filed from |
|---|---|---|
| Philippines, Nepal | 2025-03-24 | 2025-06-23 |
| Viet Nam | 2025-05-26 | 2025-09-01 |
| Indonesia | 2026-11-02 (scheduled) | 2027-01-04 (scheduled) |
| Myanmar, China | not announced | not announced |

- Covered: mid- to long-term residents (stay > 3 months; not Temporary Visitor / Diplomat / Official), excluding re-entry permit holders; plus Designated Activities No. 53 / 54 (Digital Nomad).
- Temporarily exempt: Specified Skilled Worker, EPA nurse/care worker, JET, JICA trainee, JDS, Japan Foundation invitee, embassy-recommended MEXT scholar, commissioned student training, DA No. 55, special-zone housekeeper. Residence outside the 6 countries (documented) is also exempt.
- Transition: the filing date decides; COE filed before the mandatory date → no certificate at the visa stage (Q&A 21).
- Validity: 180 days from the X-ray (90 after close contact), checked at COE filing only (Q&A 17). The tool counts the X-ray day as day 1.

Sources: MHLW JPETS page, Guideline (rev. 2026-09-25), JPETS Q&A, ISA page 10_00219, MHLW Panel Clinic list (Indonesia per 2026-10-09). Snapshots in the maker's research folder.

## Develop

```
npm install
npm test
npm run build
```

MIT license.

import { Command } from "commander";
import { get } from "../api";

export const enrichOrgCommand = new Command("enrich-org")
  .description("Enrich an organization (GET /api/v1/organizations/enrich)")
  .option("--domain <domain>", "Company domain")
  .option("--organization-name <name>", "Organization name")
  .action(async (opts) => {
    const params = new URLSearchParams();
    if (opts.domain) params.set("domain", opts.domain);
    if (opts.organizationName) params.set("organization_name", opts.organizationName);

    const res = await get(`/api/v1/organizations/enrich?${params}`);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

import { Command } from "commander";
import { post } from "../api";

export const searchOrgsCommand = new Command("search-orgs")
  .description("Search organizations (POST /api/v1/mixed_companies/search)")
  .option("--q-keywords <keywords>", "Search keywords")
  .option("--organization-locations <locations...>", "Organization locations")
  .option("--page <n>", "Page number", parseInt)
  .option("--per-page <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.qKeywords) body.q_keywords = opts.qKeywords;
    if (opts.organizationLocations) body.organization_locations = opts.organizationLocations;
    if (opts.page) body.page = opts.page;
    if (opts.perPage) body.per_page = opts.perPage;

    const res = await post("/api/v1/mixed_companies/search", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

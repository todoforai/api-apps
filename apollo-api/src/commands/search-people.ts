import { Command } from "commander";
import { post } from "../api";

export const searchPeopleCommand = new Command("search-people")
  .description("Search people (POST /api/v1/mixed_people/search)")
  .option("--q-keywords <keywords>", "Search keywords")
  .option("--person-titles <titles...>", "Person titles")
  .option("--person-locations <locations...>", "Person locations")
  .option("--organization-domains <domains...>", "Organization domains")
  .option("--page <n>", "Page number", parseInt)
  .option("--per-page <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.qKeywords) body.q_keywords = opts.qKeywords;
    if (opts.personTitles) body.person_titles = opts.personTitles;
    if (opts.personLocations) body.person_locations = opts.personLocations;
    if (opts.organizationDomains) body.organization_domains = opts.organizationDomains;
    if (opts.page) body.page = opts.page;
    if (opts.perPage) body.per_page = opts.perPage;

    const res = await post("/api/v1/mixed_people/search", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

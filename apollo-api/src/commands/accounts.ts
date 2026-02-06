import { Command } from "commander";
import { post, patch } from "../api";

const search = new Command("search")
  .description("Search accounts (POST /api/v1/accounts/search)")
  .option("--q-keywords <keywords>", "Search keywords")
  .option("--page <n>", "Page number", parseInt)
  .option("--per-page <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.qKeywords) body.q_keywords = opts.qKeywords;
    if (opts.page) body.page = opts.page;
    if (opts.perPage) body.per_page = opts.perPage;

    const res = await post("/api/v1/accounts/search", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const create = new Command("create")
  .description("Create an account (POST /api/v1/accounts)")
  .option("--name <name>", "Account name")
  .option("--domain <domain>", "Domain")
  .option("--phone <phone>", "Phone number")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.name) body.name = opts.name;
    if (opts.domain) body.domain = opts.domain;
    if (opts.phone) body.phone = opts.phone;

    const res = await post("/api/v1/accounts", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const update = new Command("update")
  .description("Update an account (PATCH /api/v1/accounts/:id)")
  .argument("<id>", "Account ID")
  .option("--name <name>", "Account name")
  .option("--domain <domain>", "Domain")
  .option("--phone <phone>", "Phone number")
  .action(async (id: string, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.name) body.name = opts.name;
    if (opts.domain) body.domain = opts.domain;
    if (opts.phone) body.phone = opts.phone;

    const res = await patch(`/api/v1/accounts/${id}`, body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

export const accountsCommand = new Command("accounts")
  .description("Manage accounts")
  .addCommand(search)
  .addCommand(create)
  .addCommand(update);

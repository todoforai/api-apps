import { Command } from "commander";
import { post, patch } from "../api";

const search = new Command("search")
  .description("Search contacts (POST /api/v1/contacts/search)")
  .option("--q-keywords <keywords>", "Search keywords")
  .option("--page <n>", "Page number", parseInt)
  .option("--per-page <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.qKeywords) body.q_keywords = opts.qKeywords;
    if (opts.page) body.page = opts.page;
    if (opts.perPage) body.per_page = opts.perPage;

    const res = await post("/api/v1/contacts/search", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const create = new Command("create")
  .description("Create a contact (POST /api/v1/contacts)")
  .option("--first-name <name>", "First name")
  .option("--last-name <name>", "Last name")
  .option("--email <email>", "Email address")
  .option("--organization-name <name>", "Organization name")
  .option("--title <title>", "Job title")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.firstName) body.first_name = opts.firstName;
    if (opts.lastName) body.last_name = opts.lastName;
    if (opts.email) body.email = opts.email;
    if (opts.organizationName) body.organization_name = opts.organizationName;
    if (opts.title) body.title = opts.title;

    const res = await post("/api/v1/contacts", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const update = new Command("update")
  .description("Update a contact (PATCH /api/v1/contacts/:id)")
  .argument("<id>", "Contact ID")
  .option("--first-name <name>", "First name")
  .option("--last-name <name>", "Last name")
  .option("--email <email>", "Email address")
  .option("--organization-name <name>", "Organization name")
  .option("--title <title>", "Job title")
  .action(async (id: string, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.firstName) body.first_name = opts.firstName;
    if (opts.lastName) body.last_name = opts.lastName;
    if (opts.email) body.email = opts.email;
    if (opts.organizationName) body.organization_name = opts.organizationName;
    if (opts.title) body.title = opts.title;

    const res = await patch(`/api/v1/contacts/${id}`, body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

export const contactsCommand = new Command("contacts")
  .description("Manage contacts")
  .addCommand(search)
  .addCommand(create)
  .addCommand(update);

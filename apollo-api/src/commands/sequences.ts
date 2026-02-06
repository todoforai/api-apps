import { Command } from "commander";
import { post } from "../api";

const search = new Command("search")
  .description("Search sequences (POST /api/v1/emailer_campaigns/search)")
  .option("--q-keywords <keywords>", "Search keywords")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.qKeywords) body.q_keywords = opts.qKeywords;

    const res = await post("/api/v1/emailer_campaigns/search", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const addContacts = new Command("add-contacts")
  .description("Add contacts to a sequence (POST /api/v1/emailer_campaigns/:id/add_contact_ids)")
  .requiredOption("--sequence-id <id>", "Sequence ID")
  .requiredOption("--contact-ids <ids...>", "Contact IDs to add")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      contact_ids: opts.contactIds,
    };

    const res = await post(
      `/api/v1/emailer_campaigns/${opts.sequenceId}/add_contact_ids`,
      body
    );
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

export const sequencesCommand = new Command("sequences")
  .description("Manage sequences")
  .addCommand(search)
  .addCommand(addContacts);

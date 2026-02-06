import { Command } from "commander";
import { post } from "../api";

export const enrichPersonCommand = new Command("enrich-person")
  .description("Enrich a person (POST /api/v1/people/match)")
  .option("--first-name <name>", "First name")
  .option("--last-name <name>", "Last name")
  .option("--email <email>", "Email address")
  .option("--domain <domain>", "Company domain")
  .option("--organization-name <name>", "Organization name")
  .option("--linkedin-url <url>", "LinkedIn URL")
  .option("--reveal-personal-emails", "Reveal personal emails")
  .option("--reveal-phone-number", "Reveal phone number (5x credits)")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.firstName) body.first_name = opts.firstName;
    if (opts.lastName) body.last_name = opts.lastName;
    if (opts.email) body.email = opts.email;
    if (opts.domain) body.domain = opts.domain;
    if (opts.organizationName) body.organization_name = opts.organizationName;
    if (opts.linkedinUrl) body.linkedin_url = opts.linkedinUrl;
    if (opts.revealPersonalEmails) body.reveal_personal_emails = true;
    if (opts.revealPhoneNumber) body.reveal_phone_number = true;

    const res = await post("/api/v1/people/match", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

#!/usr/bin/env bun
import { program } from "commander";
import { enrichPersonCommand } from "./commands/enrich-person";
import { enrichOrgCommand } from "./commands/enrich-org";
import { searchPeopleCommand } from "./commands/search-people";
import { searchOrgsCommand } from "./commands/search-orgs";
import { contactsCommand } from "./commands/contacts";
import { accountsCommand } from "./commands/accounts";
import { dealsCommand } from "./commands/deals";
import { sequencesCommand } from "./commands/sequences";

program
  .name("apollo-api")
  .description("Apollo.io API CLI - raw API wrapper")
  .version("1.0.0");

program.addCommand(enrichPersonCommand);
program.addCommand(enrichOrgCommand);
program.addCommand(searchPeopleCommand);
program.addCommand(searchOrgsCommand);
program.addCommand(contactsCommand);
program.addCommand(accountsCommand);
program.addCommand(dealsCommand);
program.addCommand(sequencesCommand);

program.parse();

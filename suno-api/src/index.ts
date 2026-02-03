#!/usr/bin/env bun
import { program } from "commander";
import { generateCommand } from "./commands/generate";
import { creditsCommand } from "./commands/credits";
import { detailsCommand } from "./commands/details";
import { stemsCommand } from "./commands/stems";
import { replaceSectionCommand } from "./commands/replace-section";
import { midiCommand } from "./commands/midi";

program
  .name("suno-api")
  .description("Suno API CLI - raw API wrapper\n\nAPI docs: https://docs.sunoapi.org/llms.txt")
  .version("1.0.0");

program.addCommand(generateCommand);
program.addCommand(creditsCommand);
program.addCommand(detailsCommand);
program.addCommand(stemsCommand);
program.addCommand(replaceSectionCommand);
program.addCommand(midiCommand);

program.parse();

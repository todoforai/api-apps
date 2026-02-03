#!/usr/bin/env bun
import { program } from "commander";
import { voicesCommand } from "./commands/voices";
import { modelsCommand } from "./commands/models";
import { textToSpeechCommand } from "./commands/text-to-speech";
import { soundEffectsCommand } from "./commands/sound-effects";

program
  .name("elevenlabs-api")
  .description("ElevenLabs API CLI - raw API wrapper\n\nAPI docs: https://elevenlabs.io/docs/api-reference/text-to-speech/llms.txt")
  .version("1.0.0");

program.addCommand(voicesCommand);
program.addCommand(modelsCommand);
program.addCommand(textToSpeechCommand);
program.addCommand(soundEffectsCommand);

program.parse();

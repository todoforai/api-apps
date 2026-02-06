#!/usr/bin/env bun
import { program } from "commander";
import { reviewsCommand } from "./commands/reviews";

program
  .name("google-play-api")
  .description(
    "Google Play Developer API CLI - raw API wrapper\n\nAuth: GOOGLE_PLAY_ACCESS_TOKEN env var\nGet token: gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/androidpublisher\n\nAPI docs: https://developers.google.com/android-publisher/api-ref"
  )
  .version("1.0.0");

program.addCommand(reviewsCommand);

program.parse();

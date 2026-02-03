import { Command } from "commander";
import { get } from "../api";

export const voicesCommand = new Command("voices")
  .description("List available voices (GET /v1/voices)\n\nLatest doc: https://elevenlabs.io/docs/api-reference/voices/search.mdx")
  .action(async () => {
    const res = await get("/voices");
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

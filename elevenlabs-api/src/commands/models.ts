import { Command } from "commander";
import { get } from "../api";

export const modelsCommand = new Command("models")
  .description("List available models (GET /v1/models)\n\nLatest doc: https://elevenlabs.io/docs/api-reference/models/list.mdx")
  .action(async () => {
    const res = await get("/models");
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

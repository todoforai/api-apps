import { Command } from "commander";
import { get } from "../api";

export const creditsCommand = new Command("credits")
  .description("Check remaining credits (GET /api/v1/generate/credit)\n\nLatest doc: https://docs.sunoapi.org/suno-api/get-remaining-credits.md")
  .action(async () => {
    const res = await get("/api/v1/generate/credit");
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

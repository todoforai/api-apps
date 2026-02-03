import { Command } from "commander";
import { post } from "../api";

export const stemsCommand = new Command("stems")
  .description("Separate vocals & instruments (POST /api/v1/vocal-removal/generate)\n\nLatest doc: https://docs.sunoapi.org/suno-api/separate-vocals-from-music.md")
  .requiredOption("--taskId <id>", "Task ID of the music generation")
  .requiredOption("--audioId <id>", "Audio ID to separate")
  .option("--type <type>", "separate_vocal or split_stem")
  .option("--callBackUrl <url>", "Webhook endpoint")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      taskId: opts.taskId,
      audioId: opts.audioId,
    };
    if (opts.type) body.type = opts.type;
    if (opts.callBackUrl) body.callBackUrl = opts.callBackUrl;

    const res = await post("/api/v1/vocal-removal/generate", body);
    if (!res.ok) {
      const error = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(error);
      process.exit(1);
    }

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

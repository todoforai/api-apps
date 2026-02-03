import { Command } from "commander";
import { post } from "../api";

export const midiCommand = new Command("midi")
  .description("Generate MIDI from audio (POST /api/v1/midi/generate)\n\nLatest doc: https://docs.sunoapi.org/suno-api/generate-midi.md")
  .requiredOption("--taskId <id>", "Task ID from completed vocal separation")
  .option("--callBackUrl <url>", "Webhook endpoint")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      taskId: opts.taskId,
    };
    if (opts.callBackUrl) body.callBackUrl = opts.callBackUrl;

    const res = await post("/api/v1/midi/generate", body);
    if (!res.ok) {
      const error = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(error);
      process.exit(1);
    }

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

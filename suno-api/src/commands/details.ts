import { Command } from "commander";
import { get, pollForResult } from "../api";

export const detailsCommand = new Command("details")
  .description("Get task details/status (GET /api/v1/generate/record-info?taskId=)\n\nLatest doc: https://docs.sunoapi.org/suno-api/get-music-generation-details.md")
  .argument("<task_id>", "Task ID to check")
  .option("--wait", "Poll until task completes")
  .option("--max-attempts <n>", "Max polling attempts (default 60)", parseInt)
  .action(async (taskId: string, opts) => {
    if (opts.wait) {
      try {
        const result = await pollForResult(taskId, opts.maxAttempts ?? 60);
        console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : err}`);
        process.exit(1);
      }
      return;
    }

    const res = await get(`/api/v1/generate/record-info?taskId=${taskId}`);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

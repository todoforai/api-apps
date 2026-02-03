import { Command } from "commander";
import { post } from "../api";

export const replaceSectionCommand = new Command("replace-section")
  .description("Replace section of music (POST /api/v1/generate/replace-section)\n\nLatest doc: https://docs.sunoapi.org/suno-api/replace-section.md")
  .requiredOption("--taskId <id>", "Original music's parent task ID")
  .requiredOption("--audioId <id>", "Audio ID to replace")
  .requiredOption("--prompt <text>", "Prompt describing replacement content")
  .requiredOption("--tags <tags>", "Music style tags (e.g., Jazz, electronic)")
  .requiredOption("--title <title>", "Music title")
  .requiredOption("--infillStartS <n>", "Start time in seconds", parseFloat)
  .requiredOption("--infillEndS <n>", "End time in seconds", parseFloat)
  .option("--negativeTags <tags>", "Music styles to exclude")
  .option("--callBackUrl <url>", "Webhook endpoint")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      taskId: opts.taskId,
      audioId: opts.audioId,
      prompt: opts.prompt,
      tags: opts.tags,
      title: opts.title,
      infillStartS: opts.infillStartS,
      infillEndS: opts.infillEndS,
    };
    if (opts.negativeTags) body.negativeTags = opts.negativeTags;
    if (opts.callBackUrl) body.callBackUrl = opts.callBackUrl;

    const res = await post("/api/v1/generate/replace-section", body);
    if (!res.ok) {
      const error = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(error);
      process.exit(1);
    }

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  });

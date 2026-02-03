import { Command } from "commander";
import { post, pollForResult } from "../api";

export const generateCommand = new Command("generate")
  .description("Generate music from prompt (POST /api/v1/generate)\n\nLatest doc: https://docs.sunoapi.org/suno-api/generate-music.md")
  .argument("<prompt>", "Text prompt describing the music")
  .option("--customMode", "Enable advanced settings (required)")
  .option("--instrumental", "No vocals (required)")
  .option("--model <model>", "V3_5, V4, V4_5, V4_5PLUS, V4_5ALL, V5 (required)")
  .option("--style <style>", "Music genre/style (custom mode)")
  .option("--title <title>", "Track title (custom mode)")
  .option("--callBackUrl <url>", "Webhook endpoint")
  .option("--personaId <id>", "Persona style (custom mode)")
  .option("--negativeTags <tags>", "Styles to exclude")
  .option("--vocalGender <gender>", "m or f")
  .option("--styleWeight <n>", "Style guidance 0.00-1.00", parseFloat)
  .option("--weirdnessConstraint <n>", "Creative deviation 0.00-1.00", parseFloat)
  .option("--audioWeight <n>", "Input audio influence 0.00-1.00", parseFloat)
  .option("--no-poll", "Return task ID immediately without waiting")
  .option("--max-attempts <n>", "Max polling attempts (default 60)", parseInt)
  .action(async (prompt: string, opts) => {
    const body: Record<string, unknown> = { prompt };
    if (opts.customMode) body.customMode = true;
    if (opts.instrumental) body.instrumental = true;
    if (opts.model) body.model = opts.model;
    if (opts.style) body.style = opts.style;
    if (opts.title) body.title = opts.title;
    body.callBackUrl = opts.callBackUrl ?? "https://example.com/callback";
    if (opts.personaId) body.personaId = opts.personaId;
    if (opts.negativeTags) body.negativeTags = opts.negativeTags;
    if (opts.vocalGender) body.vocalGender = opts.vocalGender;
    if (opts.styleWeight !== undefined) body.styleWeight = opts.styleWeight;
    if (opts.weirdnessConstraint !== undefined) body.weirdnessConstraint = opts.weirdnessConstraint;
    if (opts.audioWeight !== undefined) body.audioWeight = opts.audioWeight;
    const res = await post("/api/v1/generate", body);
    if (!res.ok) {
      const error = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(error);
      process.exit(1);
    }

    const data = await res.json();
    console.error("Response:", JSON.stringify(data, null, 2));

    const taskId = data?.data?.taskId;
    if (!taskId) {
      console.error("Error: No taskId in response");
      process.exit(1);
    }

    if (!opts.poll) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    console.error(`Task ID: ${taskId}`);
    console.error("Polling for result...");

    try {
      const result = await pollForResult(taskId, opts.maxAttempts ?? 60);
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(`Error: ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  });

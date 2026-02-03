import { Command } from "commander";
import { post } from "../api";
import { writeFile } from "fs/promises";

export const soundEffectsCommand = new Command("sound-effects")
  .description("Generate sound effect from text (POST /v1/sound-generation)\n\nLatest doc: https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert.mdx")
  .argument("<text>", "Text describing the sound effect")
  .option("--duration_seconds <n>", "Duration 0.5-30 seconds", parseFloat)
  .option("--prompt_influence <n>", "How closely to follow prompt 0-1 (default 0.3)", parseFloat)
  .option("--loop", "Create seamlessly looping sound")
  .option("--model_id <model>", "Model ID (default: eleven_text_to_sound_v2)")
  .option("--output_format <format>", "Output format (mp3, pcm, etc)")
  .option("-o, --output <file>", "Output file path")
  .action(async (text: string, opts) => {
    const body: Record<string, unknown> = { text };

    if (opts.duration_seconds !== undefined) body.duration_seconds = opts.duration_seconds;
    if (opts.prompt_influence !== undefined) body.prompt_influence = opts.prompt_influence;
    if (opts.loop) body.loop = true;
    if (opts.model_id) body.model_id = opts.model_id;

    let endpoint = "/sound-generation";
    if (opts.output_format) {
      endpoint += `?output_format=${opts.output_format}`;
    }

    const res = await post(endpoint, body);
    if (!res.ok) {
      const error = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(error);
      process.exit(1);
    }

    const audioBuffer = await res.arrayBuffer();

    if (opts.output) {
      await writeFile(opts.output, Buffer.from(audioBuffer));
      console.log(`Audio saved to ${opts.output}`);
    } else {
      process.stdout.write(Buffer.from(audioBuffer));
    }
  });

import { Command } from "commander";
import { post } from "../api";
import { writeFile } from "fs/promises";

export const textToSpeechCommand = new Command("text-to-speech")
  .description("Convert text to speech (POST /v1/text-to-speech/{voice_id})\n\nLatest doc: https://elevenlabs.io/docs/api-reference/text-to-speech/convert.mdx")
  .argument("<voice_id>", "Voice ID to use")
  .argument("<text>", "Text to convert to speech")
  .option("--model_id <model_id>", "Model ID (e.g. eleven_multilingual_v2)")
  .option("--output_format <format>", "Output format (e.g. mp3_44100_128)")
  .option("--voice_settings.stability <value>", "Voice stability (0-1)", parseFloat)
  .option("--voice_settings.similarity_boost <value>", "Similarity boost (0-1)", parseFloat)
  .option("--voice_settings.style <value>", "Style (0-1)", parseFloat)
  .option("--voice_settings.speed <value>", "Speed (0.25-4.0)", parseFloat)
  .option("--with-timestamps", "Return audio with word-level timestamps")
  .option("-o, --output <file>", "Output file path")
  .action(async (voiceId: string, text: string, opts) => {
    const body: Record<string, unknown> = { text };

    if (opts.model_id) body.model_id = opts.model_id;
    if (opts.output_format) body.output_format = opts.output_format;

    const voiceSettings: Record<string, number> = {};
    if (opts["voice_settings.stability"] !== undefined) {
      voiceSettings.stability = opts["voice_settings.stability"];
    }
    if (opts["voice_settings.similarity_boost"] !== undefined) {
      voiceSettings.similarity_boost = opts["voice_settings.similarity_boost"];
    }
    if (opts["voice_settings.style"] !== undefined) {
      voiceSettings.style = opts["voice_settings.style"];
    }
    if (opts["voice_settings.speed"] !== undefined) {
      voiceSettings.speed = opts["voice_settings.speed"];
    }
    if (Object.keys(voiceSettings).length > 0) {
      body.voice_settings = voiceSettings;
    }

    const endpoint = opts.withTimestamps
      ? `/text-to-speech/${voiceId}/with-timestamps`
      : `/text-to-speech/${voiceId}`;

    const res = await post(endpoint, body);
    if (!res.ok) {
      const error = await res.text();
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(error);
      process.exit(1);
    }

    if (opts.withTimestamps) {
      const json = await res.json();
      const audioBase64 = json.audio_base64;
      const alignment = json.alignment;

      if (opts.output) {
        // Save audio file
        const audioBuffer = Buffer.from(audioBase64, "base64");
        await writeFile(opts.output, audioBuffer);
        console.log(`Audio saved to ${opts.output}`);

        // Save alignment JSON alongside
        const alignmentPath = opts.output.replace(/\.[^.]+$/, ".json");
        await writeFile(alignmentPath, JSON.stringify(alignment, null, 2));
        console.log(`Alignment saved to ${alignmentPath}`);
      } else {
        // Output full JSON response
        console.log(JSON.stringify(json, null, 2));
      }
    } else {
      const audioBuffer = await res.arrayBuffer();

      if (opts.output) {
        await writeFile(opts.output, Buffer.from(audioBuffer));
        console.log(`Audio saved to ${opts.output}`);
      } else {
        process.stdout.write(Buffer.from(audioBuffer));
      }
    }
  });

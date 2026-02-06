import { Command } from "commander";
import { get } from "../api";

export const voicesCommand = new Command("voices")
  .description("List available voices (GET /v1/voices)\n\nLatest doc: https://elevenlabs.io/docs/api-reference/voices/search.mdx")
  .option("--search <term>", "Search in name, description, labels, category")
  .option("--category <cat>", "Filter by category (premade, cloned, generated, professional)")
  .option("--language <lang>", "Filter by verified language code (e.g. hu, en, de)")
  .action(async (opts) => {
    const params = new URLSearchParams();
    if (opts.search) params.set("search", opts.search);
    if (opts.category) params.set("category", opts.category);

    const url = "/voices" + (params.toString() ? `?${params}` : "");
    const res = await get(url);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const data = await res.json();

    // Client-side filter by verified language
    if (opts.language) {
      data.voices = data.voices.filter((v: any) =>
        v.verified_languages?.some((l: any) => l.language === opts.language)
      );
    }

    console.log(JSON.stringify(data, null, 2));
  });

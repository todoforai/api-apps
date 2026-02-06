import { Command } from "commander";
import { get, post } from "../api";

const list = new Command("list")
  .description(
    "List reviews (GET /applications/{packageName}/reviews)"
  )
  .argument("<packageName>", "Application package name")
  .option("--token <token>", "Pagination token")
  .option("--startIndex <n>", "Start index", parseInt)
  .option("--maxResults <n>", "Max results", parseInt)
  .option("--translationLanguage <lang>", "BCP-47 language for translation")
  .action(async (packageName: string, opts) => {
    const params = new URLSearchParams();
    if (opts.token) params.set("token", opts.token);
    if (opts.startIndex != null) params.set("startIndex", String(opts.startIndex));
    if (opts.maxResults != null) params.set("maxResults", String(opts.maxResults));
    if (opts.translationLanguage) params.set("translationLanguage", opts.translationLanguage);

    const qs = params.toString();
    const res = await get(
      `/applications/${packageName}/reviews${qs ? `?${qs}` : ""}`
    );
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const getReview = new Command("get")
  .description(
    "Get a single review (GET /applications/{packageName}/reviews/{reviewId})"
  )
  .argument("<packageName>", "Application package name")
  .argument("<reviewId>", "Review ID")
  .option("--translationLanguage <lang>", "BCP-47 language for translation")
  .action(async (packageName: string, reviewId: string, opts) => {
    const params = new URLSearchParams();
    if (opts.translationLanguage) params.set("translationLanguage", opts.translationLanguage);

    const qs = params.toString();
    const res = await get(
      `/applications/${packageName}/reviews/${reviewId}${qs ? `?${qs}` : ""}`
    );
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const reply = new Command("reply")
  .description(
    "Reply to a review (POST /applications/{packageName}/reviews/{reviewId}:reply)"
  )
  .argument("<packageName>", "Application package name")
  .argument("<reviewId>", "Review ID")
  .argument("<replyText>", "Reply text")
  .action(async (packageName: string, reviewId: string, replyText: string) => {
    const res = await post(
      `/applications/${packageName}/reviews/${reviewId}:reply`,
      { replyText }
    );
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

export const reviewsCommand = new Command("reviews")
  .description("Manage app reviews")
  .addCommand(list)
  .addCommand(getReview)
  .addCommand(reply);

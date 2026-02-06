import { Command } from "commander";
import { post, patch } from "../api";

const list = new Command("list")
  .description("List deals (POST /api/v1/deals/search)")
  .option("--page <n>", "Page number", parseInt)
  .option("--per-page <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.page) body.page = opts.page;
    if (opts.perPage) body.per_page = opts.perPage;

    const res = await post("/api/v1/deals/search", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const create = new Command("create")
  .description("Create a deal (POST /api/v1/deals)")
  .option("--name <name>", "Deal name")
  .option("--amount <amount>", "Deal amount", parseFloat)
  .option("--deal-stage-id <id>", "Deal stage ID")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.name) body.name = opts.name;
    if (opts.amount !== undefined) body.amount = opts.amount;
    if (opts.dealStageId) body.deal_stage_id = opts.dealStageId;

    const res = await post("/api/v1/deals", body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

const update = new Command("update")
  .description("Update a deal (PATCH /api/v1/deals/:id)")
  .argument("<id>", "Deal ID")
  .option("--name <name>", "Deal name")
  .option("--amount <amount>", "Deal amount", parseFloat)
  .option("--deal-stage-id <id>", "Deal stage ID")
  .action(async (id: string, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.name) body.name = opts.name;
    if (opts.amount !== undefined) body.amount = opts.amount;
    if (opts.dealStageId) body.deal_stage_id = opts.dealStageId;

    const res = await patch(`/api/v1/deals/${id}`, body);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(JSON.stringify(await res.json(), null, 2));
  });

export const dealsCommand = new Command("deals")
  .description("Manage deals")
  .addCommand(list)
  .addCommand(create)
  .addCommand(update);

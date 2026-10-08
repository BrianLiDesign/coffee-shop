import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { seedOfferings } from "@/database/seedOffering";

async function main() {
  let stage = "configuration";
  try {
    if (process.argv.slice(2).join(" ") !== "--confirm") throw new Error("confirmation");
    loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
    const uri = process.env.MONGO_URI;
    const match = uri && /^mongodb(?:\+srv)?:\/\/[^/]+\/([A-Za-z0-9_-]+)(?:\?.*)?$/.exec(uri);
    if (!match || ["admin", "local", "config"].includes(match[1]) || /[{}<>]|YOUR_|CHANGE_ME|placeholder/i.test(uri!))
      throw new Error("configuration");
    stage = "database";
    const inserted = await seedOfferings();
    console.log(`PASS seed: inserted ${inserted} offerings; existing records were preserved.`);
  } catch {
    console.error(
      `FAIL seed ${stage}: use --confirm and a private MONGO_URI with an explicit shop database. Check database access; no credentials printed.`,
    );
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void main();

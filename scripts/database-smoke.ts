import connectDB from "../src/database/db";

async function main() {
  try {
    await connectDB();
    console.log("MongoDB smoke test passed");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB smoke test failed:", error);
    process.exit(1);
  }
}

main();

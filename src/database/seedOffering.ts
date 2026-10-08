import connectDB from "@/database/db";
import OfferingModel from "@/database/offeringModel";
import { OfferingList } from "@/database/offering";

/** Deliberate insert-only seed. Never run automatically on a request or deployment. */
export async function seedOfferings(): Promise<number> {
  await connectDB();
  await OfferingModel.init();
  const result = await OfferingModel.bulkWrite(
    OfferingList.map(({ ID, ...details }) => ({
      updateOne: {
        filter: { seedKey: `coffee-shop-v1-${ID}` },
        update: { $setOnInsert: { ...details, seedKey: `coffee-shop-v1-${ID}` } },
        upsert: true,
      },
    })),
  );
  return result.upsertedCount;
}

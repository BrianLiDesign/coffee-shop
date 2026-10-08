import mongoose, { Schema, type Model, type Types } from "mongoose";
import { OFFERING_CATEGORIES, OFFERING_INPUT_LIMITS, type Offering } from "@/types/offering";

export type OfferingRecord = Omit<Offering, "ID"> & { _id: Types.ObjectId; seedKey?: string };

const schema = new Schema<OfferingRecord>({
  name: { type: String, required: true, trim: true, maxlength: OFFERING_INPUT_LIMITS.name },
  description: { type: String, required: true, trim: true, maxlength: OFFERING_INPUT_LIMITS.description },
  price: {
    type: Number,
    required: true,
    min: 0,
    validate: (value: number) => Number.isFinite(value) && Math.abs(value * 100 - Math.round(value * 100)) <= 1e-8,
  },
  category: { type: String, required: true, enum: OFFERING_CATEGORIES },
  specialOffer: { type: Boolean, default: false },
  seedKey: { type: String, immutable: true },
});
schema.index({ seedKey: 1 }, { unique: true, partialFilterExpression: { seedKey: { $type: "string" } } });

export default (mongoose.models.Offering as Model<OfferingRecord> | undefined) ??
  mongoose.model<OfferingRecord>("Offering", schema);

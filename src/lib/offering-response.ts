import { OFFERING_CATEGORIES, type Offering } from "@/types/offering";

/** Validate external responses before sorting or rendering them. */
export function isOffering(value: unknown): value is Offering {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Offering>;
  return (
    typeof item.ID === "string" &&
    item.ID.length > 0 &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.description === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    OFFERING_CATEGORIES.some((category) => category === item.category) &&
    typeof item.specialOffer === "boolean"
  );
}

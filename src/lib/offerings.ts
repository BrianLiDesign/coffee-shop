import type { CreateOfferingInput, Offering, OfferingCategory, OfferingErrorEnvelope } from "@/types/offering";

export const OFFERING_CATEGORIES = ["Coffee", "Tea", "Smoothie"] as const;

export const OFFERING_LIMITS = {
  nameMax: 100,
  descriptionMax: 500,
  priceMin: 0,
};

export function isOfferingCategory(value: string): value is OfferingCategory {
  return OFFERING_CATEGORIES.some((category) => category === value);
}

type OfferingInputValues = Omit<
  Partial<CreateOfferingInput>,
  "name" | "description" | "category" | "price" | "specialOffer"
> & {
  name?: unknown;
  description?: unknown;
  category?: unknown;
  price?: unknown;
  specialOffer?: unknown;
};

export function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseOfferingPrice(value: unknown): number {
  if (typeof value === "string" && value.trim() === "") {
    return Number.NaN;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function normalizeOfferingInput(input: OfferingInputValues): CreateOfferingInput {
  const price = parseOfferingPrice(input.price);
  const category = cleanText(input.category);

  if (!isOfferingCategory(category)) {
    throw new Error("Choose a valid category.");
  }
  if (input.specialOffer !== undefined && typeof input.specialOffer !== "boolean") {
    throw new Error("Special offer must be a boolean.");
  }

  return {
    name: cleanText(input.name),
    description: cleanText(input.description),
    category,
    price: Number.isFinite(price) ? price : Number.NaN,
    specialOffer: input.specialOffer ?? false,
  };
}

export function validateOfferingInput(input: OfferingInputValues): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = cleanText(input.name);
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > OFFERING_LIMITS.nameMax) {
    errors.name = `Name must be ${OFFERING_LIMITS.nameMax} characters or fewer.`;
  }

  const description = cleanText(input.description);
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > OFFERING_LIMITS.descriptionMax) {
    errors.description = `Description must be ${OFFERING_LIMITS.descriptionMax} characters or fewer.`;
  }

  const category = cleanText(input.category);
  if (!category) {
    errors.category = "Category is required.";
  } else if (!isOfferingCategory(category)) {
    errors.category = "Choose a valid category.";
  }

  if (input.specialOffer !== undefined && typeof input.specialOffer !== "boolean") {
    errors.specialOffer = "Special offer must be a boolean.";
  }

  const price = parseOfferingPrice(input.price);
  if (!Number.isFinite(price)) {
    errors.price = "Price must be a valid number.";
  } else if (price < OFFERING_LIMITS.priceMin) {
    errors.price = "Price must be zero or greater.";
  } else if (Math.abs(price * 100 - Math.round(price * 100)) > 1e-8) {
    errors.price = "Price can have at most two decimal places.";
  }

  return errors;
}

export function toErrorEnvelope(code: string, message: string, fields?: Record<string, string>): OfferingErrorEnvelope {
  return {
    error: {
      code,
      message,
      ...(fields && Object.keys(fields).length > 0 ? { fields } : {}),
    },
  };
}

export function sortOfferings(offerings: Offering[]): Offering[] {
  return [...offerings].sort((left, right) => left.name.localeCompare(right.name) || left.ID.localeCompare(right.ID));
}

export async function fetchOfferings(signal?: AbortSignal): Promise<Offering[]> {
  const response = await fetch("/api/offerings", { method: "GET", signal });
  if (!response.ok) {
    throw new Error("We could not load the current offerings.");
  }

  const payload = (await response.json()) as Offering[];
  return sortOfferings(payload);
}

export class OfferingApiError extends Error {
  constructor(
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "OfferingApiError";
  }
}

export async function submitOffering(input: Partial<CreateOfferingInput>): Promise<Offering> {
  const normalized = normalizeOfferingInput(input);

  const response = await fetch("/api/offerings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalized),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as OfferingErrorEnvelope | null;

    const message = payload?.error?.message ?? "The offering could not be saved.";
    const fields = payload?.error?.fields ?? {};
    throw new OfferingApiError(message, fields);
  }

  return (await response.json()) as Offering;
}

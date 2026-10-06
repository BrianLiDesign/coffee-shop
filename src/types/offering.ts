export type OfferingCategory = "Coffee" | "Tea" | "Smoothie";

export interface Offering {
  ID: string;
  name: string;
  description: string;
  price: number;
  category: OfferingCategory;
  specialOffer: boolean;
}

export interface CreateOfferingInput {
  name: string;
  description: string;
  price: number;
  category: OfferingCategory;
  specialOffer?: boolean;
}

export interface OfferingErrorEnvelope {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

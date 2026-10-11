import { Offering, CreateOfferingInput } from "@/types/offering";
import { OfferingList } from "@/database/offering";

export interface OfferingStore {
  list: () => Promise<Offering[]>;
  create: (input: CreateOfferingInput) => Promise<Offering>;
}

export class InMemoryOfferingStore implements OfferingStore {
  private offerings: Offering[] = [...OfferingList];
  private nextId = OfferingList.length + 1;

  async list(): Promise<Offering[]> {
    return [...this.offerings];
  }

  async create(input: CreateOfferingInput): Promise<Offering> {
    const newOffering: Offering = {
      ID: String(this.nextId++),
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      specialOffer: input.specialOffer ?? false,
    };
    this.offerings.push(newOffering);
    return newOffering;
  }
}

export class SortedTestOfferingStore extends InMemoryOfferingStore {
  async list(): Promise<Offering[]> {
    const data = await super.list();
    return [...data].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return a.ID.localeCompare(b.ID);
    });
  }
}

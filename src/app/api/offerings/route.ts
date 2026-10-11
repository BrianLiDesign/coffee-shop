import { InMemoryOfferingStore } from "@/lib/offering-store";
import { getHandler, postHandler } from "./handlers";

const publicStore = new InMemoryOfferingStore();

export async function GET() {
  return getHandler(publicStore);
}

export async function POST(request: Request) {
  return postHandler(publicStore, request);
}

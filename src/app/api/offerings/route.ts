import { NextResponse } from "next/server";

import { OfferingList } from "@/database/offering";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(OfferingList);
}

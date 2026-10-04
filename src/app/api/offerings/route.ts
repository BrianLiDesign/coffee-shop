import { NextResponse } from "next/server";
import { InMemoryOfferingStore } from "@/lib/offering-store";
import { CreateOfferingInput } from "@/types/offering";

const store = new InMemoryOfferingStore();

export async function GET() {
  try {
    const data = await store.list();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Bad Request", message: "Malformed JSON" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported Media Type", message: "Content-Type must be application/json" },
      { status: 415 },
    );
  }

  // 2. 解析 JSON (400)
  let body: any;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Bad Request", message: "Malformed JSON" }, { status: 400 });
  }

  const validationResult = validateInput(body);
  if (!validationResult.valid) {
    return NextResponse.json({ error: "Bad Request", message: validationResult.message }, { status: 400 });
  }

  try {
    const created = await store.create(validationResult.data as CreateOfferingInput);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Service Unavailable", message: "Storage failure" }, { status: 503 });
  }
}

function validateInput(body: any): { valid: boolean; message?: string; data?: Partial<CreateOfferingInput> } {
  if (typeof body !== "object" || body === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const allowedKeys = ["name", "description", "price", "category", "specialOffer"];
  const keys = Object.keys(body);

  for (const key of keys) {
    if (!allowedKeys.includes(key)) {
      return { valid: false, message: `Unknown or identity field: ${key}` };
    }
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0 || body.name.trim().length > 30) {
    return { valid: false, message: "Name must be a non-empty string with max length 30" };
  }

  if (body.description !== undefined && (typeof body.description !== "string" || body.description.length > 200)) {
    return { valid: false, message: "Description must be a string with max length 200" };
  }

  if (typeof body.price !== "number" || body.price < 0) {
    return { valid: false, message: "Price must be a non-negative number" };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(body.price.toString())) {
    return { valid: false, message: "Price must have at most two decimal places" };
  }

  const allowedCategories = ["Coffee", "Tea", "Smoothie"];
  if (typeof body.category !== "string" || !allowedCategories.includes(body.category)) {
    return { valid: false, message: "Invalid category" };
  }

  if (body.specialOffer !== undefined && typeof body.specialOffer !== "boolean") {
    return { valid: false, message: "Special offer must be a boolean" };
  }

  return { valid: true, data: body as CreateOfferingInput };
}

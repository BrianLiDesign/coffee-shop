import { GET, POST } from "./route";

function createMockRequest(body: any, contentType: string = "application/json") {
  return new Request("http://localhost/api/offerings", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: JSON.stringify(body),
  });
}

describe("Offerings API", () => {
  const validInput = {
    name: "Test Coffee",
    description: "A lovely test coffee",
    price: 4.99,
    category: "Coffee",
    specialOffer: true,
  };

  it("should return 201 and create an offering with valid input", async () => {
    const req = createMockRequest(validInput);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe("Test Coffee");
    expect(data.ID).toBeDefined();
  });

  it("should return 415 for unsupported content type", async () => {
    const req = createMockRequest(validInput, "text/plain");
    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("should return 400 for malformed JSON", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ bad json }",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 for unknown fields", async () => {
    const req = createMockRequest({ ...validInput, hacker: "bad" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 for negative price", async () => {
    const req = createMockRequest({ ...validInput, price: -5 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 for price with three decimal places", async () => {
    const req = createMockRequest({ ...validInput, price: 5.999 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 200 and the list of offerings on GET", async () => {
    await POST(createMockRequest({ ...validInput, name: "AAA Coffee" }));
    await POST(createMockRequest({ ...validInput, name: "ZZZ Coffee" }));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length >= 2) {
      expect(data[0].name).toBe("AAA Coffee");
      expect(data[1].name).toBe("ZZZ Coffee");
    }
  });
});

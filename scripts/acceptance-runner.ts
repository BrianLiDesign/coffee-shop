import process from "node:process";

const BASE_URL = process.env.ACCEPTANCE_BASE_URL ?? "http://127.0.0.1:3000";

function expect(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const text = await response.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {}
  return { status: response.status, body };
}

async function testEmptyGet() {
  const result = await request("/api/offerings");
  expect(result.status === 200, "GET /api/offerings should return 200");
  expect(Array.isArray(result.body), "GET body should be an array");
  expect((result.body as unknown[]).length === 0, "empty database should return []");
}

async function testCreateOffering() {
  const result = await request("/api/offerings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Vanilla Latte",
      description: "Espresso and steamed milk",
      price: 5.75,
      category: "Coffee",
    }),
  });

  expect(result.status === 201, "POST should return 201");
}

(async () => {
  await testEmptyGet();
  await testCreateOffering();
  console.log("acceptance checks passed");
})();

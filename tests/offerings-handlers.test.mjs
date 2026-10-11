import assert from "node:assert/strict";
import { test } from "node:test";
import { getHandler, postHandler } from "../src/app/api/offerings/handlers.ts";
import { SortedTestOfferingStore } from "../src/lib/offering-store.ts";

const testStore = new SortedTestOfferingStore();

function createMockRequest(body, contentType = "application/json") {
  return new Request("http://localhost/api/offerings", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: JSON.stringify(body),
  });
}

test("GET returns sorted offerings from test store", async () => {
  const res = await getHandler(testStore);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data[0].name, "Cafe au Lait");
  assert.equal(data[1].name, "Cappuccino");
});

test("POST creates an offering in test store", async () => {
  const input = {
    name: "Test Coffee",
    description: "A lovely test coffee",
    price: 4.99,
    category: "Coffee",
    specialOffer: true,
  };
  const req = createMockRequest(input);
  const res = await postHandler(testStore, req);
  const data = await res.json();
  assert.equal(res.status, 201);
  assert.equal(data.name, "Test Coffee");
  assert.equal(typeof data.ID, "string");
});

test("POST rejects unknown fields", async () => {
  const req = createMockRequest({ name: "Bad", price: 1, category: "Coffee", hacker: "bad" });
  const res = await postHandler(testStore, req);
  assert.equal(res.status, 400);
});

test("POST rejects malformed JSON", async () => {
  const req = new Request("http://localhost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{ bad json }",
  });
  const res = await postHandler(testStore, req);
  assert.equal(res.status, 400);
});

test("POST rejects wrong content type", async () => {
  const req = createMockRequest({ name: "A", price: 1, category: "Coffee" }, "text/plain");
  const res = await postHandler(testStore, req);
  assert.equal(res.status, 415);
});

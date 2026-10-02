import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { startHttpServer } from "./helpers/http-server.mjs";

let server;
before(
  async () => {
    server = await startHttpServer();
  },
  { timeout: 120_000 },
);
after(
  async () => {
    await server?.stop();
  },
  { timeout: 15_000 },
);

test("GET exposes string identities for all offerings", async () => {
  const response = await fetch(`${server.baseUrl}/api/offerings`);
  assert.equal(response.status, 200);
  const offerings = await response.json();
  assert.equal(offerings.length, 16);
  for (const offering of offerings) {
    assert.equal(typeof offering.ID, "string", `${offering.name} must have a string ID`);
    assert.notEqual(offering.ID, "");
  }
  assert.equal(new Set(offerings.map((offering) => offering.ID)).size, 16);
});

test("GET preserves the starting menu and public offering fields", async () => {
  const response = await fetch(`${server.baseUrl}/api/offerings`);
  assert.match(response.headers.get("content-type"), /application\/json/);
  const offerings = await response.json();
  assert.deepEqual(
    offerings.map((offering) => offering.name),
    [
      "Cappuccino",
      "Pumpkin Spice Latte",
      "Golden Hour Cold Brew",
      "Mocha",
      "Espresso",
      "Latte",
      "Cortado",
      "English Breakfast Tea",
      "Matcha",
      "Chai Latte",
      "Chamomile Tea",
      "Cafe au Lait",
      "London Fog",
      "Iced Hibiscus Berry",
      "Fruit Smoothie",
      "Hojicha Latte",
    ],
  );
  for (const offering of offerings) {
    assert.deepEqual(Object.keys(offering).sort(), ["ID", "category", "description", "name", "price", "specialOffer"]);
    assert.ok(["Coffee", "Tea", "Smoothie"].includes(offering.category));
    assert.equal(typeof offering.price, "number");
    assert.equal(typeof offering.specialOffer, "boolean");
  }
  const { ID, ...cappuccino } = offerings[0];
  assert.deepEqual(cappuccino, {
    name: "Cappuccino",
    description: "A delicious cappuccino with steamed milk and foam",
    price: 5.9,
    category: "Coffee",
    specialOffer: false,
  });
});

test("GET flags exactly the three starting special offerings", async () => {
  const response = await fetch(`${server.baseUrl}/api/offerings`);
  const offerings = await response.json();
  assert.deepEqual(
    offerings.filter((offering) => offering.specialOffer).map((offering) => offering.name),
    ["Pumpkin Spice Latte", "Golden Hour Cold Brew", "Hojicha Latte"],
  );
});

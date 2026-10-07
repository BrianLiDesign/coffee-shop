import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { startHttpServer } from "./helpers/http-server.mjs";

type Server = Awaited<ReturnType<typeof startHttpServer>>;

let server: Server;

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

test("GET /api/offerings returns the expected list", async () => {
  const response = await fetch(`${server.baseUrl}/api/offerings`);
  assert.equal(response.status, 200);

  const offerings = await response.json();
  assert.equal(Array.isArray(offerings), true);
  assert.ok(offerings.length > 0);

  for (const offering of offerings) {
    assert.equal(typeof offering.ID, "string");
    assert.equal(typeof offering.name, "string");
    assert.equal(typeof offering.price, "number");
  }
});

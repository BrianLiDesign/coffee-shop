import assert from "node:assert/strict";
import { register } from "node:module";
import { after, afterEach, before, describe, it, mock, test } from "node:test";
import { JSDOM } from "jsdom";
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

// Test-only fixtures. Names, categories, and flags mirror the starting menu.
const offeringFixture = (ID, name, category, specialOffer, price = 4.5) => ({
  ID,
  name,
  description: `${name} description`,
  price,
  category,
  specialOffer,
});
const ordinaryItems = [
  offeringFixture("test-cappuccino", "Cappuccino", "Coffee", false, 5.9),
  offeringFixture("test-mocha", "Mocha", "Coffee", false),
  offeringFixture("test-matcha", "Matcha", "Tea", false),
  offeringFixture("test-smoothie", "Fruit Smoothie", "Smoothie", false),
];
const startingSpecials = [
  offeringFixture("test-psl", "Pumpkin Spice Latte", "Coffee", true),
  offeringFixture("test-golden-hour", "Golden Hour Cold Brew", "Coffee", true),
  offeringFixture("test-hojicha", "Hojicha Latte", "Tea", true),
];
const newSpecial = offeringFixture("test-cardamom", "Cardamom Latte", "Coffee", true);

const menuProps = { title: "Menu", intro: "intro", emptyMessage: "Nothing here yet." };
const specialsProps = { title: "Specials", intro: "intro", emptyMessage: "No specials right now.", specialsOnly: true };

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("OfferingsPage with controlled responses", () => {
  const realFetch = globalThis.fetch;
  const mounted = [];
  let React;
  let createRoot;
  let act;
  let fetchCalls = [];
  let OfferingsPage;

  before(async () => {
    const hooks = `export async function resolve(specifier, context, nextResolve) {
      if (specifier.endsWith(".css")) {
        const stub = "export default new Proxy({}, { get: (_, key) => String(key) });";
        return { url: "data:text/javascript," + encodeURIComponent(stub), format: "module", shortCircuit: true };
      }
      return nextResolve(specifier, context);
    }`;
    register(`data:text/javascript,${encodeURIComponent(hooks)}`);

    const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" });
    const define = (key, value) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    define("window", dom.window);
    define("document", dom.window.document);
    define("navigator", dom.window.navigator);
    define("IS_REACT_ACT_ENVIRONMENT", true);

    React = ((m) => m.default ?? m)(await import("react"));
    createRoot = ((m) => m.default ?? m)(await import("react-dom/client")).createRoot;
    act = React.act ?? React.unstable_act;
    OfferingsPage = (await import("../src/components/OfferingsPage.tsx")).default;
  });

  afterEach(async () => {
    while (mounted.length) {
      const { root, container } = mounted.pop();
      try {
        await act(async () => root.unmount());
      } catch {
        // already unmounted
      }
      container.remove();
    }
    globalThis.fetch = realFetch;
    mock.restoreAll();
  });

  function stubFetch(handler) {
    fetchCalls = [];
    globalThis.fetch = async (url) => {
      fetchCalls.push(String(url));
      return handler();
    };
  }

  async function renderPage(props) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ root, container });
    await act(async () => root.render(React.createElement(OfferingsPage, props)));
    return container;
  }

  async function waitFor(check, tries = 50) {
    for (let i = 0; i < tries; i += 1) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      try {
        return check();
      } catch {
        // keep waiting
      }
    }
    return check();
  }

  const itemNames = (container) => [...container.querySelectorAll("li h2")].map((node) => node.textContent).sort();
  const namesOf = (list) => list.map((offering) => offering.name).sort();
  const alertText = (container) => container.querySelector('[role="alert"]')?.textContent;

  it("shows loading while the request is pending", async () => {
    stubFetch(() => new Promise(() => {}));
    const container = await renderPage(menuProps);
    assert.match(container.textContent, /Loading menu\.\.\./);
  });

  for (const [label, props] of [
    ["Menu", menuProps],
    ["Specials", specialsProps],
  ]) {
    it(`shows the empty message for ${label} on []`, async () => {
      stubFetch(() => jsonResponse([]));
      const container = await renderPage(props);
      await waitFor(() => assert.match(container.textContent, new RegExp(props.emptyMessage)));
      assert.equal(container.querySelectorAll("li").length, 0);
    });
  }

  it("shows the envelope message and no items or empty message on a 503", async () => {
    stubFetch(() => jsonResponse({ error: { code: "DATABASE_UNAVAILABLE", message: "Please try again." } }, 503));
    const container = await renderPage(menuProps);
    await waitFor(() => assert.equal(alertText(container), "Please try again."));
    assert.equal(container.querySelectorAll("li").length, 0);
    assert.doesNotMatch(container.textContent, new RegExp(menuProps.emptyMessage));
  });

  it("falls back to the generic message when a failure body is not the envelope", async () => {
    stubFetch(() => new Response("<html>bad gateway</html>", { status: 502 }));
    const container = await renderPage(menuProps);
    await waitFor(() => assert.equal(alertText(container), "Unable to load menu."));
  });

  it("shows an alert when the request rejects", async () => {
    stubFetch(() => Promise.reject(new Error("offline")));
    const container = await renderPage(menuProps);
    await waitFor(() => assert.equal(alertText(container), "offline"));
  });

  it("treats a non-array 200 body as a failure", async () => {
    stubFetch(() => jsonResponse({ not: "an array" }));
    const container = await renderPage(menuProps);
    await waitFor(() => assert.equal(alertText(container), "Unable to load menu."));
    assert.equal(container.querySelectorAll("li").length, 0);
  });

  it("Menu includes every response item from /api/offerings", async () => {
    const all = [...ordinaryItems, ...startingSpecials];
    stubFetch(() => jsonResponse(all));
    const container = await renderPage(menuProps);
    await waitFor(() => assert.equal(container.querySelectorAll("li").length, all.length));
    assert.deepEqual(itemNames(container), namesOf(all));
    assert.deepEqual(fetchCalls, ["/api/offerings"]);
    assert.match(container.textContent, /\$5\.90/);
  });

  it("Specials shows exactly the three starting specials and no ordinary items", async () => {
    stubFetch(() => jsonResponse([...ordinaryItems, ...startingSpecials]));
    const container = await renderPage(specialsProps);
    await waitFor(() => assert.equal(container.querySelectorAll("li").length, 3));
    assert.deepEqual(itemNames(container), namesOf(startingSpecials));
    for (const item of ordinaryItems) assert.doesNotMatch(container.textContent, new RegExp(item.name));
  });

  it("shows a newly supplied special in Specials and Menu (fresh mount, not live update)", async () => {
    const withNew = [...ordinaryItems, ...startingSpecials, newSpecial];
    stubFetch(() => jsonResponse(withNew));
    const specials = await renderPage(specialsProps);
    await waitFor(() => assert.equal(specials.querySelectorAll("li").length, 4));
    assert.ok(itemNames(specials).includes("Cardamom Latte"));
    const menu = await renderPage(menuProps);
    await waitFor(() => assert.equal(menu.querySelectorAll("li").length, withNew.length));
    assert.ok(itemNames(menu).includes("Cardamom Latte"));
  });

  it("uses string IDs as keys without React key warnings", async () => {
    const all = [...ordinaryItems, ...startingSpecials, newSpecial];
    assert.ok(all.every((offering) => typeof offering.ID === "string" && offering.ID !== ""));
    assert.equal(new Set(all.map((offering) => offering.ID)).size, all.length);
    const errors = mock.method(console, "error", () => {});
    stubFetch(() => jsonResponse(all));
    const container = await renderPage(menuProps);
    await waitFor(() => assert.equal(container.querySelectorAll("li").length, all.length));
    assert.equal(errors.mock.calls.filter((call) => /key/i.test(String(call.arguments[0]))).length, 0);
  });
});

// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import OfferingsPage from "@/components/OfferingsPage";
import { jsonResponse, sampleOffering } from "./helpers/offerings";
afterEach(cleanup);

const props = { title: "Menu", intro: "Our drinks", emptyMessage: "No offerings yet." };

// Foundation example only. This is not one of Vedika's three contributions.
it("announces loading while a request is pending", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise<Response>(() => {})),
  );
  render(<OfferingsPage {...props} />);
  expect(screen.getByRole("status").textContent).toBe("Loading menu...");
});

// Issue #35: write three NEW cases below. See ./README.md for the requirements.
// Leave the example above in place; do not count it as a personal contribution.
//Personally add three Vitest cases: Specials shows empty feedback when none are special;
//network failure shows an error instead of an empty menu;
// unreadable API errors show useful fallback feedback.

it("Specials shows empty feedback when none are special", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([sampleOffering])));

  render(<OfferingsPage {...props} specialsOnly />);

  expect(await screen.findByText(props.emptyMessage)).toBeTruthy();
  expect(screen.queryByText("Latte")).toBeNull();
});

it("network failure shows error instead of empty menu", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

  render(<OfferingsPage {...props} />);

  expect(await screen.findByText("Unable to load menu.")).toBeTruthy();
  expect(screen.queryByText(props.emptyMessage)).toBeNull();
});

it("unreadable API errors show useful fallback feedback", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 500 })));

  render(<OfferingsPage {...props} />);

  expect(await screen.findByText("Unable to load menu.")).toBeTruthy();
  expect(screen.queryByText(props.emptyMessage)).toBeNull();
});

// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import OfferingsPage from "@/components/OfferingsPage";

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

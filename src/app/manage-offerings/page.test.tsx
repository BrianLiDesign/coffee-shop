import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, expect, it, vi } from "vitest";

import ManageOfferingsPage from "@/app/manage-offerings/page";

afterEach(() => {
  vi.restoreAllMocks();
});

it("rejects invalid submission before sending a write request", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    if (String(input) === "/api/offerings" && (!init || init.method === "GET")) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    throw new Error(`Unexpected fetch call: ${String(input)} ${String(init?.method ?? "GET")}`);
  });

  render(React.createElement(ManageOfferingsPage));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/offerings", { method: "GET" }));
  await user.click(screen.getByRole("button", { name: /save offering/i }));

  expect(screen.getByText("Name is required.")).toBeInTheDocument();
  expect(screen.getByText("Description is required.")).toBeInTheDocument();
  expect(screen.getByText("Price must be a valid number.")).toBeInTheDocument();
  expect(
    fetchMock.mock.calls.some(([url, init]) => String(url) === "/api/offerings" && init && init.method === "POST"),
  ).toBe(false);
});

it("clears only the corrected field error after a user fixes one input", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    if (String(input) === "/api/offerings" && (!init || init.method === "GET")) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    throw new Error(`Unexpected fetch call: ${String(input)} ${String(init?.method ?? "GET")}`);
  });

  render(React.createElement(ManageOfferingsPage));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());

  await user.click(screen.getByRole("button", { name: /save offering/i }));
  expect(screen.getByText("Name is required.")).toBeInTheDocument();
  expect(screen.getByText("Description is required.")).toBeInTheDocument();

  await user.type(screen.getByRole("textbox", { name: /name/i }), "Latte");

  expect(screen.queryByText("Name is required.")).not.toBeInTheDocument();
  expect(screen.getByText("Description is required.")).toBeInTheDocument();
});

it("resets the form and special-offer checkbox after a successful save", async () => {
  const user = userEvent.setup();
  let saved = false;
  const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    if (String(input) === "/api/offerings" && (!init || init.method === "GET")) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    if (String(input) === "/api/offerings" && init?.method === "POST") {
      saved = true;
      return new Response(
        JSON.stringify({
          ID: "created-1",
          name: "Honey Cinnamon Latte",
          description: "Velvety latte with a touch of cinnamon.",
          price: 6.5,
          category: "Coffee",
          specialOffer: true,
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    }

    throw new Error(`Unexpected fetch call: ${String(input)} ${String(init?.method ?? "GET")}`);
  });

  render(React.createElement(ManageOfferingsPage));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());

  await user.type(screen.getByRole("textbox", { name: /name/i }), "Honey Cinnamon Latte");
  await user.type(screen.getByRole("textbox", { name: /description/i }), "Velvety latte with a touch of cinnamon.");
  await user.clear(screen.getByLabelText(/price/i));
  await user.type(screen.getByLabelText(/price/i), "6.5");
  await user.click(screen.getByRole("checkbox", { name: /special offer/i }));
  await user.click(screen.getByRole("button", { name: /save offering/i }));

  await waitFor(() => expect(saved).toBe(true));
  await waitFor(() => {
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue("");
    expect(screen.getByLabelText(/price/i)).toHaveValue(null);
    expect(screen.getByRole("checkbox", { name: /special offer/i })).not.toBeChecked();
  });
});

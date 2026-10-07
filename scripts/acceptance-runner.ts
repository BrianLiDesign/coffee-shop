import process from "node:process";

import type { CreateOfferingInput, Offering, OfferingErrorResponse } from "@/types/offering";

type JsonObject = Record<string, unknown>;

interface HttpResult {
  status: number;
  contentType: string | null;
  body: unknown;
  rawBody: string;
}

interface TestCase {
  name: string;
  run: () => Promise<void>;
}

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";

const VALID_CATEGORIES = ["Coffee", "Tea", "Smoothie"] as const;

const baseUrl = getBaseUrl();
const databaseFailureUrl = getDatabaseFailureUrl();

function getBaseUrl(): string {
  const configuredUrl = process.env.ACCEPTANCE_BASE_URL ?? DEFAULT_BASE_URL;

  const url = parseLoopbackUrl(configuredUrl);

  return url.origin;
}

function getDatabaseFailureUrl(): string | null {
  const configuredUrl = process.env.ACCEPTANCE_DB_FAILURE_URL;

  if (!configuredUrl) {
    return null;
  }

  return parseLoopbackUrl(configuredUrl).origin;
}

function parseLoopbackUrl(value: string): URL {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL: ${value}`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Acceptance server must use HTTP or HTTPS.");
  }

  const hostname = url.hostname.toLowerCase();

  const isLoopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (!isLoopback) {
    throw new Error(`Refusing non-loopback acceptance target: ${hostname}`);
  }

  if (url.username || url.password) {
    throw new Error("Acceptance URL must not contain a username or password.");
  }

  return url;
}

function expect(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function expectEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${String(expected)}\nActual: ${String(actual)}`);
  }
}

function expectObject(value: unknown, message: string): JsonObject {
  expect(typeof value === "object" && value !== null && !Array.isArray(value), message);

  return value as JsonObject;
}

function isOffering(value: unknown): value is Offering {
  if (!expectableObject(value)) {
    return false;
  }

  return (
    typeof value.ID === "string" &&
    value.ID.length > 0 &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    typeof value.category === "string" &&
    VALID_CATEGORIES.includes(value.category as (typeof VALID_CATEGORIES)[number]) &&
    typeof value.specialOffer === "boolean"
  );
}

function expectableObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOfferingArray(value: unknown): value is Offering[] {
  return Array.isArray(value) && value.every(isOffering);
}

function isErrorResponse(value: unknown): value is OfferingErrorResponse {
  if (!expectableObject(value)) {
    return false;
  }

  const error = value.error;

  if (!expectableObject(error)) {
    return false;
  }

  return typeof error.code === "string" && typeof error.message === "string";
}

async function request(path: string, options: RequestInit = {}, target = baseUrl): Promise<HttpResult> {
  const response = await fetch(`${target}${path}`, options);

  const rawBody = await response.text();

  let body: unknown = undefined;

  if (rawBody.length > 0) {
    try {
      body = JSON.parse(rawBody) as unknown;
    } catch {
      body = rawBody;
    }
  }

  return {
    status: response.status,
    contentType: response.headers.get("content-type"),
    body,
    rawBody,
  };
}

function jsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

function createInput(overrides: Partial<CreateOfferingInput> = {}): CreateOfferingInput {
  return {
    name: "Acceptance Test Coffee",
    description: "Created by the acceptance verification runner.",
    price: 4.5,
    category: "Coffee",
    ...overrides,
  };
}

function assertOfferingResponse(result: HttpResult): Offering {
  expectEqual(result.status, 201, "Expected POST to return HTTP 201.");

  if (!isOffering(result.body)) {
    throw new Error("POST response body is not a valid Offering.");
  }
  return result.body;
}

function assertErrorResponse(
  result: HttpResult,
  expectedStatus: number,
  expectedCode: OfferingErrorResponse["error"]["code"],
): OfferingErrorResponse {
  expectEqual(result.status, expectedStatus, `Expected HTTP ${expectedStatus} for error response.`);

  if (!isErrorResponse(result.body)) {
    throw new Error("Error response does not match the required error envelope.");
  }

  expectEqual(result.body.error.code, expectedCode, "Expected error code ${expectedCode}");
  return result.body;
}

async function testEmptyGet(): Promise<void> {
  const result = await request("/api/offerings");

  expectEqual(result.status, 200, "Empty GET should return HTTP 200.");

  if (!isOfferingArray(result.body)) {
    throw new Error("GET response should be an array of Offering objects.");
  }

  expectEqual(result.body.length, 0, "Clean acceptance database should return an empty array.");
}

async function testSeededGet(): Promise<void> {
  const result = await request("/api/offerings");

  expectEqual(result.status, 200, "Seeded GET should return HTTP 200.");

  if (!isOfferingArray(result.body)) {
    throw new Error("Seeded GET should return an array of Offering objects.");
  }

  expect(result.body.length > 0, "Seeded GET should contain at least one Offering.");

  for (const offering of result.body) {
    expect(offering.ID.length > 0, "Every public Offering ID must be a non-empty string.");
  }

  const sorted = [...result.body].sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name);

    if (nameComparison !== 0) {
      return nameComparison;
    }

    return a.ID.localeCompare(b.ID);
  });

  expect(JSON.stringify(result.body) === JSON.stringify(sorted), "GET results must be sorted by name and then ID.");
}

async function testOrdinaryPost(): Promise<Offering> {
  const input = createInput();

  const result = await request("/api/offerings", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(input),
  });

  const created = assertOfferingResponse(result);

  expect(created.ID.length > 0, "Created Offering must have a non-empty public ID.");

  expectEqual(created.name, input.name, "Created Offering name should match the submitted value.");

  expectEqual(created.description, input.description, "Created Offering description should match the submitted value.");

  expectEqual(created.price, input.price, "Created Offering price should match the submitted value.");

  expectEqual(created.category, input.category, "Created Offering category should match the submitted value.");

  expectEqual(created.specialOffer, false, "Omitted specialOffer should default to false.");

  return created;
}

async function testSpecialPost(): Promise<Offering> {
  const input = createInput({
    name: "Acceptance Special",
    specialOffer: true,
  });

  const result = await request("/api/offerings", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(input),
  });

  const created = assertOfferingResponse(result);

  expectEqual(created.specialOffer, true, "specialOffer=true should remain true.");

  return created;
}

async function testDefaultSpecialPost(): Promise<Offering> {
  const input = createInput({
    name: "Acceptance Default Special",
  });

  delete input.specialOffer;

  const result = await request("/api/offerings", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(input),
  });

  const created = assertOfferingResponse(result);

  expectEqual(created.specialOffer, false, "Omitted specialOffer should default to false.");

  return created;
}

async function testReadBack(created: Offering): Promise<void> {
  const result = await request("/api/offerings");

  expectEqual(result.status, 200, "GET after POST should return HTTP 200.");

  if (!isOfferingArray(result.body)) {
    throw new Error("GET response should be an array of Offering objects.");
  }

  const found = result.body.find((offering: Offering) => offering.ID === created.ID);

  expect(found !== undefined, "Created Offering was not returned by a subsequent GET.");

  if (!found) {
    return;
  }

  expectEqual(found.ID, created.ID, "Read-back ID should match the created Offering.");

  expectEqual(found.name, created.name, "Read-back name should match the created Offering.");

  expectEqual(found.description, created.description, "Read-back description should match the created Offering.");

  expectEqual(found.price, created.price, "Read-back price should match the created Offering.");

  expectEqual(found.category, created.category, "Read-back category should match the created Offering.");

  expectEqual(found.specialOffer, created.specialOffer, "Read-back specialOffer should match the created Offering.");
}

async function testValidationBoundaries(): Promise<void> {
  const validName = "A".repeat(100);
  const validDescription = "B".repeat(500);

  const validBoundaryInput = createInput({
    name: validName,
    description: validDescription,
    price: 0,
  });

  const validBoundaryResult = await request("/api/offerings", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(validBoundaryInput),
  });

  expectEqual(
    validBoundaryResult.status,
    201,
    "100-character name, 500-character description, and price 0 should be valid.",
  );

  const invalidCases: Array<{
    name: string;
    input: unknown;
  }> = [
    {
      name: "empty name",
      input: {
        name: "   ",
        description: "Test description",
        price: 4.5,
        category: "Coffee",
      },
    },
    {
      name: "name over 100 characters",
      input: {
        name: "A".repeat(101),
        description: "Test description",
        price: 4.5,
        category: "Coffee",
      },
    },
    {
      name: "empty description",
      input: {
        name: "Test name",
        description: "   ",
        price: 4.5,
        category: "Coffee",
      },
    },
    {
      name: "description over 500 characters",
      input: {
        name: "Test name",
        description: "B".repeat(501),
        price: 4.5,
        category: "Coffee",
      },
    },
    {
      name: "negative price",
      input: {
        name: "Test name",
        description: "Test description",
        price: -0.01,
        category: "Coffee",
      },
    },
    {
      name: "more than two decimal places",
      input: {
        name: "Test name",
        description: "Test description",
        price: 4.567,
        category: "Coffee",
      },
    },
    {
      name: "numeric string price",
      input: {
        name: "Test name",
        description: "Test description",
        price: "4.50",
        category: "Coffee",
      },
    },
    {
      name: "invalid category",
      input: {
        name: "Test name",
        description: "Test description",
        price: 4.5,
        category: "Juice",
      },
    },
    {
      name: "null specialOffer",
      input: {
        name: "Test name",
        description: "Test description",
        price: 4.5,
        category: "Coffee",
        specialOffer: null,
      },
    },
    {
      name: "string specialOffer",
      input: {
        name: "Test name",
        description: "Test description",
        price: 4.5,
        category: "Coffee",
        specialOffer: "true",
      },
    },
    {
      name: "client-supplied ID",
      input: {
        name: "Test name",
        description: "Test description",
        price: 4.5,
        category: "Coffee",
        ID: "client-controlled-id",
      },
    },
    {
      name: "client-supplied _id",
      input: {
        name: "Test name",
        description: "Test description",
        price: 4.5,
        category: "Coffee",
        _id: "client-controlled-id",
      },
    },
  ];

  for (const testCase of invalidCases) {
    const result = await request("/api/offerings", {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(testCase.input),
    });

    assertErrorResponse(result, 400, "INVALID_INPUT");
  }
}

async function testInvalidContentType(): Promise<void> {
  const result = await request("/api/offerings", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(createInput()),
  });

  assertErrorResponse(result, 415, "INVALID_CONTENT_TYPE");
}

async function testMalformedJson(): Promise<void> {
  const result = await request("/api/offerings", {
    method: "POST",
    headers: jsonHeaders(),
    body: '{"name": "broken"',
  });

  assertErrorResponse(result, 400, "INVALID_JSON");
}

async function testPublicIds(): Promise<void> {
  const result = await request("/api/offerings");

  expectEqual(result.status, 200, "GET should return HTTP 200 when checking public IDs.");

  if (!isOfferingArray(result.body)) {
    throw new Error("GET response should contain Offering objects.");
  }

  for (const offering of result.body) {
    expect(typeof offering.ID === "string", "Public ID must be a string.");

    expect(offering.ID.length > 0, "Public ID must not be empty.");

    expect(!("id" in offering), "Public response must not expose an id field.");

    expect(!("_id" in offering), "Public response must not expose an _id field.");
  }
}

async function testDatabaseFailure(): Promise<void> {
  if (!databaseFailureUrl) {
    throw new Error("ACCEPTANCE_DB_FAILURE_URL is required for the database failure test.");
  }

  const result = await request("/api/offerings", {}, databaseFailureUrl);

  expectEqual(result.status, 503, "Database failure should return HTTP 503.");

  if (!isErrorResponse(result.body)) {
    throw new Error("Database failure response should use the standard error envelope.");
  }

  expectEqual(result.body.error.code, "DATABASE_UNAVAILABLE", "Database failure should return DATABASE_UNAVAILABLE.");

  expect(
    !result.body.error.message.toLowerCase().includes("mongo"),
    "Database error message should not expose internal database details.",
  );

  expect(
    !result.body.error.message.toLowerCase().includes("mongodb"),
    "Database error message should not expose internal database details.",
  );

  expect(
    !result.body.error.message.toLowerCase().includes("connection"),
    "Database error message should not expose connection details.",
  );
}

const tests: TestCase[] = [
  {
    name: "empty GET",
    run: testEmptyGet,
  },
  {
    name: "ordinary POST",
    run: async () => {
      await testOrdinaryPost();
    },
  },
  {
    name: "special POST",
    run: async () => {
      await testSpecialPost();
    },
  },
  {
    name: "default specialOffer POST",
    run: async () => {
      await testDefaultSpecialPost();
    },
  },
  {
    name: "POST -> GET read-back",
    run: async () => {
      const created = await testOrdinaryPost();
      await testReadBack(created);
    },
  },
  {
    name: "seeded GET",
    run: testSeededGet,
  },
  {
    name: "validation boundaries",
    run: testValidationBoundaries,
  },
  {
    name: "invalid content type",
    run: testInvalidContentType,
  },
  {
    name: "malformed JSON",
    run: testMalformedJson,
  },
  {
    name: "public IDs",
    run: testPublicIds,
  },
  {
    name: "deliberate database failure",
    run: testDatabaseFailure,
  },
];

async function main(): Promise<void> {
  console.log("");
  console.log("Acceptance verification runner");
  console.log("--------------------------------");
  console.log(`Target: ${baseUrl}`);

  if (databaseFailureUrl) {
    console.log(`DB failure target: ${databaseFailureUrl}`);
  } else {
    console.log("DB failure target: not configured");
  }

  console.log("");

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await test.run();

      console.log(`PASS  ${test.name}`);
      passed += 1;
    } catch (error: unknown) {
      failed += 1;

      const message = error instanceof Error ? error.message : String(error);

      console.error(`FAIL  ${test.name}`);
      console.error(`      ${message}`);
    }
  }

  console.log("");
  console.log("--------------------------------");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
    console.error("Acceptance verification FAILED.");
    return;
  }

  console.log("Acceptance verification PASSED.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`Runner error: ${message}`);
  process.exitCode = 1;
});

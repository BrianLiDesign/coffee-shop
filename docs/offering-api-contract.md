# Offering API contract

Issue [#14](https://github.com/BrianLiDesign/coffee-shop/issues/14) establishes this contract for [Milestone 2](https://github.com/BrianLiDesign/coffee-shop/issues/12). GET is implemented using fixtures today. Database-backed GET arrives in #15; POST and runtime input validation arrive in #16. This guide defines those later behaviors without claiming they are already implemented.

## Shared types

Import browser-safe types and constants from `@/types/offering`. The fixture module uses the same Offering type. Client code must not import a Mongoose model or the fixture array.

- `Offering`: public response with string `ID`, name, description, numeric price, category, and boolean `specialOffer`.
- `CreateOfferingInput`: the same details without identity; `specialOffer` is optional.
- `OfferingCategory` and `OFFERING_CATEGORIES`: Coffee, Tea, or Smoothie.
- `OFFERING_INPUT_LIMITS`: name 100 characters, description 500 characters, price two decimal places.
- `DEFAULT_SPECIAL_OFFER`: false.
- `OfferingErrorResponse`: the shared error envelope with a code, readable message, and optional field messages.

TypeScript checks application code; it cannot validate incoming JSON. #16 must validate raw values before Mongoose can coerce them and apply the same rules in the form and model.

## Identity

GET remains a JSON array. `ID` is always a nonempty string, and React keys use it directly. Current fixture IDs are strings such as `"1"`; they are temporary identities, not MongoDB document IDs. The database slice will return the string serialization of MongoDB-generated identity through the same `ID` field.

Do not send `ID`, `_id`, or internal metadata when creating an offering. No numeric-ID counter is planned. Names need not be unique.

## GET /api/offerings

Current response: 200 with all 16 fixtures, including three specials. A shortened example:

```json
[
  {
    "ID": "1",
    "name": "Cappuccino",
    "description": "A delicious cappuccino with steamed milk and foam",
    "price": 5.9,
    "category": "Coffee",
    "specialOffer": false
  }
]
```

Menu displays every item. Specials displays only items with `specialOffer: true`: Pumpkin Spice Latte, Golden Hour Cold Brew, and Hojicha Latte in the starting fixtures.

In #15, GET will read the selected database at request time, return `[]` for an empty collection, order by name then ID, and return a sanitized 503 on database failure. It will never silently fall back to fixtures.

## POST /api/offerings (planned in #16)

Send `Content-Type: application/json` and a JSON object:

```json
{
  "name": "Vanilla Latte",
  "description": "Espresso with steamed milk and vanilla",
  "price": 5.75,
  "category": "Coffee",
  "specialOffer": false
}
```

The successful response is 201 with the saved Offering, including a server-generated string `ID`. A subsequent GET must return the same record. Omit `specialOffer` to use false; true marks it as a special. The form's checkbox arrives in #17.

| Field        | Authoritative validation required in #16                                             |
| ------------ | ------------------------------------------------------------------------------------ |
| name         | String; trim; required and nonempty after trimming; at most 100 characters           |
| description  | String; trim; required and nonempty after trimming; at most 500 characters           |
| price        | JSON number; finite; nonnegative; at most two decimal places; reject numeric strings |
| category     | Exactly Coffee, Tea, or Smoothie                                                     |
| specialOffer | Boolean when supplied; omission defaults to false; reject null and strings           |
| Other fields | Reject, including ID and \_id                                                        |

Decimal validation must tolerate ordinary floating-point representation without accepting meaningful fractional cents. The form parses its price text explicitly before submission. Mongoose validation is an additional guard, not a replacement for checking raw request input.

## Planned error responses

| Status | Code                 | Trigger                                    |
| ------ | -------------------- | ------------------------------------------ |
| 415    | INVALID_CONTENT_TYPE | POST body is not sent as JSON              |
| 400    | INVALID_JSON         | Body cannot be parsed as JSON              |
| 400    | INVALID_INPUT        | Wrong shape, type, fields, or field values |
| 503    | DATABASE_UNAVAILABLE | Database cannot complete the request       |

Example validation response:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Please correct the offering details.",
    "fields": {
      "name": "Enter a name.",
      "price": "Enter a nonnegative price with at most two decimal places."
    }
  }
}
```

Clients use the readable message and field messages, retain input on failure, and announce feedback accessibly. Errors must not include credentials, connection strings, raw database exceptions, or internal document fields.

## Running the HTTP regression checks

After installing dependencies, run `npm test`. Node's built-in test runner starts a real Next.js development server on an available loopback port and exercises GET over HTTP. It requires no separately running app and no database credentials. Output goes into ignored `.next-http-test`, leaving the normal `.next` build alone. The harness clears `MONGO_URI` for its child process and stops its process tree at teardown.

These checks cover string identity, the 16-item starting menu and public fields, and the three specials flags. They do not claim database persistence or POST coverage. Check types with `npm run typecheck`; run lint and build separately.

Use Node 18 or newer, matching the current CI matrix. The harness uses Node's [test runner](https://nodejs.org/api/test.html) and Next.js's [custom output directory](https://nextjs.org/docs/14/app/api-reference/next-config-js/distDir).

## Adding persistence checks in #15 and #16

Keep HTTP requests and responses as the regression surface. Replace fixture-specific expectations with independently defined seed expectations when GET becomes database-backed. Extend the harness to start a disposable local MongoDB instance or use an explicitly designated isolated test database, setting the child app's test URI to that database.

Setup and cleanup may manage isolated data, but assertions observe persistence through POST followed by GET. Do not assert private model calls. Refuse developer/integration database targets for automated destructive cleanup. Ordinary CI must not use shared Atlas credentials; a separate deliberate Atlas smoke check supplies live-access evidence.

No disposable database launcher is added in #14 because the current route does not use MongoDB. #15 chooses and implements that launcher as part of its real persistence tests.

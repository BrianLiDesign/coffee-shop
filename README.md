# Coffee Shop

A student-built shop site. Customers will browse drinks and food, customize a drink, read the shop story, see discounts, and choose pickup or delivery. The team is learning TypeScript, React, Next.js, and Git while building it.

Coding agents that change this repo follow [AGENTS.md](AGENTS.md).

## What works today

The home page at `/` renders without a database. About, Contact, Menu, and Specials are available. Menu and Specials read the 16 sample offerings from `GET /api/offerings`; three are marked as special. Offering IDs are strings, and `npm test` runs real HTTP GET checks. A starter page lives at `/example`, and `GET /api/example` connects to MongoDB.

Database-backed offerings, creation, and the management page are planned Milestone 2 work.

## What we are building

- Browse drinks with ingredients and prices
- Customize a drink before ordering
- Browse food and seasonal offerings
- Read the coffee shop story
- Choose pickup or delivery through Grubhub or DoorDash
- See available discounts

## Team

- Brian — project tech lead
- Jean — backend
- Naomi — database
- Vedika — frontend
- Aditi — frontend
- Sofie — backend

## Start here

Learning developers start with the first two guides. Coding agents start with `AGENTS.md`, then open a guide when the task matches it.

1. [Getting started](docs/getting-started.md) — install the app, learn the folders, and run it locally.
2. [Contributing](docs/contributing.md) — one branch and pull request per issue.
3. [Project setup](docs/project-setup.md) — tools already configured in this repository.
4. [AGENTS.md](AGENTS.md) — how a coding agent should change this repo.

## Milestone 2: start your assignment

Open the [independent developer plan](docs/milestone-2-parallel-work.md), find your issue, and read its acceptance criteria. Every assignment can be built, tested, reviewed, and merged without waiting for another developer's issue to finish.

- [API contract](docs/offering-api-contract.md): the shared input, response, and error agreement.
- [Developer guide](docs/milestone-2-developer-guide.md): Atlas setup and individual verification. Run `npm run db:check` for a real read or explicitly run `npm run db:check:write` for disposable write/read/cleanup. Seed tooling is separate work.
- [Milestone spec](docs/milestone-2-spec.md): the final integrated requirements.
- [Glossary](CONTEXT.md): offering, special offering, menu, and offering management.

Independent assignment completion and full milestone completion are different. Brian coordinates final integration and each developer's own Atlas evidence under [#12](https://github.com/BrianLiDesign/coffee-shop/issues/12).

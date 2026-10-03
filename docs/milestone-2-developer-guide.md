# Milestone 2 developer setup and verification

> Coordination update, October 2, 2026: [independent assignments](./milestone-2-parallel-work.md) supersede earlier owner/dependency and completion sequencing. Each assignment can finish independently; full-team Atlas and integrated persistence evidence still gate parent #12. #14 shipped string IDs and real HTTP GET tests. Checker/seed commands remain planned until implemented.

This is the onboarding procedure to accompany implementation. Atlas provisioning, the checker, and the seed tooling are planned work; they have not been executed or built by writing this guide. Do not assume access is working until your own verification passes.

You can complete your independent assignment using its specified local database or controlled-response tests before Atlas access is available. The procedure below supplies live evidence for final milestone acceptance; it is not a prerequisite on another developer's assignment.

## What you need

- Your own Atlas dashboard account and accepted project invitation.
- A database user with the permissions Brian assigns for your named developer database. Dashboard access and database credentials are different.
- Your network's public IP permitted by the Atlas project's Network Access settings.
- The repository installed locally and a private `.env.local` containing `MONGO_URI`.

[Atlas's connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/) describes these connection prerequisites. [Database users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/) are separate from Atlas application users.

## Brian and Naomi: provision access

1. Identify the Atlas project and cluster; record their non-secret names in the integration evidence under [parent #12](https://github.com/BrianLiDesign/coffee-shop/issues/12).
2. Invite each teammate individually. Choose the least-privileged Atlas role that allows the intended data inspection. Verify that each person can inspect their collection, rather than assuming an invitation grants it.
3. Create a named database for each developer and one integration database. Proposed names are `coffee_shop_<developer>` and `coffee_shop_integration`; confirm the exact names in the issue.
4. Create individual database users scoped to the appropriate databases. Grant read/write access where development requires it. Limit integration writes to the contributors performing integration.
5. Add required developer network addresses to the project IP access list. Recheck when a teammate changes network or VPN. Avoid broad public access as the default. See [Atlas network access](https://www.mongodb.com/docs/atlas/security/ip-access-list/).
6. Deliver each teammate's credentials through the team's private credential channel, not GitHub comments, commits, screenshots, or the project board.
7. Confirm the URI explicitly selects the intended database. Do not use an accidental default database.
8. Confirm all six people can see the intended project and collection in Atlas. Record blockers separately from application connection results.

## Each developer: configure locally

1. Follow the repository's installation instructions and update your working branch from the agreed baseline.
2. Copy `.env.local.example` to `.env.local` at the repository root.
3. Replace the placeholder with your assigned `MONGO_URI`. It must include your developer database name. Do not use the integration URI for routine experiments.
4. Use the Atlas-generated connection template and correctly encoded credentials. Do not post the URI if setup fails.
5. Verify that Git ignores your file using `git check-ignore .env.local`. Never add a populated env file to a commit.
6. Restart the local app after changing environment configuration.
7. Open the assigned Atlas project and verify you can inspect your data.

The implementation task must also protect plain `.env` and other secret-bearing environment variants while keeping the example tracked. Standardize on `.env.local`; do not ask developers to commit populated configuration.

## Verification tooling acceptance contract

Implementation will provide package commands for checking connectivity and seeding. Exact command names must be added here when those scripts exist; no checker or seed command is runnable solely because this guide exists.

The checker must:

- Load the same local configuration and intended database as the app.
- Fail clearly when `MONGO_URI` is absent or a placeholder.
- In default read-only mode, connect and perform an actual database read. Connecting alone is not a permission check.
- Offer a clearly named explicit write-check mode. Insert a uniquely marked document into an isolated verification collection, read it back, and delete only that document.
- Close its connection, use finite timeouts, and return a nonzero exit code on any failed step, including cleanup.
- Report stage results and a safe database alias, never a URI, password, or raw exception containing credentials.
- Protect unrelated documents and make the write effect clear before it runs.

Successful checker output proves local database access; it does not replace testing the offerings API and browser flow after those are implemented.

## Seed and application verification

1. After storage, handlers, and management UI are composed into the real app, run the documented seed command against your developer database. Seeding alone does not make the current fixture-backed API read your database.
2. Confirm 16 seeded offerings and three special offerings. Run the seed again: seeded count and identities must stay unchanged.
3. Confirm unrelated records remain. The seed must not clear the collection or overwrite edited records on rerun.
4. Start the app. Inspect GET `/api/offerings` and verify its data matches your database.
5. Open `/manage-offerings`, create a distinctly named offering, and record its returned string ID.
6. Refresh, then restart the app, and confirm the same record is still available. Inspect it in Atlas.
7. Check that a special offering appears on both Menu and Specials, while an ordinary offering appears only on Menu.
8. Submit invalid input and confirm useful feedback and no saved record.

## Team evidence matrix

Record dates and outcomes in the integration evidence under [parent #12](https://github.com/BrianLiDesign/coffee-shop/issues/12). Issue #13 ships checker/onboarding tooling and does not wait for these rows to pass. Do not attach populated environment files. These rows are pending, not verified.

| Developer | Atlas inspection | Read check | Write/read/cleanup | App persistence | Checked at  | Blocker      |
| --------- | ---------------- | ---------- | ------------------ | --------------- | ----------- | ------------ |
| Brian     | Pending          | Pending    | Pending            | Pending         | Not checked | Not assessed |
| Naomi     | Pending          | Pending    | Pending            | Pending         | Not checked | Not assessed |
| Jean      | Pending          | Pending    | Pending            | Pending         | Not checked | Not assessed |
| Sofie     | Pending          | Pending    | Pending            | Pending         | Not checked | Not assessed |
| Vedika    | Pending          | Pending    | Pending            | Pending         | Not checked | Not assessed |
| Aditi     | Pending          | Pending    | Pending            | Pending         | Not checked | Not assessed |

Brian collects sanitized evidence from each person. A result on Brian's machine does not establish that everyone else's configuration works.

## Troubleshooting

| Symptom                             | What to check                                                                             |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Missing configuration               | File location, variable name, placeholder replacement, app restart                        |
| Authentication failure              | Database username/password rather than dashboard login; credential encoding               |
| Connection timeout                  | Public IP allowlist, VPN/network change, cluster availability, local network restrictions |
| Read succeeds but write fails       | Database user's write permission on the exact target database                             |
| Empty menu after successful seed    | Seed and app selected the same database and collection                                    |
| Atlas UI works but app fails        | Dashboard access is separate from database credentials and network access                 |
| New offering vanishes after refresh | POST truly persists; GET reads that database; no frontend fixture fallback                |
| Verification cleanup fails          | Mark verification failed; report safe marker/collection to Brian for targeted cleanup     |

Report the failed stage, safe database alias, time, and sanitized error. Never paste credentials to debug a failure.

## Shared integration database

Use it only for coordinated integration and the meeting demonstration. Do not run destructive resets or routine tests there. Brian records the integration seed result and the complete browser persistence demo independently of each developer's onboarding result.

CI build success is not proof that the configured database can read or write. Routine automated checks should use isolated test data; deliberate Atlas checks use a designated database and report their result separately.

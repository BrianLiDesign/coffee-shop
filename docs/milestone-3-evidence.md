# Milestone 3 release evidence

## Verification boundary

This branch implements the release features. Live Vercel deployment, Atlas proof, and each developer's own contributions remain pending until recorded below. Agent-written reference tests do not count as evidence that another developer completed their assignment.

| Requirement                       | Evidence to record                                                                   | Status                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Public Vercel release             | Verified production URL and deployed Git commit                                      | Existing project confirmed; this branch pending deployment    |
| Live create/read persistence      | Live acceptance output; browser refresh and Atlas inspection of the same offering ID | Pending deployment                                            |
| Additional update/delete          | Live all-operations acceptance and targeted cleanup                                  | Pending deployment                                            |
| README                            | Description, setup, tech stack, tests, accurate verified live link                   | Implemented; existing live link recorded                      |
| Loading, empty, responsive states | Controlled state checks and desktop/mobile screenshots                               | Automated coverage and local desktop/mobile evidence recorded |
| Frontend API errors               | Failed fetch/save and successful save with failed reload                             | Automated coverage implemented                                |
| Vitest contribution per developer | At least three personally authored cases and reviewed PR per person                  | Pending individual submissions                                |

## Developer evidence

| Developer | PR      | Three test case names | Explained and reviewed |
| --------- | ------- | --------------------- | ---------------------- |
| Brian     | Pending | Pending               | Pending                |
| Jean      | Pending | Pending               | Pending                |
| Naomi     | Pending | Pending               | Pending                |
| Vedika    | Pending | Pending               | Pending                |
| Aditi     | Pending | Pending               | Pending                |
| Sofie     | Pending | Pending               | Pending                |

## Local release checks

Record the command, result, and commit after the final branch checks. Local disposable MongoDB and controlled HTTP responses verify application behavior; they do not establish the deployment database's connectivity.

- Lint: passed.
- Typecheck: passed.
- Vitest: 29 passed; an additional same-origin regression added after browser QA.
- HTTP/database/UI regression suite: 41 passed; includes restart persistence and live-runner cleanup.
- Production build: passed; routes do not query Atlas during build.
- Production dependency audit: zero findings after the approved Next.js/React upgrade and Mongoose patch update; rerun before deployment.
- Standards/spec review: pending.

Local browser evidence: seeded Menu at desktop and 390px mobile widths, no horizontal overflow; created a special through management, edited it, and verified it on Specials after navigation. These checks used disposable local MongoDB. Browser evidence is in `docs/evidence/milestone-3-*.jpg`.

The Vercel project environment panel showed no project variables. Private configuration and new branch deployment remain pending.

Do not record credentials, populated environment files, or raw database exceptions in evidence.

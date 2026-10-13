# Milestone 3 release evidence

## Verification boundary

PR #31 integrates the release foundation so developers can extend it from `main`. Its merge does not complete the public production release, live database proof, or each developer's own contributions; those remain pending until recorded below. Issue #30 stays open to track the remaining release requirements. Agent-written reference tests do not count as evidence that another developer completed their assignment.

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

The foundation on `main` includes agent-written reference coverage and controlled
test helpers. Vedika submitted her three assigned cases in PR #39. See the
[test handoff](../tests/unit/README.md).
Preserve this contribution record and submitted cases during release integration.
For each contributed test, explain what it protects. Record browser evidence with
route, viewport, commit, result, and screenshot link.

| Developer | PR                                                          | Three test case names | Explained and reviewed                                       |
| --------- | ----------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| Brian     | Pending                                                     | Pending               | Pending                                                      |
| Jean      | Pending                                                     | Pending               | Pending                                                      |
| Naomi     | Pending                                                     | Pending               | Pending                                                      |
| Vedika    | [#39](https://github.com/BrianLiDesign/coffee-shop/pull/39) | See below             | Explanations below; agent standards/spec review before merge |
| Aditi     | Pending                                                     | Pending               | Pending                                                      |
| Sofie     | Pending                                                     | Pending               | Pending                                                      |

### Vedika: issue #35 / PR #39

Submitted in Vedika's original commit `e4f7fc3`; agent reconciliation retains all
three cases and updates the Specials case to use the route's actual title and
empty feedback.

| Personally authored test name                         | What it protects                                                                                                      |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Specials shows empty feedback when none are special` | A nonempty response containing only ordinary offerings shows the Specials empty message and hides the ordinary Latte. |
| `network failure shows error instead of empty menu`   | A rejected fetch shows useful fallback feedback rather than pretending the menu is empty.                             |
| `unreadable API errors show useful fallback feedback` | An unsuccessful response with a non-JSON body shows useful fallback feedback without empty-menu feedback.             |

Agent-added coverage `clears a previous error and announces loading when the title
changes` does not count as Vedika's contribution. The original retry regression
and this new case failed before restoring per-request state resets and passed
afterward. Main's response validation and retry behavior are preserved.

Agent-performed browser checks against reconciled implementation `533d7e1` cover
all five customer routes and navigation at 1280×900, 390×844, and 320×780. All 27
checks passed, including visible keyboard focus, keyboard navigation/retry,
maximum-length unbroken offering text, and no horizontal overflow. See the
[browser evidence and screenshots](./evidence/pr39-browser.md).
These checks use controlled API responses; they do not establish Vedika's
personal browser verification or live Atlas/deployment acceptance.

Final local validation on October 13, 2026: `npm run preflight` passed with
116 Vitest cases, 51 Node regression cases, 5 acceptance CLI cases, 3 disposable
lifecycle cases, and 1 real-application acceptance case, followed by the
production build. Standards and spec reviews found no remaining blockers.
The older Node network-error assertion now expects the same readable fallback
as the contributed Vitest case and confirms no empty-menu feedback.

## Local release checks

Record the command, result, and commit after the final branch checks. Local disposable MongoDB and controlled HTTP responses verify application behavior; they do not establish the deployment database's connectivity.

- Lint: passed.
- Typecheck: passed.
- Vitest: 31 passed, including same-origin and malformed error-envelope regressions.
- HTTP/database/UI regression suite: 51 passed after reconciling main; includes retained storage/seed checks, restart persistence, and live-runner cleanup.
- Production build: passed; routes do not query Atlas during build.
- Production dependency audit: zero findings after the approved Next.js/React upgrade and Mongoose patch update; rerun before deployment.
- Standards/spec review: no blocking defects; documented follow-ups resolved. See [review report](./milestone-3-review.md).

Foundation merge check on October 12, 2026: `npm ci` and `npm run preflight`
passed on Node 24.19.0 against implementation `3d90071` with the handoff/documentation
corrections in this PR. All 31 Vitest and 51 Node regression cases passed, followed
by the production build. `npm audit --omit=dev` reported zero vulnerabilities.
These checks used disposable databases and do not establish live Atlas evidence.

Local browser evidence: seeded Menu at desktop and 390px mobile widths, no horizontal overflow; created a special through management, edited it, and verified it on Specials after navigation. These checks used disposable local MongoDB. Browser evidence is in `docs/evidence/milestone-3-*.jpg`.

At the original preview inspection, the Vercel project environment panel showed no project variables. Preview deployed commit `693cc0c` successfully at https://coffee-shop-git-feat-milestone-3-release-brianlidesign.vercel.app/. Vercel Authentication protected it from anonymous requests (302). The authenticated browser showed a clear API-unavailable alert and retry button (`docs/evidence/milestone-3-preview-error.jpg`). These observations are historical. Merging PR #31 can trigger a production deployment; a passing deployment check does not verify private environment configuration or live create/read persistence. Record fresh production acceptance separately.

Do not record credentials, populated environment files, or raw database exceptions in evidence.

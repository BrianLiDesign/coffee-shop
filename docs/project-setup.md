# Project setup

These tools are already configured. You do not need to add them before writing a feature.

1. **Next.js 14 App Router.** Pages and route handlers live under `src/app`. See [Getting started](./getting-started.md) for the folder map.
2. **TypeScript in strict mode**, with the `@/*` import alias pointed at `src/`.
3. **React 18** for interface components.
4. **Mongoose** connection helper in `src/database/db.ts`. It reads `MONGO_URI` and reuses one connection across requests. `src/database/userSchema.ts` is an example schema.
5. **Example routes.** `src/app/example/page.tsx` and `src/app/api/example/route.ts` show a page and an API route. The API route connects to MongoDB. New shop pages should follow the issue you were assigned.
6. **ESLint and Prettier.** ESLint extends `next/core-web-vitals` and reports Prettier issues as errors. Prettier uses a print width of 120. `npm run lint` runs the check.
7. **Pre-commit hook.** Husky runs lint-staged, which formats staged files and runs ESLint on JavaScript and TypeScript.
8. **Issue and pull request templates** in `.github`.
9. **Continuous integration.** `.github/workflows/ci.yml` runs on pushes and pull requests to `main` and `develop`. The job installs dependencies, runs `npm run build`, and runs `npm test` on Node 18, 20, and 22. The build step receives `MONGO_URI` from the repository secret of the same name.
10. **Tests.** `npm test` uses Node's built-in test runner to exercise the offerings endpoint over HTTP. It starts its own Next.js server with separate build output and no Atlas credentials. `npm run typecheck` checks TypeScript. See [the Offering contract](./offering-api-contract.md) for coverage and future persistence checks.

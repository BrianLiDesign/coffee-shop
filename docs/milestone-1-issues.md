# Milestone 1 Issue Drafts

These drafts are intentionally small for teammates who are learning the project and
the tools. They live in this file so the team can read them. File each one as a
GitHub issue before assigning the work.

The shared layout already renders `Navbar` on every page, including the five links.
Home does not render the navbar again. Do not import `Navbar` inside a page.

Shared offering contract, owned by Naomi in `src/data/offerings.ts`:

- `id: string`
- `name: string`
- `description: string`
- `price: number` (dollars)
- `category: "drink" | "food"`
- `isSpecial: boolean`

Menu shows every offering. Specials shows only items with `isSpecial === true`.
Both pages read `GET /api/offerings`. Neither page imports the mock list.

## Required workflow for every issue

Follow these steps before and after working on your assigned issue:

1. Open the issue in GitHub and assign it to yourself.
2. Create a branch from the latest `main` branch. If GitHub offers **Create a branch
   for this issue**, use that option. Otherwise run:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b <short-issue-name>
   ```

3. Make only the changes for that issue.
4. Run the checks listed in the issue. At minimum, run `npm run lint`.
5. Commit your changes on the issue branch.
6. Push the branch:

   ```bash
   git push -u origin <short-issue-name>
   ```

7. Open a **pull request** from your branch into `main`.
8. In the pull request description, link the issue (for example, `Closes #123`),
   explain what you changed, and include screenshots when the change is visual.
9. Request a reviewer and wait for approval before merging.

Do not commit directly to `main`. If you get stuck, push your work-in-progress branch
and ask for help in the issue or pull request.

## Jean — Create the offerings API

### Issue title

`Milestone 1: Create the offerings API route`

### Issue body

Create one API route that returns the offering data prepared by Naomi.

### Tasks

- Add `src/app/api/offerings/route.ts` with `GET /api/offerings`.
- Import the mock list from `src/data/offerings.ts`.
- Return that list as JSON.
- Do not call `connectDB()`. The example route does; this route must not.

### Done when

- Opening `/api/offerings` returns JSON.
- The response uses Naomi’s shared type and data.
- The route does not require MongoDB.

### Start here

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- Existing example: [`src/app/api/example/route.ts`](../src/app/api/example/route.ts)

Ask for help if the interface or response shape is unclear.

---

## Naomi — Create the offering type and mock data

### Issue title

`Milestone 1: Create the offering type and mock data`

### Issue body

Create the shared data that the API and pages will use.

### Tasks

- Create `src/data/offerings.ts`.
- Export an `Offering` interface and a mock list using the shared contract above.
- Include drinks and food. Mark some items with `isSpecial: true`.
- This file is the only one you own. Jean and Sofie will import it.

### Done when

- Every mock item matches the interface.
- The list includes enough items for both Menu and Specials.
- The data does not require a database.

### Start here

- [TypeScript interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [MDN: JSON basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
- Existing database examples: [`src/database/userSchema.ts`](../src/database/userSchema.ts)

Only create the type and mock data for this milestone; do not build a database.

---

## Vedika — Mark the current page in the navigation

### Issue title

`Milestone 1: Mark the current page in the navigation`

### Issue body

The navbar already links to Home, About, Menu, Specials, and Contact from the shared layout. Show which page the customer is on.

### Tasks

- Update only `src/components/Navbar.tsx` and `src/styles/navbar.module.css`.
- Use the current route to mark the matching link.
- Keep the link readable and reachable with a keyboard.
- Leave `src/app/layout.tsx` and the page files alone.

### Done when

- The link for the open page is visually distinct.
- The other four links stay usable.
- Home still shows the navbar once.

### Start here

- [Next.js linking](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
- Existing files: [`src/components/Navbar.tsx`](../src/components/Navbar.tsx) and [`src/app/layout.tsx`](../src/app/layout.tsx)

### Optional Figma help

- [Figma beginner course](https://help.figma.com/hc/en-us/sections/14585849343377-Learn-design)

Figma is optional. A simple sketch of the navbar is enough; no polished design is required.

---

## Aditi — Build About and Contact

### Issue title

`Milestone 1: Add About and Contact pages`

### Issue body

Create the two simple informational pages for the coffee shop.

### Tasks

- Add `src/app/about/page.tsx` and `src/app/contact/page.tsx`.
- Include a heading and a few useful sentences on each page.
- Do not import `Navbar` or edit the layout. The navbar is already there.
- Do not build an offering card. Menu and Specials own that markup.

### Done when

- Both routes load without errors.
- Both pages have useful placeholder content.
- Both pages show the shared navbar.

### Start here

- [Next.js pages and layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-pages)
- [React: Passing props](https://react.dev/learn/passing-props-to-a-component)
- Existing page: [`src/app/page.tsx`](../src/app/page.tsx)

Start with plain headings and paragraphs. Keep the component work small and ask before
adding extra UI states.

### Optional Figma help

- [Figma beginner course](https://help.figma.com/hc/en-us/sections/14585849343377-Learn-design)

Use Figma only if a quick page sketch helps; it is not required.

---

## Sofie — Build Menu and Specials

### Issue title

`Milestone 1: Display API data on Menu and Specials pages`

### Issue body

Create the two domain pages and display the offerings returned by Jean’s API route.

### Tasks

- Add `src/app/menu/page.tsx` and `src/app/specials/page.tsx`.
- Fetch data from `/api/offerings`.
- Display each item’s name, description, and price.
- Menu shows every item. Specials shows only `isSpecial === true`.
- Add a simple message if no items are returned.
- Do not import `Navbar`, the mock list, or edit the layout.

### Done when

- Both routes load without errors.
- Both pages get their data from `/api/offerings`.
- Neither page imports the mock array directly.
- The two pages show the expected different items.

### Start here

- [Next.js data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

Implement Menu first. Once it works, copy the basic pattern for Specials and adjust
the filter.

### Optional Figma help

- [Figma beginner course](https://help.figma.com/hc/en-us/sections/14585849343377-Learn-design)

You may sketch a simple offering card, but functional API data is more important than polish.

---

## Tech-lead follow-up

After the five small tasks are merged:

- Connect any remaining route or import gaps.
- Confirm the five pages and `/api/offerings` work.
- Confirm pages use the API rather than importing mock data.
- Run `npm run lint` and `npm run build`.
- Handle advanced error states, styling improvements, and documentation after the basic milestone works.

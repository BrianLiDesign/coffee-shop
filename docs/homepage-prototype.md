# Homepage design prototype

Question: which homepage structure introduces the shop and makes Menu and Specials easy to find?

This is throwaway UI exploration on `prototype/homepage`, based on `main` at `46e0b48`. It is not a production homepage or part of the Milestone 2 persistence assignments. No database access is needed.

Run `npm run prototype:homepage`, then open <http://localhost:3001>.

- `/?variant=A`: Warm café. Split introduction and CSS coffee illustration, with supporting shop-story content.
- `/?variant=B`: Editorial. Oversized typography, a circular menu link, and horizontal discovery rows.
- `/?variant=C`: Menu first. A shop introduction beside large Menu and Specials links.

The floating bar and left/right keyboard arrows cycle between variants and update the URL. The bar and keyboard handler are disabled in production. The existing app navbar remains visible to judge the designs in context. Text is illustrative; the prototype does not claim live offerings, hours, location, or ordering functionality.

Verification: typecheck, formatting, and browser inspection at desktop and phone widths. All three phone layouts had no horizontal overflow. Button and keyboard switching update the URL; Menu navigation reaches the existing route.

Decision: pending the lead's selection. A is the suggested starting point because it introduces the shop while giving Menu a clear primary action. C is a useful alternative if fast navigation matters more. Keep this branch as the design reference, then implement the chosen direction properly on a separate issue branch.

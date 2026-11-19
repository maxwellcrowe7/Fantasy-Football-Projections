# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

FF Projection Tool — builds season-long fantasy football projections team by team (team-level stats → player shares → fantasy points). Plain HTML/CSS/JS, no build step, no package.json. Hosted on GitHub Pages; data syncs through Supabase.

- `index.html` — markup/shell (login screen, app layout). Loads Supabase JS and Lucide icons from CDNs.
- `app.js` — ALL application logic (~7,000 lines, plain globals, no modules): constants, state, Supabase sync, auth, sharing, rendering, every UI handler. This is where nearly all work happens.
- `styles.css` — all styling.
- `Projections.html` — the OLD single-file, local-only version. Reference only; do not edit it as if it were live.
- `Historical Data.csv` — source data for historical team stats, imported in-app and uploaded to Supabase.
- `ff_projections_2026-07-27.json` — an exported backup of app state. Not loaded by the app.
- `Football logos/` — team logo PNGs, keyed by `TEAM_LOGOS` in `app.js`.
- `supabase/schema.sql` — record of this app's tables and RLS policies. Run manually in the Supabase SQL editor.

## Running / testing

No build, no package manager, no test suite. Serve the folder (`python3 -m http.server`) and open it in a browser. Verify changes by using the app. `app.js` points at the live Supabase project, so local testing reads and writes real data — sign in with a test account when trying risky changes.

## Data and sync

- Working state lives in `localStorage` (`ff_projections_v1` plus several `ff_*` keys) and is mirrored to Supabase.
- Supabase project is **shared with other apps** ("Personal Tools"). Tables:
  - `app_state` — shared with Disc Golf Tracker. One row per `(user_id, app)`; this app uses `app = 'ff-projections'` (`SB_APP`). The whole state is one jsonb blob. `sbSave()` debounces (2s) and upserts the full blob, so a bad payload overwrites everything for that user — be careful changing `buildFullPayload()` / `applyFullPayload()`, and keep `applyFullPayload()` tolerant of older shapes.
  - `ff_shares` — owner shares projections with a viewer by email.
  - `ff_historical_data` — a single row (`HIST_ROW_ID`) readable by everyone, writable only by the admin email.
- Sharing: a viewer opens an owner's projections read-only (`viewingUser`). `sbSave()` must never save while viewing someone else's data.

## Security rules

- The anon key in `app.js` is public by design. Security comes entirely from RLS policies (see `supabase/schema.sql`).
- The shared-viewer policy on `app_state` must keep its `app = 'ff-projections'` check, or shares would expose other apps' data.
- Never add a `service_role` key anywhere in this repo.
- Treat values from the database as untrusted when building HTML. `owner_email` in `ff_shares` is set by the client and is currently inserted into `innerHTML`/`onclick` unescaped — escape it before rendering.

## Database changes

Any SQL run in the Supabase editor for this app must also be saved into `supabase/schema.sql` (or a dated migration file next to it). The repo should always describe what is live.

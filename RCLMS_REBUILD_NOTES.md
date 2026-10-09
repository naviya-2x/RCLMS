# RCLMS rebuild handoff

## What changed

- Replaced the dark “terminal” dashboard with a calm, task-first library desk overview.
- Reworked the sidebar into a monochrome catalogue / circulation / people / administration navigation.
- Removed browser-local authentication bypass when Supabase is configured.
- Added server-side profile and member onboarding after Supabase account creation.
- Replaced stale, partial Supabase refreshes with paginated reads for books, copies, members, circulation, fines, reservations, categories, authors, publishers, and settings.
- Empty Supabase tables now correctly clear the UI instead of leaving seeded or stale records visible.
- Book creation, editing, deletion, and copy creation now use real Supabase IDs and refresh from the database.
- Issue and return actions now update circulation, physical copy status, book counters, and overdue fines in Supabase.
- Hardened Supabase RLS so catalogue reads are public, but writes require active library staff roles.
- Added protected onboarding for new users and member records.
- Secured trigger/helper functions and removed public RPC execution.
- Added foreign-key indexes needed for a larger catalogue.
- Removed fake hall defaults and vendor-style branding from the main experience.

## Verification

- `npm run build` passes.
- Supabase security advisor: clean.
- Supabase performance advisor: only informational unused-index notices remain.

## Run locally

```bash
npm install
npm run dev
```

The app expects the existing Supabase variables in `.env` / the configured runtime. New accounts are created by Supabase Auth; privileged roles must be assigned by an administrator in `profiles`.

# Central Florida Outdoor

Browse-and-request-quote site for billboard inventory across Central
Florida, with an admin page for entering real boards (with photos) by hand
until Geopath API access is approved.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Storage) for boards, photos, and leads
- Mapbox (via react-map-gl) for the inventory map

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in real keys, see below
npm run dev
```

## Environment variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project -> Settings -> API (use the Publishable key, not secret/service_role) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | account.mapbox.com -> Tokens (free tier) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | a password you choose for the /admin page |
| `GEOPATH_API_KEY` | Not wired up yet -- pending Geopath API approval, see `lib/geopath.ts` |

Note on the admin password: this is a simple deterrent, not real
authentication. Since it's a `NEXT_PUBLIC_` variable it ends up readable in
your deployed JavaScript, so don't reuse a password you use elsewhere. Fine
for keeping casual visitors out; not a substitute for real auth if this ever
needs to be locked down further.

## Database

Run both SQL files in the Supabase SQL editor, in order:
1. `supabase_schema.sql` -- creates the `leads` table
2. `supabase_schema_boards.sql` -- creates the `boards` table and the
   `board-photos` storage bucket

## Adding real boards

Go to `/admin` on your deployed site, enter the password, and use the form
to add boards one at a time: board number, type (static/digital), weekly
impressions, size, county, zip, latitude/longitude, and for digital boards,
spots and loop length. Upload a photo if you have one. New boards appear
immediately on the home page, board-type pages, county pages, and the map.

## Deploying

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the environment variables above in Vercel's project settings.
4. Add your domain in Vercel -> Project -> Domains, then update DNS at your
   registrar.

## Project structure

```
app/
  page.tsx                Home
  board-types/             Static/digital index + [slug] detail pages
  counties/                County index + [slug] detail pages
  map/                     Interactive board map
  quote/                   Quote request form
  admin/                   Password-gated board management
  api/leads/               API route that stores quote submissions
components/
  InventoryMap.tsx          Map + filters, reads boards live from Supabase
  BoardCard.tsx              Shared board listing card
  QuoteForm.tsx               Lead capture form
  AdminDashboard.tsx           Add/list/delete boards with photo upload
lib/
  data.ts                  Types, counties list
  boards.ts                 Supabase queries for boards + photo upload
  supabase.ts                Supabase client
  geopath.ts                  Notes/stub for future Geopath sync
```

## Not yet done

- Real Geopath API sync (pending their approval -- use /admin for now)
- Editing existing boards (currently add + delete only, no edit-in-place)
- Real authentication on /admin (currently a single shared password)

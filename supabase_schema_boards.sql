-- Run this in the Supabase SQL editor. Safe to run after the original
-- leads-only schema -- it adds the boards table and storage bucket without
-- touching the existing leads table.

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  board_number text not null,
  board_type text not null check (board_type in ('static', 'digital')),
  weekly_impressions integer not null,
  size text not null,
  county text not null,
  zip_code text not null,
  latitude double precision not null,
  longitude double precision not null,
  -- Digital-only fields, null for static boards
  spots integer,
  loop_seconds integer,
  photo_url text,
  status text not null default 'available' check (status in ('available', 'limited', 'booked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table boards enable row level security;

-- Anyone (the public site) can read boards.
create policy "Allow public read"
  on boards for select
  to anon
  using (true);

-- Inserts/updates/deletes go through the admin page, which uses the same
-- anon key but is gated by the app-level password check in app/admin --
-- this is fine for a single-operator MVP. Tighten with real auth later if
-- multiple people manage listings.
create policy "Allow public insert"
  on boards for insert
  to anon
  with check (true);

create policy "Allow public update"
  on boards for update
  to anon
  using (true);

create policy "Allow public delete"
  on boards for delete
  to anon
  using (true);

-- Storage bucket for board photos. Run this part, then in the Supabase
-- dashboard under Storage, confirm a "board-photos" bucket exists and is
-- set to Public.
insert into storage.buckets (id, name, public)
values ('board-photos', 'board-photos', true)
on conflict (id) do nothing;

create policy "Public read board photos"
  on storage.objects for select
  to anon
  using (bucket_id = 'board-photos');

create policy "Public upload board photos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'board-photos');

create policy "Public delete board photos"
  on storage.objects for delete
  to anon
  using (bucket_id = 'board-photos');

-- Run this to remove the status column if you added it earlier.
-- Safe to run even if the column doesn't exist yet.
alter table boards drop column if exists status;

-- Add location_description column (run this if boards table already exists)
alter table boards add column if not exists location_description text;

-- Add operator column
alter table boards add column if not exists operator text;

-- Run this to set all existing boards to OUTFRONT at once:
-- update boards set operator = 'OUTFRONT' where operator is null;

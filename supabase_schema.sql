-- Run this in the Supabase SQL editor once your project is created.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  listing_id text,
  format text,
  market text,
  budget text,
  start_date date,
  notes text,
  created_at timestamptz not null default now()
);

-- Allow the anon key used by the app to insert leads (writes only).
alter table leads enable row level security;

create policy "Allow public inserts"
  on leads for insert
  to anon
  with check (true);

-- No select policy is added on purpose -- leads are only readable from the
-- Supabase dashboard (or a future authenticated admin view), not the
-- public anon key.

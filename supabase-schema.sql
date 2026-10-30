-- Kuttarmare Agro Farm product catalogue
-- Run this in Supabase SQL Editor. Configure RLS policies before going live.
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('fruits','poultry','vegetables')),
  emoji text,
  image_url text,
  wholesale numeric(12,2) not null default 0,
  retail numeric(12,2) not null default 0,
  unit text not null default 'kg',
  available boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
-- Public visitors can read the catalogue.
create policy "Public can read products" on public.products
for select to anon, authenticated using (true);
-- IMPORTANT: Do not enable public insert/update/delete.
-- Add authenticated-only policies after creating your admin user, for example:
-- create policy "Admin can insert products" on public.products
-- for insert to authenticated with check (auth.uid() is not null);
-- create policy "Admin can update products" on public.products
-- for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
-- create policy "Admin can delete products" on public.products
-- for delete to authenticated using (auth.uid() is not null);
-- For production, restrict these policies to your specific admin user UUID.

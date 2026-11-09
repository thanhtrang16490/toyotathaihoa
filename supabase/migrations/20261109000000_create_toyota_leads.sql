begin;

create table public.toyota_leads (
  id uuid primary key,
  name text not null,
  phone text not null,
  intent text not null check (intent in ('quote', 'test_drive', 'service')),
  model text not null,
  trim text,
  color text,
  email text,
  preferred_date date,
  preferred_time text,
  test_drive_note text,
  received_at timestamptz not null default now()
);

alter table public.toyota_leads enable row level security;
revoke all on public.toyota_leads from public, anon, authenticated, service_role;
grant insert, select (id) on public.toyota_leads to service_role;

commit;

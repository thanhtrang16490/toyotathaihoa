begin;

create table public.toyota_product_details (
  slug text primary key check (slug ~ '^/toyota/[a-z0-9-]+/$'),
  description text not null check (char_length(description) <= 500),
  availability text not null check (availability in ('contact', 'available', 'unavailable'))
);

alter table public.toyota_product_details enable row level security;
revoke all on public.toyota_product_details from public, anon, authenticated, service_role;
grant select on public.toyota_product_details to anon, authenticated, service_role;
grant insert, update on public.toyota_product_details to service_role;
create policy read_product_details on public.toyota_product_details for select to anon, authenticated using (true);

create table public.toyota_articles (
  slug text primary key check (left(slug, 1) = '/' and right(slug, 1) = '/' and char_length(slug) <= 400),
  original boolean not null default false,
  title text not null check (char_length(title) between 2 and 250),
  description text not null check (char_length(description) <= 500),
  image text not null default '' check (image = '' or image ~ '^/media/[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*[.](webp|png|jpg|jpeg|avif)$'),
  body text check (char_length(body) <= 30000),
  published boolean not null default false,
  published_at timestamptz default now(),
  check (original or (slug ~ '^/tin-tuc/[a-z0-9]+(-[a-z0-9]+)*/$' and body is not null))
);

alter table public.toyota_articles enable row level security;
revoke all on public.toyota_articles from public, anon, authenticated, service_role;
grant select, insert, update on public.toyota_articles to service_role;

-- Expose an unpublished legacy path only as a visibility marker so the site can hide its bundled copy.
create view public.toyota_public_articles with (security_barrier = true) as
select slug, published, published_at,
  case when published then title end as title,
  case when published then description end as description,
  case when published then image end as image,
  case when published then body end as body
from public.toyota_articles
where published or original;

revoke all on public.toyota_public_articles from public, anon, authenticated, service_role;
grant select on public.toyota_public_articles to anon, authenticated;

commit;

begin;

alter table public.toyota_product_details
  alter column description set default '',
  alter column availability set default 'contact',
  add column title text check (title is null or char_length(title) between 2 and 100),
  add column category text check (category is null or category in ('SUV', 'Sedan', 'Hatchback', 'Đa dụng', 'Bán tải', 'MPV')),
  add column image text check (image is null or image ~ '^/media/[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*[.](webp|png|jpg|jpeg|avif)$'),
  add column retail_price bigint check (retail_price is null or retail_price between 1 and 20000000000),
  add column deleted_at timestamptz;

-- Keep a visibility marker for deleted products so bundled listings stay hidden.
create view public.toyota_public_products with (security_barrier = true) as
select slug, deleted_at,
  case when deleted_at is null then title end as title,
  case when deleted_at is null then description end as description,
  case when deleted_at is null then category end as category,
  case when deleted_at is null then image end as image,
  case when deleted_at is null then retail_price end as retail_price,
  case when deleted_at is null then availability end as availability
from public.toyota_product_details;

revoke select on public.toyota_product_details from anon, authenticated;
drop policy read_product_details on public.toyota_product_details;
revoke all on public.toyota_public_products from public, anon, authenticated, service_role;
grant select on public.toyota_public_products to anon, authenticated;

commit;

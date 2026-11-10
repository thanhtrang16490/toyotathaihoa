begin;

alter table public.toyota_articles add column deleted_at timestamptz;

create or replace view public.toyota_public_articles with (security_barrier = true) as
select slug, (published and deleted_at is null) as published, published_at,
  case when published and deleted_at is null then title end as title,
  case when published and deleted_at is null then description end as description,
  case when published and deleted_at is null then image end as image,
  case when published and deleted_at is null then body end as body,
  deleted_at
from public.toyota_articles
where (published and deleted_at is null) or original;

notify pgrst, 'reload schema';
commit;

begin;

alter table public.toyota_leads
  add column status text not null default 'new'
    check (status in ('new', 'contacted', 'closed', 'test'));

-- Mark the exact synthetic lead used to verify the original integration.
update public.toyota_leads set status = 'test'
where id = 'ff1d5c14-1ef4-4f2c-99c3-ece0719d167b'
  and name = 'Kiểm thử Supabase Toyota';

grant select on public.toyota_leads to service_role;
grant update (status) on public.toyota_leads to service_role;

create table public.toyota_on_road_prices (
  id text primary key check (id ~ '^[a-z0-9-]{1,40}$'),
  model_id text not null,
  model text not null,
  variant text not null,
  retail bigint not null check (retail between 1 and 20000000000),
  hanoi bigint check (hanoi <= 20000000000),
  province10 bigint not null check (province10 <= 20000000000),
  province12 bigint not null check (province12 <= 20000000000),
  note text check (length(note) <= 500),
  position integer not null,
  published boolean not null default true,
  check (hanoi is null or hanoi >= round(retail * case when model_id = 'hilux' then 1.072 else 1.12 end)),
  check (province10 >= round(retail * case when model_id = 'hilux' then 1.06 else 1.10 end)),
  check (province12 >= round(retail * case when model_id = 'hilux' then 1.072 else 1.12 end))
);

alter table public.toyota_on_road_prices enable row level security;
revoke all on public.toyota_on_road_prices from public, anon, authenticated, service_role;
grant select on public.toyota_on_road_prices to anon, authenticated, service_role;
grant update (retail, hanoi, province10, province12, note, published)
  on public.toyota_on_road_prices to service_role;
create policy public_read_published_toyota_prices on public.toyota_on_road_prices
  for select to anon, authenticated using (published);

-- Workbook Sheet1, B4:F42. Excludes row 7, marked “BỎ”.
-- The Hà Nội totals in rows 23 and 24 are pending verification.
insert into public.toyota_on_road_prices
  (id, model_id, model, variant, retail, hanoi, province10, province12, note, position)
values
  ('wigo-g', 'wigo', 'Wigo', 'G', 405000000, 469780000, 447880000, 455980000, null, 0),
  ('ve', 'vios', 'Vios', 'E số sàn', 458000000, 529140000, 506180000, 515340000, null, 100),
  ('vk', 'vios', 'Vios', 'E CVT', 488000000, 562740000, 539180000, 548940000, null, 101),
  ('vg', 'vios', 'Vios', 'G CVT', 545000000, 626580000, 601880000, 612780000, null, 102),
  ('rz', 'raize', 'Raize', 'Mã RZ', 510000000, 587380000, 563380000, 573580000, null, 200),
  ('rzx', 'raize', 'Raize', 'Mã RZX', 518000000, 596340000, 572180000, 582540000, null, 201),
  ('rzj', 'raize', 'Raize', 'Mã RZJ', 522000000, 600820000, 576580000, 587020000, null, 202),
  ('ae', 'avanza-premio', 'Avanza', 'E', 558000000, 641140000, 616180000, 627733000, 'Bảng gốc ghi phiên bản này hết xe tại thời điểm lập bảng.', 300),
  ('ag', 'avanza-premio', 'Avanza', 'G', 598000000, 685940000, 660180000, 672533000, null, 301),
  ('he', 'hilux', 'Hilux', '2.8L 4×2 MT', 632000000, 680784000, 673200000, 680784000, null, 400),
  ('hk', 'hilux', 'Hilux', '2.8L 4×2 AT', 706000000, 760112000, 751640000, 760112000, null, 401),
  ('hq', 'hilux', 'Hilux', '2.8L 4×4 AT', 903000000, 971296000, 960460000, 971296000, null, 402),
  ('vle', 'veloz-cross', 'Veloz Cross', 'CVT', 638000000, 730740000, 704180000, 717333000, null, 500),
  ('vlg', 'veloz-cross', 'Veloz Cross', 'CVT Top', 660000000, 755380000, 728380000, 741973000, null, 501),
  ('yxv-den', 'yaris-cross', 'Yaris Cross', 'Xăng · Đen', 650000000, 744180000, 717380000, 730380000, null, 600),
  ('yxv-089', 'yaris-cross', 'Yaris Cross', 'Xăng · Mã màu 089', 658000000, 753140000, 726180000, 739340000, null, 601),
  ('yxv-2-mau', 'yaris-cross', 'Yaris Cross', 'Xăng · Hai màu', 662000000, 757620000, 730580000, 743820000, null, 602),
  ('yxh-den', 'yaris-cross', 'Yaris Cross', 'Hybrid · Đen', 728000000, 831540000, 803180000, 817740000, null, 603),
  ('yxh-089', 'yaris-cross', 'Yaris Cross', 'Hybrid · Mã màu 089', 736000000, 840500000, 811980000, 826700000, null, 604),
  ('yxh-2-mau', 'yaris-cross', 'Yaris Cross', 'Hybrid · Hai màu', 740000000, 844980000, 816380000, 831180000, null, 605),
  ('cv', 'corolla-altis', 'Corolla Altis', '1.8G', 725000000, 828180000, 799880000, 814380000, null, 700),
  ('cq', 'corolla-altis', 'Corolla Altis', '1.8V', 780000000, 889780000, 860380000, 875980000, null, 701),
  ('altis-hv', 'corolla-altis', 'Corolla Altis', '1.8 Hybrid', 870000000, 990580000, 959380000, 976780000, 'Bảng gốc ghi phiên bản này hết xe tại thời điểm lập bảng.', 702),
  ('cxv', 'corolla-cross', 'Corolla Cross', '1.8V', 820000000, 934580000, 904380000, 920780000, null, 800),
  ('cxh', 'corolla-cross', 'Corolla Cross', 'Hybrid', 865000000, 984980000, 953880000, 971180000, null, 801),
  ('ixg', 'innova', 'Innova', '2.0G', 730000000, 833780000, 805380000, 820373000, null, 900),
  ('iv', 'innova', 'Innova', '2.0V', 995000000, 1130580000, 1096880000, 1117173000, null, 901),
  ('ixv', 'innova-cross', 'Innova Cross', 'Xăng', 825000000, 940180000, 909880000, 926773000, null, 1000),
  ('ixh', 'innova-cross', 'Innova Cross', 'Hybrid', 960000000, 1091380000, 1058380000, 1077973000, null, 1001),
  ('ke', 'camry', 'Camry', '2.0G', 1105000000, 1253780000, 1217880000, 1239980000, null, 1100),
  ('kv', 'camry', 'Camry', '2.0Q', 1220000000, 1382580000, 1344380000, 1368780000, null, 1101),
  ('camry-hv-mid', 'camry', 'Camry', '2.5 Hybrid Mid', 1460000000, 1651380000, 1608380000, 1637580000, 'Bảng gốc ghi cùng giá cho bản Mid và Top. Vui lòng xác nhận với đại lý.', 1102),
  ('camry-hv-top', 'camry', 'Camry', '2.5 Hybrid Top', 1460000000, 1651380000, 1608380000, 1637580000, 'Bảng gốc ghi cùng giá cho bản Mid và Top. Vui lòng xác nhận với đại lý.', 1103),
  ('fxl', 'fortuner', 'Fortuner', '2.7 xăng · 1 cầu', 1155000000, 1309780000, 1272880000, 1296373000, null, 1200),
  ('fx', 'fortuner', 'Fortuner', 'Legender 2.7 xăng · 1 cầu', 1290000000, 1460980000, 1421380000, 1447573000, null, 1201),
  ('fv', 'fortuner', 'Fortuner', 'Legender 2.7 xăng · 2 cầu', 1395000000, 1578580000, 1536880000, 1565173000, null, 1202),
  ('lp', 'toyota-land-prado', 'Land Prado', 'Mã LP', 3480000000, null, 3830380000, 3900373000, null, 1300),
  ('lc', 'land-cruiser', 'Land Cruiser', 'Mã LC', 4580000000, null, 5040380000, 5132373000, null, 1400);

commit;

begin;

alter table public.toyota_leads
  add column license_plate text check (char_length(license_plate) between 5 and 20),
  add column service_item text check (char_length(service_item) between 1 and 100);

commit;

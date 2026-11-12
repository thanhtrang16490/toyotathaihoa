begin;
alter table public.toyota_leads
  drop constraint toyota_leads_intent_check,
  add constraint toyota_leads_intent_check check (intent in ('quote','test_drive','service','contact')),
  add column contact_message text check (char_length(contact_message) between 5 and 1000);
commit;

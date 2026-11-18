-- Gesundheit: Profile und Ernährung je Konto
-- ------------------------------------------------------------------------------------------
-- NICHT ausführen, bevor Erik ausdrücklich Ja gesagt hat. Dieses Skript ändert die Live-Datenbank.
-- Gefahrlos wiederholbar (Daten bleiben erhalten). Voraussetzung: gesundheit_setup.sql und
-- gesundheit_setup_v2.sql (public.ist_erik(), public.gesundheit_erik_id(), public.gesundheit_token_ok()).
-- Bestehende Richtlinien für Whoop, Tagebuch, Morgen-Check, Labor und Sprachnotizen bleiben unverändert
-- (weiterhin nur Erik). Keine Zugangsdaten in dieser Datei – der Upload nutzt die vorhandene Token-Prüfung.
-- ------------------------------------------------------------------------------------------

do $$
begin
  if to_regprocedure('public.ist_erik()') is null
     or to_regprocedure('public.gesundheit_erik_id()') is null
     or to_regprocedure('public.gesundheit_token_ok(text)') is null then
    raise exception 'Bitte zuerst gesundheit_setup.sql und gesundheit_setup_v2.sql ausführen.';
  end if;
end $$;

-- 1) Profil ------------------------------------------------------------------------------
create table if not exists public.gesundheit_profil (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  anzeigename  text not null default '' check (char_length(anzeigename) <= 80),
  gewicht_kg   numeric(5,1) check (gewicht_kg is null or (gewicht_kg >= 35 and gewicht_kg <= 200)),
  erstellt     timestamptz not null default now(),
  geaendert    timestamptz not null default now()
);

create or replace function public.gesundheit_profil_geaendert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.geaendert := now();
  new.user_id := old.user_id;
  new.erstellt := old.erstellt;
  return new;
end $$;
drop trigger if exists gesundheit_profil_geaendert on public.gesundheit_profil;
create trigger gesundheit_profil_geaendert before update on public.gesundheit_profil
  for each row execute function public.gesundheit_profil_geaendert();

alter table public.gesundheit_profil enable row level security;
revoke all on table public.gesundheit_profil from public, anon, authenticated;
grant select, insert, update on table public.gesundheit_profil to authenticated;

drop policy if exists profil_lesen   on public.gesundheit_profil;
drop policy if exists profil_anlegen on public.gesundheit_profil;
drop policy if exists profil_aendern on public.gesundheit_profil;
create policy profil_lesen   on public.gesundheit_profil for select to authenticated
  using (user_id = (select auth.uid()));
create policy profil_anlegen on public.gesundheit_profil for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy profil_aendern on public.gesundheit_profil for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Eriks Profil einmalig mit 73 kg anlegen; vorhandene Werte nicht überschreiben
insert into public.gesundheit_profil (user_id, anzeigename, gewicht_kg)
select public.gesundheit_erik_id(), 'Erik', 73
on conflict (user_id) do nothing;

-- 2) Ernährung ---------------------------------------------------------------------------
create table if not exists public.gesundheit_ernaehrung (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null default auth.uid() references auth.users(id) on delete cascade,
  datum                  date not null,
  uhrzeit                text not null default '' check (char_length(uhrzeit) <= 8),
  mahlzeit               text not null
                         check (mahlzeit in ('frühstück','mittag','abend','snack','getränk')),
  was                    text not null check (char_length(btrim(was)) > 0 and char_length(was) <= 300),
  menge_geschaetzt       text not null default '' check (char_length(menge_geschaetzt) <= 200),
  notiz                  text not null default '' check (char_length(notiz) <= 500),
  kcal                   numeric,
  protein_g              numeric,
  ballaststoffe_g        numeric,
  zucker_g               numeric,
  gemuese_obst_portionen numeric,
  nova                   smallint check (nova is null or nova between 1 and 4),
  frittiert              text check (frittiert is null or frittiert in ('ja','nein')),
  bewertung              text check (bewertung is null or bewertung in ('gut','okay','ungünstig')),
  quelle                 text not null default 'manual' check (quelle in ('manual','sanji')),
  quelle_key             text check (quelle_key is null or char_length(quelle_key) <= 400),
  erstellt               timestamptz not null default now(),
  geaendert              timestamptz not null default now()
);

create unique index if not exists gesundheit_ernaehrung_quelle_key_idx
  on public.gesundheit_ernaehrung (user_id, quelle_key)
  where quelle_key is not null;
create index if not exists gesundheit_ernaehrung_user_datum_idx
  on public.gesundheit_ernaehrung (user_id, datum desc, erstellt);

create or replace function public.gesundheit_ernaehrung_geaendert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.geaendert := now();
  new.user_id := old.user_id;
  new.erstellt := old.erstellt;
  if old.quelle = 'sanji' then
    new.quelle := 'sanji';
    new.quelle_key := old.quelle_key;
  end if;
  return new;
end $$;
drop trigger if exists gesundheit_ernaehrung_geaendert on public.gesundheit_ernaehrung;
create trigger gesundheit_ernaehrung_geaendert before update on public.gesundheit_ernaehrung
  for each row execute function public.gesundheit_ernaehrung_geaendert();

alter table public.gesundheit_ernaehrung enable row level security;
revoke all on table public.gesundheit_ernaehrung from public, anon, authenticated;
grant select, insert, update, delete on table public.gesundheit_ernaehrung to authenticated;

drop policy if exists ernaehrung_lesen    on public.gesundheit_ernaehrung;
drop policy if exists ernaehrung_anlegen  on public.gesundheit_ernaehrung;
drop policy if exists ernaehrung_aendern  on public.gesundheit_ernaehrung;
drop policy if exists ernaehrung_loeschen on public.gesundheit_ernaehrung;
create policy ernaehrung_lesen on public.gesundheit_ernaehrung for select to authenticated
  using (user_id = (select auth.uid()));
create policy ernaehrung_anlegen on public.gesundheit_ernaehrung for insert to authenticated
  with check (user_id = (select auth.uid()) and quelle = 'manual' and quelle_key is null);
create policy ernaehrung_aendern on public.gesundheit_ernaehrung for update to authenticated
  using (user_id = (select auth.uid()) and quelle = 'manual')
  with check (user_id = (select auth.uid()) and quelle = 'manual');
create policy ernaehrung_loeschen on public.gesundheit_ernaehrung for delete to authenticated
  using (user_id = (select auth.uid()) and quelle = 'manual');

-- 3) Upload nur für Eriks Konto, nur mit dem bestehenden Upload-Token -------------------
create or replace function public.gesundheit_ernaehrung_upload(p_token text, p_zeilen jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_erik uuid;
  v_ins  int := 0;
  v_upd  int := 0;
  v_row  jsonb;
  v_key  text;
  v_id   uuid;
  v_mahlzeit text;
  v_fritt text;
  v_bew  text;
  v_nova int;
begin
  if not public.gesundheit_token_ok(p_token) then
    raise exception 'nicht berechtigt' using errcode = '42501';
  end if;
  v_erik := public.gesundheit_erik_id();
  if p_zeilen is null or jsonb_typeof(p_zeilen) <> 'array' then
    raise exception 'ungueltige Daten (Liste erwartet)' using errcode = '22023';
  end if;
  if octet_length(p_zeilen::text) > 2000000 then
    raise exception 'Daten zu gross' using errcode = '22023';
  end if;

  for v_row in select value from jsonb_array_elements(p_zeilen)
  loop
    v_key := nullif(btrim(v_row->>'quelle_key'), '');
    if v_key is null then
      continue;
    end if;
    v_mahlzeit := v_row->>'mahlzeit';
    if v_mahlzeit not in ('frühstück','mittag','abend','snack','getränk') then
      continue;
    end if;
    v_fritt := nullif(v_row->>'frittiert', '');
    v_bew := nullif(v_row->>'bewertung', '');
    v_nova := nullif(v_row->>'nova', '')::int;

    select id into v_id
      from public.gesundheit_ernaehrung
     where user_id = v_erik and quelle_key = v_key;

    if v_id is null then
      insert into public.gesundheit_ernaehrung (
        user_id, datum, uhrzeit, mahlzeit, was, menge_geschaetzt, notiz,
        kcal, protein_g, ballaststoffe_g, zucker_g, gemuese_obst_portionen,
        nova, frittiert, bewertung, quelle, quelle_key
      ) values (
        v_erik,
        (v_row->>'datum')::date,
        coalesce(v_row->>'uhrzeit', ''),
        v_mahlzeit,
        coalesce(v_row->>'was', ''),
        coalesce(v_row->>'menge_geschaetzt', ''),
        coalesce(v_row->>'notiz', ''),
        nullif(v_row->>'kcal', '')::numeric,
        nullif(v_row->>'protein_g', '')::numeric,
        nullif(v_row->>'ballaststoffe_g', '')::numeric,
        nullif(v_row->>'zucker_g', '')::numeric,
        nullif(v_row->>'gemuese_obst_portionen', '')::numeric,
        v_nova, v_fritt, v_bew, 'sanji', v_key
      );
      v_ins := v_ins + 1;
    else
      update public.gesundheit_ernaehrung set
        datum = (v_row->>'datum')::date,
        uhrzeit = coalesce(v_row->>'uhrzeit', ''),
        mahlzeit = v_mahlzeit,
        was = coalesce(v_row->>'was', ''),
        menge_geschaetzt = coalesce(v_row->>'menge_geschaetzt', ''),
        notiz = coalesce(v_row->>'notiz', ''),
        kcal = nullif(v_row->>'kcal', '')::numeric,
        protein_g = nullif(v_row->>'protein_g', '')::numeric,
        ballaststoffe_g = nullif(v_row->>'ballaststoffe_g', '')::numeric,
        zucker_g = nullif(v_row->>'zucker_g', '')::numeric,
        gemuese_obst_portionen = nullif(v_row->>'gemuese_obst_portionen', '')::numeric,
        nova = v_nova,
        frittiert = v_fritt,
        bewertung = v_bew
      where id = v_id and user_id = v_erik;
      v_upd := v_upd + 1;
    end if;
  end loop;

  return jsonb_build_object('eingefuegt', v_ins, 'aktualisiert', v_upd, 'gesamt', v_ins + v_upd);
end $$;
revoke all on function public.gesundheit_ernaehrung_upload(text, jsonb) from public, anon, authenticated;
grant execute on function public.gesundheit_ernaehrung_upload(text, jsonb) to anon;

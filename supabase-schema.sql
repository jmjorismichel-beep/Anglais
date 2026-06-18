-- ============================================================
-- EnglishPath — Schéma SQL Supabase complet
-- Copiez-collez dans Supabase > SQL Editor > New query
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Table learners ──────────────────────────────────────────
create table public.learners (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  first_name    text,
  last_name     text,
  role          text default 'learner' check (role in ('learner','trainer','admin')),
  level         text default 'A1'  check (level in ('A1','A2','B1','B1+','TELC')),
  current_unit  integer default 1,
  current_chapter text default '1.1',
  xp            integer default 0,
  streak        integer default 0,
  last_active   date default current_date,
  positioning_level text,
  settings      jsonb default '{"lang":"fr","fontSize":"normal","dyslexia":false,"highContrast":false,"audioSpeed":1,"offlineMode":false}'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── Table progress ───────────────────────────────────────────
create table public.progress (
  id            uuid default gen_random_uuid() primary key,
  learner_id    uuid references public.learners(id) on delete cascade,
  unit_id       integer not null,
  chapter_id    text not null,
  score         integer check (score between 0 and 100),
  time_spent    integer default 0, -- secondes
  attempts      integer default 1,
  completed_at  timestamptz default now(),
  unique (learner_id, unit_id, chapter_id)
);

-- ─── Table exercise_results ───────────────────────────────────
create table public.exercise_results (
  id            uuid default gen_random_uuid() primary key,
  learner_id    uuid references public.learners(id) on delete cascade,
  exercise_id   text not null,
  exercise_type text,
  score         integer,
  answer_given  text,
  correct       boolean,
  time_spent    integer,
  answered_at   timestamptz default now()
);

-- ─── Table groups ─────────────────────────────────────────────
create table public.groups (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  trainer_id    uuid references public.learners(id),
  level         text default 'A1',
  description   text,
  created_at    timestamptz default now()
);

-- ─── Table group_members ──────────────────────────────────────
create table public.group_members (
  group_id      uuid references public.groups(id) on delete cascade,
  learner_id    uuid references public.learners(id) on delete cascade,
  joined_at     timestamptz default now(),
  primary key (group_id, learner_id)
);

-- ─── Table assignments ────────────────────────────────────────
create table public.assignments (
  id            uuid default gen_random_uuid() primary key,
  group_id      uuid references public.groups(id) on delete cascade,
  exercise_id   text not null,
  title         text,
  due_date      date,
  created_at    timestamptz default now()
);

-- ─── Table messages ───────────────────────────────────────────
create table public.messages (
  id            uuid default gen_random_uuid() primary key,
  from_id       uuid references public.learners(id),
  to_id         uuid references public.learners(id),
  content       text not null,
  read          boolean default false,
  sent_at       timestamptz default now()
);

-- ─── Table favorites ──────────────────────────────────────────
create table public.favorites (
  id            uuid default gen_random_uuid() primary key,
  learner_id    uuid references public.learners(id) on delete cascade,
  exercise_id   text not null,
  saved_at      timestamptz default now(),
  unique (learner_id, exercise_id)
);

-- ─── Table badges ─────────────────────────────────────────────
create table public.badges (
  id            uuid default gen_random_uuid() primary key,
  learner_id    uuid references public.learners(id) on delete cascade,
  badge_id      text not null,
  earned_at     timestamptz default now(),
  unique (learner_id, badge_id)
);

-- ─── Table audio_files ───────────────────────────────────────
create table public.audio_files (
  id            uuid default gen_random_uuid() primary key,
  filename      text unique not null,
  unit_id       integer,
  chapter_id    text,
  source        text check (source in ('coursebook','workbook','grammar_ref','voxpops','video')),
  storage_path  text,
  duration_sec  integer,
  created_at    timestamptz default now()
);

-- ============================================================
-- FONCTIONS SQL
-- ============================================================

-- Ajouter des XP et gérer les niveaux
create or replace function add_xp(user_id uuid, xp_amount integer)
returns integer language plpgsql security definer as $$
declare new_xp integer;
begin
  update learners set xp = xp + xp_amount, updated_at = now()
  where id = user_id returning xp into new_xp;
  return new_xp;
end;
$$;

-- Mettre à jour le streak
create or replace function update_streak(user_id uuid)
returns integer language plpgsql security definer as $$
declare
  last_date date;
  current_streak integer;
begin
  select last_active, streak into last_date, current_streak
  from learners where id = user_id;

  if last_date = current_date then
    return current_streak; -- déjà fait aujourd'hui
  elsif last_date = current_date - 1 then
    -- Hier → on incrémente
    update learners set streak = streak + 1, last_active = current_date, updated_at = now()
    where id = user_id returning streak into current_streak;
  else
    -- Rupture → on remet à 1
    update learners set streak = 1, last_active = current_date, updated_at = now()
    where id = user_id returning streak into current_streak;
  end if;
  return current_streak;
end;
$$;

-- Statistiques apprenant
create or replace function get_learner_stats(p_learner_id uuid)
returns json language plpgsql security definer as $$
declare result json;
begin
  select json_build_object(
    'total_exercises', count(*),
    'avg_score', round(avg(score)),
    'total_time', sum(time_spent),
    'units_completed', count(distinct unit_id)
  ) into result
  from progress where learner_id = p_learner_id;
  return result;
end;
$$;

-- Progression groupe pour formateur
create or replace function get_group_progress(p_group_id uuid)
returns table(
  learner_id uuid, first_name text, last_name text,
  level text, xp integer, streak integer,
  avg_score numeric, exercises_done bigint, last_active date
) language plpgsql security definer as $$
begin
  return query
  select l.id, l.first_name, l.last_name, l.level, l.xp, l.streak,
    round(avg(p.score), 0), count(p.id), l.last_active
  from group_members gm
  join learners l on l.id = gm.learner_id
  left join progress p on p.learner_id = l.id
  where gm.group_id = p_group_id
  group by l.id, l.first_name, l.last_name, l.level, l.xp, l.streak, l.last_active;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RGPD)
-- ============================================================

alter table learners        enable row level security;
alter table progress        enable row level security;
alter table exercise_results enable row level security;
alter table favorites       enable row level security;
alter table badges          enable row level security;
alter table messages        enable row level security;
alter table groups          enable row level security;
alter table group_members   enable row level security;
alter table assignments     enable row level security;

-- Learners : chacun voit uniquement son profil
create policy "Learner own profile" on learners
  for all using (auth.uid() = id);

-- Les formateurs voient les apprenants de leurs groupes
create policy "Trainer sees group members" on learners
  for select using (
    id in (
      select gm.learner_id from group_members gm
      join groups g on g.id = gm.group_id
      where g.trainer_id = auth.uid()
    )
  );

-- Progress : apprenant voit sa propre progression
create policy "Learner own progress" on progress
  for all using (learner_id = auth.uid());

-- Formateur voit la progression de ses apprenants
create policy "Trainer sees member progress" on progress
  for select using (
    learner_id in (
      select gm.learner_id from group_members gm
      join groups g on g.id = gm.group_id
      where g.trainer_id = auth.uid()
    )
  );

-- Exercise results
create policy "Own exercise results" on exercise_results
  for all using (learner_id = auth.uid());

-- Favorites
create policy "Own favorites" on favorites
  for all using (learner_id = auth.uid());

-- Badges
create policy "Own badges" on badges
  for all using (learner_id = auth.uid());

-- Messages
create policy "Own messages" on messages
  for all using (from_id = auth.uid() or to_id = auth.uid());

-- Groups : formateur gère ses groupes
create policy "Trainer manages groups" on groups
  for all using (trainer_id = auth.uid());

create policy "Members see their groups" on groups
  for select using (
    id in (select group_id from group_members where learner_id = auth.uid())
  );

-- Group members
create policy "Trainer manages members" on group_members
  for all using (
    group_id in (select id from groups where trainer_id = auth.uid())
  );

create policy "Member sees own membership" on group_members
  for select using (learner_id = auth.uid());

-- Assignments : membres voient les devoirs de leur groupe
create policy "Group assignments visible" on assignments
  for select using (
    group_id in (select group_id from group_members where learner_id = auth.uid())
    or
    group_id in (select id from groups where trainer_id = auth.uid())
  );

-- Audio files : lecture publique
alter table audio_files enable row level security;
create policy "Audio files public read" on audio_files for select using (true);

-- ============================================================
-- Storage buckets (à créer dans Supabase Dashboard > Storage)
-- ============================================================
-- Bucket "audio" : fichiers MP3 du programme Navigate
-- Bucket "videos" : fichiers MP4 (Voxpops, vidéos unités)
-- Bucket "avatars" : photos de profil apprenants
-- Bucket "exports" : PDF générés (attestations, fiches)
-- Tous en accès "public" pour les audio/vidéos
-- "exports" en accès authentifié uniquement

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Mettre à jour updated_at automatiquement
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger learners_updated_at before update on learners
  for each row execute function update_updated_at();

-- Attribuer un badge automatiquement
create or replace function check_and_award_badges()
returns trigger language plpgsql security definer as $$
declare learner record;
begin
  select * into learner from learners where id = new.learner_id;
  -- Badge première leçon
  if not exists (select 1 from badges where learner_id = new.learner_id and badge_id = 'first_lesson') then
    insert into badges(learner_id, badge_id) values (new.learner_id, 'first_lesson');
  end if;
  -- Badge 10 exercices
  if (select count(*) from progress where learner_id = new.learner_id) >= 10 then
    insert into badges(learner_id, badge_id) values (new.learner_id, 'exercises_10')
    on conflict do nothing;
  end if;
  -- Badge streak 7 jours
  if learner.streak >= 7 then
    insert into badges(learner_id, badge_id) values (new.learner_id, 'streak_7')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger award_badges_on_progress after insert on progress
  for each row execute function check_and_award_badges();

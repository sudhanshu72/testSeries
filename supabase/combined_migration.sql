-- Run this entire file once in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/rqoppoeunupscsdsrbkb/sql

-- ========== 20240606000001_profiles.sql ==========

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if not public.is_admin() and new.role is distinct from old.role then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- ========== 20240606000002_exams_questions.sql ==========

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  total_marks integer not null default 0 check (total_marks >= 0),
  is_published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger exams_set_updated_at
  before update on public.exams
  for each row execute function public.set_updated_at();

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams (id) on delete cascade,
  question_text text not null,
  question_type text not null default 'mcq_single'
    check (question_type = 'mcq_single'),
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  marks integer not null default 1 check (marks > 0),
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  constraint questions_options_is_array check (jsonb_typeof(options) = 'array')
);

create index exams_is_published_idx on public.exams (is_published);
create index questions_exam_id_order_idx on public.questions (exam_id, order_index);

create view public.questions_public
with (security_invoker = false)
as
select
  q.id,
  q.exam_id,
  q.question_text,
  q.question_type,
  q.options,
  q.marks,
  q.order_index,
  q.created_at
from public.questions q
inner join public.exams e on e.id = q.exam_id
where e.is_published = true;

grant select on public.questions_public to authenticated;

-- ========== 20240606000003_rls_policies.sql ==========

alter table public.exams enable row level security;
alter table public.questions enable row level security;

create policy "Authenticated users can view published exams"
  on public.exams for select
  to authenticated
  using (is_published = true);

create policy "Admins can view all exams"
  on public.exams for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert exams"
  on public.exams for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update exams"
  on public.exams for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete exams"
  on public.exams for delete
  to authenticated
  using (public.is_admin());

create policy "Admins can view all questions"
  on public.questions for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert questions"
  on public.questions for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update questions"
  on public.questions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete questions"
  on public.questions for delete
  to authenticated
  using (public.is_admin());

-- ========== 20240606000004_seed_sample_exam.sql ==========

insert into public.exams (
  title,
  description,
  duration_minutes,
  total_marks,
  is_published
)
values (
  'Sample Aptitude Test',
  'A short demo exam with single-answer MCQs. Use this to verify the exams list and question fetch flows.',
  30,
  5,
  true
);

insert into public.questions (exam_id, question_text, options, correct_answer, marks, order_index)
select
  e.id,
  v.question_text,
  v.options::jsonb,
  v.correct_answer,
  1,
  v.order_index
from public.exams e
cross join (
  values
    (1, 'What is 15% of 200?', '[{"id":"a","text":"20"},{"id":"b","text":"30"},{"id":"c","text":"25"},{"id":"d","text":"35"}]', 'b'),
    (2, 'Which planet is known as the Red Planet?', '[{"id":"a","text":"Venus"},{"id":"b","text":"Mars"},{"id":"c","text":"Jupiter"},{"id":"d","text":"Saturn"}]', 'b'),
    (3, 'What is the capital of France?', '[{"id":"a","text":"Berlin"},{"id":"b","text":"Madrid"},{"id":"c","text":"Paris"},{"id":"d","text":"Rome"}]', 'c'),
    (4, 'How many sides does a hexagon have?', '[{"id":"a","text":"5"},{"id":"b","text":"6"},{"id":"c","text":"7"},{"id":"d","text":"8"}]', 'b'),
    (5, 'Which gas do plants absorb from the atmosphere during photosynthesis?', '[{"id":"a","text":"Oxygen"},{"id":"b","text":"Nitrogen"},{"id":"c","text":"Carbon dioxide"},{"id":"d","text":"Hydrogen"}]', 'c')
) as v(order_index, question_text, options, correct_answer)
where e.title = 'Sample Aptitude Test';


-- ========== 20240606000005_test_results.sql ==========
-- Add tables for storing test attempts and results

create table public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exam_id uuid not null references public.exams (id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  time_taken_seconds integer,
  score integer not null default 0 check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  correct_answers integer not null default 0 check (correct_answers >= 0 and correct_answers <= total_questions),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index test_attempts_user_id_idx on public.test_attempts (user_id);
create index test_attempts_exam_id_idx on public.test_attempts (exam_id);
create index test_attempts_completed_at_idx on public.test_attempts (completed_at);

create trigger test_attempts_set_updated_at
  before update on public.test_attempts
  for each row execute function public.set_updated_at();

create table public.question_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_answer text,
  is_correct boolean,
  time_spent_seconds integer,
  created_at timestamptz not null default now()
);

create index question_responses_attempt_id_idx on public.question_responses (attempt_id);
create index question_responses_question_id_idx on public.question_responses (question_id);

-- RLS Policies for test attempts and responses
alter table public.test_attempts enable row level security;
alter table public.question_responses enable row level security;

create policy "Users can view own test attempts"
  on public.test_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own test attempts"
  on public.test_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own test attempts"
  on public.test_attempts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can view all test attempts"
  on public.test_attempts for select
  to authenticated
  using (public.is_admin());

create policy "Users can view own question responses"
  on public.question_responses for select
  to authenticated
  using (
    exists (
      select 1 from public.test_attempts ta
      where ta.id = attempt_id and ta.user_id = auth.uid()
    )
  );

create policy "Users can insert own question responses"
  on public.question_responses for insert
  to authenticated
  with check (
    exists (
      select 1 from public.test_attempts ta
      where ta.id = attempt_id and ta.user_id = auth.uid()
    )
  );

-- Function to calculate score percentage
create or replace function public.calculate_score_percentage(attempt_id uuid)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  select 
    round((correct_answers::numeric / total_questions::numeric) * 100, 2)
  from public.test_attempts
  where id = attempt_id;
$$;

-- View for leaderboard
create view public.leaderboard
with (security_invoker = false)
as
select
  ta.id as attempt_id,
  ta.exam_id,
  e.title as exam_title,
  ta.user_id,
  p.full_name,
  ta.score,
  ta.correct_answers,
  ta.total_questions,
  public.calculate_score_percentage(ta.id) as percentage,
  ta.time_taken_seconds,
  ta.completed_at,
  rank() over (partition by ta.exam_id order by ta.correct_answers desc, ta.time_taken_seconds asc) as rank
from public.test_attempts ta
inner join public.exams e on e.id = ta.exam_id
inner join public.profiles p on p.id = ta.user_id
where ta.completed_at is not null
order by e.title, rank;

grant select on public.leaderboard to authenticated;
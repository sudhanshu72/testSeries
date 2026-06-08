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
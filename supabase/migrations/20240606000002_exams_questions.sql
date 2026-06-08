-- Exams and questions (MCQ single-answer only in v1)

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

-- Student-safe view: no correct_answer exposed.
-- security_invoker = false lets the view owner read underlying rows while
-- students remain blocked from the base questions table via RLS.
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

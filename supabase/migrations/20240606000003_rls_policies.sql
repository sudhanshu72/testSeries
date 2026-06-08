-- Row Level Security for exams and questions

alter table public.exams enable row level security;
alter table public.questions enable row level security;

-- Exams: students see published; admins manage all
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

-- Questions base table: admin only (students use questions_public view)
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

# Supabase database setup

Run these migrations against your Supabase project **in order**.

## Option A: Supabase SQL Editor (quickest)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Run each file in `migrations/` in numeric order:
   - `20240606000001_profiles.sql`
   - `20240606000002_exams_questions.sql`
   - `20240606000003_rls_policies.sql`
   - `20240606000004_seed_sample_exam.sql` (optional demo data)

## Option B: Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref rqoppoeunupscsdsrbkb
npx supabase db push
```

## Auth settings (required)

In **Authentication → Providers → Email**:

- Enable Email provider
- Turn on **Confirm email** (required sign-up flow)
- Allow open sign-up (default)

In **Authentication → URL Configuration**, set Site URL to your dev URL (e.g. `http://localhost:8081` for Expo web).

## Promote your first admin

After you sign up and confirm your email, run in SQL Editor (replace the email):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'you@example.com'
);
```

## Schema overview

| Object | Purpose |
|--------|---------|
| `profiles` | User display name, avatar, `student` / `admin` role |
| `exams` | Exam metadata; students only see `is_published = true` |
| `questions` | Full question data including `correct_answer` — **admin only** |
| `questions_public` | View for students — **no `correct_answer` column** |

Students should always query `questions_public`. Admins use the `questions` table when creating or editing content.

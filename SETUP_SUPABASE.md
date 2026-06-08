# Supabase Database Setup Instructions

## 🔧 **STEP 1: Run Database Migrations**

Go to your Supabase dashboard:
**URL**: https://supabase.com/dashboard/project/rqoppoeunupscsdsrbkb/sql

### **Option A: Run Combined File (Easiest)**
1. Open SQL Editor
2. Copy ALL content from `supabase/combined_migration.sql`
3. Paste and click **RUN**

### **Option B: Run Individual Migrations**
Run these in order:
1. `supabase/migrations/20240606000001_profiles.sql`
2. `supabase/migrations/20240606000002_exams_questions.sql`
3. `supabase/migrations/20240606000003_rls_policies.sql`
4. `supabase/migrations/20240606000004_seed_sample_exam.sql` (optional)
5. `supabase/migrations/20240606000005_test_results.sql` (new - for storing results)

## 🔐 **STEP 2: Configure Authentication**

In Supabase Dashboard:

### **1. Email Provider Settings**
- Go to **Authentication → Providers → Email**
- ✅ Enable "Email" provider
- ✅ Turn ON **"Confirm email"** (required)
- ✅ Allow "Open sign-up" (default)

### **2. URL Configuration**
- Go to **Authentication → URL Configuration**
- Set **Site URL** to: `http://localhost:8081` (for Expo web)
- Set **Additional Redirect URLs**: `exp://10.0.0.114:8081` (your local Expo URL)

## 👑 **STEP 3: Create Admin User**

### **1. Sign Up in the App**
1. Start the app: `npm start`
2. Open web: Press `w` or go to http://localhost:8081
3. Sign up with your email
4. Check email for verification link
5. Verify email and log in

### **2. Promote to Admin**
In SQL Editor, run (replace with your email):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_EMAIL@example.com'
);
```

## 🎯 **STEP 4: Import Your GK Questions**

### **Option A: Manual Import via SQL**
Create a script to import your 50 GK questions. Example:

```sql
-- First, create an exam for your GK questions
INSERT INTO public.exams (title, description, duration_minutes, total_marks, is_published)
VALUES (
  'ASSISTANT PROFESSOR (LAW) - MOCK TEST 1',
  'General Studies - 50 Questions',
  60,
  50,
  true
);

-- Then insert questions (you'll need to create a script from your GK.json)
```

### **Option B: Use Local JSON (Current Setup)**
The app currently uses your `GK.json` file locally. To store in database:
1. Convert `GK.json` to SQL insert statements
2. Run in Supabase SQL Editor

## 📊 **Database Tables Created**

### **1. Core Tables**
- `profiles` - User profiles with roles (student/admin)
- `exams` - Test metadata
- `questions` - Questions with answers (admin only)
- `questions_public` - Questions without answers (student view)

### **2. New Tables (Added Today)**
- `test_attempts` - Stores test attempts and scores
- `question_responses` - Stores individual question answers
- `leaderboard` - View for rankings

### **3. Security Policies**
- Students can only see published exams
- Students can only see their own test results
- Admins can manage everything
- Row Level Security (RLS) enabled on all tables

## 🚀 **STEP 5: Test the Complete Flow**

### **1. Start the App**
```bash
cd d:\testSeries
npm start
```

### **2. Open in Browser**
- Press `w` in terminal OR
- Go to http://localhost:8081

### **3. Test Flow**
1. **Sign up** with email
2. **Verify email** (check inbox)
3. **Login** to dashboard
4. **View exams** → Select "ASSISTANT PROFESSOR (LAW)"
5. **Take test** → 50 GK questions
6. **Submit** → View results with explanations

## 🔍 **Verify Database Connection**

### **Check if Authentication Works**
1. Sign up in app
2. Check Supabase **Authentication → Users**
3. You should see your user
4. Check **Table Editor → profiles**
5. Your profile should be auto-created

### **Check Sample Data**
1. Go to **Table Editor → exams**
2. You should see "Sample Aptitude Test"
3. Go to **Table Editor → questions**
4. You should see 5 sample questions

## 🛠️ **Troubleshooting**

### **If authentication fails:**
- Check `.env` file has correct Supabase URL and Anon Key
- Verify email confirmation is enabled in Supabase
- Check Site URL matches your local URL

### **If tables don't exist:**
- Run the SQL migrations again
- Check for errors in SQL Editor

### **If RLS blocks access:**
- Make sure you're logged in
- Check user has profile record
- Verify RLS policies are correct

## ✅ **Setup Complete When:**

1. ✅ Database migrations run without errors
2. ✅ Can sign up and verify email
3. ✅ Can log in and see dashboard
4. ✅ Can view test list
5. ✅ Can take GK test (50 questions)
6. ✅ Can view results with explanations

## 📞 **Need Help?**

**For Supabase issues:**
- Check Supabase dashboard for errors
- Review SQL migration output
- Verify authentication settings

**For App issues:**
- Check browser console for errors
- Check terminal where `npm start` is running
- Verify all dependencies installed

---

**Your Test Series app is now ready with:**
- ✅ User authentication (Supabase)
- ✅ Database schema for tests and results  
- ✅ Your 50 GK questions integrated
- ✅ Complete test-taking experience
- ✅ Results tracking and leaderboards
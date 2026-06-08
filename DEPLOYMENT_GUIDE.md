# Complete Deployment Guide - Test Series App

## 📋 **Current Status**

### **✅ Frontend Ready:**
- Complete React Native/Expo app with all screens
- Hardcoded authentication (for testing)
- 50 GK questions integrated from `GK.json`
- Test-taking functionality with timer, navigation, results
- Responsive design (web + mobile)

### **🔄 Need to Deploy:**
1. **Backend/Database**: Supabase
2. **Frontend Hosting**: Vercel/Netlify/Expo
3. **24/7 Access**: Deploy both for students

## 🚀 **Deployment Plan**

### **Phase 1: Deploy Supabase Database (Backend)**
### **Phase 2: Deploy Frontend to Vercel/Netlify**
### **Phase 3: Configure for 24/7 Access**

---

## **PHASE 1: SUPABASE DATABASE DEPLOYMENT**

### **Step 1.1: Set Up Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `test-series-platform`
   - **Database Password**: Create strong password
   - **Region**: Choose closest to your students
   - **Pricing**: Start with Free tier

### **Step 1.2: Run Database Migrations**
1. In Supabase Dashboard → **SQL Editor**
2. Copy ALL content from `supabase/combined_migration.sql`
3. Paste and click **RUN**

### **Step 1.3: Configure Authentication**
1. Go to **Authentication → Providers → Email**
   - ✅ Enable "Email" provider
   - ✅ Turn ON **"Confirm email"** (for security)
   - ✅ Allow "Open sign-up"

2. Go to **Authentication → URL Configuration**
   - **Site URL**: `https://your-frontend-url.vercel.app` (update after Phase 2)
   - **Redirect URLs**: Add your frontend URL

### **Step 1.4: Get API Keys**
1. Go to **Project Settings → API**
2. Copy:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: `eyJ...`

3. Update `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## **PHASE 2: FRONTEND DEPLOYMENT**

### **Option A: Vercel (Recommended for React Native Web)**

#### **Step 2.1: Prepare for Vercel**
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Create `vercel.json`:
```json
{
  "buildCommand": "expo export:web",
  "outputDirectory": "web-build",
  "devCommand": "expo start --web",
  "installCommand": "npm install",
  "framework": null
}
```

3. Update `app.json` for web:
```json
"web": {
  "bundler": "metro",
  "output": "static",
  "favicon": "./assets/favicon.png"
}
```

#### **Step 2.2: Deploy to Vercel**
```bash
# 1. Login to Vercel
vercel login

# 2. Initialize project
vercel init

# 3. Deploy
vercel --prod
```

#### **Step 2.3: Configure Environment Variables in Vercel**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### **Option B: Netlify**
```bash
# 1. Build for web
expo build:web

# 2. Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=web-build
```

### **Option C: Expo Hosting (for Mobile)**
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure EAS
eas build:configure

# 4. Build for Android/iOS
eas build --platform android
eas build --platform ios

# 5. Submit to stores (optional)
eas submit --platform android
```

---

## **PHASE 3: SWITCH TO REAL SUPABASE AUTH**

### **Step 3.1: Update AuthContext**
Replace hardcoded auth with real Supabase:

1. Update `src/contexts/AuthContext.js`:
```javascript
// Change from hardcoded auth to:
import { supabase } from '../lib/supabase';
```

2. Update `src/lib/hardcoded-auth.js` → Use real Supabase functions

### **Step 3.2: Update LoginScreen**
Remove hardcoded auth and use real Supabase signIn/signUp

### **Step 3.3: Import GK Questions to Database**
Create script to import 50 GK questions:

```sql
-- 1. Create exam
INSERT INTO exams (title, description, duration_minutes, total_marks, is_published)
VALUES ('ASSISTANT PROFESSOR (LAW) - MOCK TEST 1', 'General Studies - 50 Questions', 60, 50, true);

-- 2. Import questions (convert GK.json to SQL)
-- You'll need to write a script to convert your GK.json to SQL inserts
```

---

## **📊 Database Schema Deployed**

### **Tables Created:**
1. **`profiles`** - User profiles with roles
2. **`exams`** - Test metadata
3. **`questions`** - Questions with answers (admin only)
4. **`test_attempts`** - Test results storage
5. **`question_responses`** - Individual answers
6. **`leaderboard`** - Rankings view

### **Security:**
- Row Level Security (RLS) enabled
- Students can only see published exams
- Students can only see own results
- Admins have full access

---

## **🔧 Post-Deployment Setup**

### **1. Create Admin User**
```sql
-- After signing up in app, run in SQL Editor:
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com'
);
```

### **2. Import Sample Data**
Run `supabase/migrations/20240606000004_seed_sample_exam.sql` for demo questions

### **3. Configure Email (Optional)**
For production email verification:
1. Go to Supabase → Authentication → Providers → Email
2. Configure SMTP settings or use Supabase email

---

## **🌐 Domain & SSL**

### **Custom Domain (Optional):**
1. Vercel/Netlify: Add custom domain in project settings
2. Configure DNS: Point domain to Vercel/Netlify
3. SSL: Auto-configured by hosting platform

### **Mobile Apps:**
- **Android**: Submit to Google Play Store
- **iOS**: Submit to Apple App Store
- Use Expo Application Services (EAS) for builds

---

## **🛠️ Maintenance & Scaling**

### **Monitoring:**
1. **Supabase Dashboard**: Monitor database usage
2. **Vercel Analytics**: Track web traffic
3. **Error Tracking**: Sentry or LogRocket

### **Scaling:**
1. **Database**: Upgrade Supabase plan if needed
2. **CDN**: Vercel/Netlify provide global CDN
3. **Caching**: Implement React Query/SWR for data

### **Backups:**
1. **Supabase**: Automatic daily backups
2. **Manual Backup**: Export data periodically
3. **Version Control**: All code in Git

---

## **🚨 Troubleshooting**

### **Common Issues:**

#### **1. Authentication Not Working:**
- Check Supabase URL and API keys
- Verify email confirmation is enabled
- Check redirect URLs in Supabase config

#### **2. Database Connection Errors:**
- Verify Supabase project is active
- Check RLS policies aren't blocking access
- Verify network can access Supabase

#### **3. Build Failures:**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: Use LTS version

#### **4. Performance Issues:**
- Enable Supabase database indexes
- Implement pagination for large datasets
- Use CDN for static assets

---

## **✅ Deployment Checklist**

### **Before Deployment:**
- [ ] Test locally with hardcoded auth
- [ ] Verify all 50 GK questions work
- [ ] Test complete user flow
- [ ] Check responsive design

### **During Deployment:**
- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Test deployed version

### **After Deployment:**
- [ ] Create admin user
- [ ] Import GK questions to database
- [ ] Test authentication with real Supabase
- [ ] Monitor for errors
- [ ] Set up analytics

---

## **📞 Support & Updates**

### **For Students:**
- **Web URL**: `https://your-app.vercel.app`
- **Mobile**: Install via Expo Go or app stores
- **Support Email**: `support@yourdomain.com`

### **For Admins:**
- **Admin Panel**: Built into app (admin users only)
- **Database Access**: Supabase Dashboard
- **Analytics**: Vercel/Netlify analytics

### **Updates:**
```bash
# 1. Make changes locally
# 2. Test thoroughly
# 3. Deploy to Vercel: `vercel --prod`
# 4. Update mobile apps via EAS
```

---

## **🎯 Quick Start for Testing**

### **Test Credentials (Hardcoded Auth):**
```
Student: student@test.com / test123
Admin: admin@test.com / admin123
```

### **Local Testing:**
```bash
# 1. Start local server
npm start

# 2. Open in browser
# Press 'w' or go to http://localhost:8081

# 3. Test flow:
# - Login with test credentials
# - Browse tests
# - Take GK test (50 questions)
# - View results
```

### **Production Testing:**
1. Deploy following phases above
2. Test with real Supabase auth
3. Verify 24/7 accessibility
4. Test on multiple devices

---

## **🚀 Ready for Students!**

Your Test Series Platform will be:
- ✅ **24/7 Accessible** via web
- ✅ **Mobile Ready** via Expo
- ✅ **Secure** with Supabase auth
- ✅ **Scalable** for multiple students
- ✅ **Maintainable** with proper deployment

**Start with Phase 1 (Supabase) today!**
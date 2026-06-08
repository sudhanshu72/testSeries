# Test Hardcoded Authentication

## **🎯 Test Credentials**

### **Pre-configured Users:**
```
1. STUDENT ACCOUNT:
   Email: student@test.com
   Password: test123
   Name: Test Student
   Role: student

2. ADMIN ACCOUNT:
   Email: admin@test.com  
   Password: admin123
   Name: Test Admin
   Role: admin
```

### **New User Sign Up:**
You can also sign up with any email/password combination.
The system will accept it but won't store it permanently (hardcoded only).

## **🚀 How to Test**

### **1. Start the App:**
```bash
cd d:\testSeries
npm start
```

### **2. Open in Browser:**
- Press `w` in the terminal
- OR go to: http://localhost:8081

### **3. Test Login Flow:**

#### **Option A: Login as Student**
1. **Email**: `student@test.com`
2. **Password**: `test123`
3. Click **Login**
4. Should see: "Logged in successfully!"
5. Redirects to Dashboard

#### **Option B: Login as Admin**
1. **Email**: `admin@test.com`
2. **Password**: `admin123`
3. Click **Login**
4. Should see: "Logged in successfully!"
5. Dashboard shows "Admin" badge

#### **Option C: Sign Up New User**
1. Click **"New here? Create an account"**
2. Enter:
   - **Name**: Your Name
   - **Email**: any@email.com
   - **Password**: min 6 characters
3. Click **Sign Up**
4. Should see: "Account created and logged in successfully!"

### **4. Test Complete Flow:**
1. **Login** with test credentials
2. **Dashboard** → Click "View Exams"
3. **Test List** → Select "ASSISTANT PROFESSOR (LAW)"
4. **Test Details** → Click "Start Test Now"
5. **Question Screen**:
   - Answer 50 GK questions
   - Use timer (60 minutes)
   - Navigate with Next/Previous
   - Use Review panel
6. **Submit Test** → View results
7. **Results Screen**:
   - See score percentage
   - Review correct/incorrect answers
   - View explanations
   - Share results option

## **🔍 What to Check**

### **Authentication:**
- ✅ Can login with test credentials
- ✅ Can sign up new account
- ✅ Session persists on page refresh
- ✅ Can logout (Dashboard → Logout button)

### **Navigation:**
- ✅ Login → Dashboard
- ✅ Dashboard → Test List
- ✅ Test List → Test Details
- ✅ Test Details → Question Screen
- ✅ Question Screen → Results
- ✅ Results → Dashboard

### **Test Functionality:**
- ✅ 50 GK questions load from `GK.json`
- ✅ Timer counts down from 60 minutes
- ✅ Can select answers
- ✅ Can navigate between questions
- ✅ Review panel works
- ✅ Results calculate correctly
- ✅ Explanations show properly

### **Responsive Design:**
- ✅ Works on desktop browser
- ✅ Works on mobile (test responsive)
- ✅ UI elements scale properly

## **🛠️ Troubleshooting**

### **If login doesn't work:**
1. Check browser console for errors (F12)
2. Check terminal where `npm start` is running
3. Verify server is running: Should see "Web is waiting on http://localhost:8081"

### **If questions don't load:**
1. Check `data/GK.json` exists
2. Check file path in `QuestionScreen.js`
3. Verify JSON format is valid

### **If app crashes:**
1. Clear cache: `npx expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Restart server

## **📊 Expected Results**

### **Login Success:**
- Alert: "Logged in successfully!"
- Redirect to Dashboard
- Welcome message with your name/email
- Role badge (Student/Admin)

### **Test Completion:**
- Score calculated (0-100%)
- Correct/incorrect breakdown
- Question-by-question review
- Explanations for each question

### **Admin Features:**
- Admin badge on Dashboard
- Admin card visible (if logged in as admin)

## **🎯 Next Steps After Testing**

### **If everything works:**
1. **Deploy Supabase** (Phase 1 from DEPLOYMENT_GUIDE.md)
2. **Deploy Frontend** to Vercel/Netlify (Phase 2)
3. **Switch to real Supabase auth** (Phase 3)

### **If issues found:**
1. Note the specific problem
2. Check relevant code files
3. Fix and retest

## **✅ Test Checklist**

- [ ] Login with student@test.com / test123
- [ ] Login with admin@test.com / admin123
- [ ] Sign up new account
- [ ] Navigate to Test List
- [ ] Start GK test
- [ ] Answer at least 5 questions
- [ ] Submit test
- [ ] View results with explanations
- [ ] Logout and login again
- [ ] Test on page refresh (session persists)

---

## **🚀 Ready for Deployment!**

Once all tests pass, your app is ready for:
1. **Database deployment** to Supabase
2. **Frontend hosting** on Vercel/Netlify
3. **24/7 student access**

**Start testing now with the credentials above!**
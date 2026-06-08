# How to Use the Test Series App

## 🚀 Quick Start

### 1. Start the Development Server
```bash
cd d:\testSeries
npm start
```

### 2. Open the App

**Option A: Web Browser (Easiest)**
- Press `w` in the terminal where `npm start` is running
- Browser will open at http://localhost:8081

**Option B: Mobile Device (Expo Go)**
1. Install Expo Go app on your phone:
   - iOS: App Store
   - Android: Play Store
2. Scan the QR code shown in your terminal
3. App will load on your phone

## 📱 App Features Now Available

### ✅ **Authentication System**
- Login with email/password
- Sign up for new accounts
- Forgot password functionality
- Email verification
- Secure session management

### ✅ **Test Platform**
1. **Dashboard** - Main landing page after login
2. **Test List** - Browse available test series
   - Assistant Professor (Law) Mock Test 1 (from your GK.json)
   - MPPSC Prelims Mock Test
   - Current Affairs Weekly Test
   - History - Ancient India Test
3. **Test Details** - View test information and instructions
4. **Question Screen** - Take the actual test
   - Timer (60 minutes)
   - 50 GK questions from your data file
   - Question navigation (Next/Previous)
   - Review panel to jump to any question
   - Option selection with visual feedback
5. **Results Screen** - View your performance
   - Score percentage
   - Correct/incorrect answers
   - Question-by-question review
   - Detailed explanations
   - Share results option

### ✅ **Data Integration**
- Your `GK.json` file with 50 questions is fully integrated
- Questions include options, correct answers, and explanations
- Citation tags (`[cite: X]`) are automatically removed for display

## 🔧 Navigation Flow

1. **Login/Sign Up** → **Dashboard**
2. **Dashboard** → **Test List** (click "View Exams")
3. **Test List** → **Test Detail** (click any test)
4. **Test Detail** → **Question Screen** (click "Start Test Now")
5. **Question Screen** → **Results Screen** (after submission)

## 🎯 Testing the GK Questions

To test the complete flow with your GK data:

1. **Login** to the app (create an account if needed)
2. Go to **Dashboard** → **View Exams**
3. Select **"ASSISTANT PROFESSOR (LAW) - MOCK TEST 1"**
4. Click **"Start Test Now"**
5. **Answer the 50 GK questions** (timer: 60 minutes)
6. **Submit** the test when done
7. **View your results** with detailed explanations

## 📊 Data Structure

Your `GK.json` file contains:
- `exam_title`: Test name
- `section`: Category (General Studies)
- `questions`: Array of 50 questions, each with:
  - `question_number`: Sequential number
  - `question`: The question text (citations removed in app)
  - `options`: Object with A, B, C, D options (citations removed)
  - `correct_answer`: Correct option key
  - `explanation`: Detailed answer explanation

## 🛠️ Development Notes

### Current Tech Stack
- **Frontend**: React Native with Expo
- **Navigation**: React Navigation 6
- **Authentication**: Supabase (pre-configured)
- **State Management**: React Context + Hooks
- **Data**: Local JSON file (GK.json)

### Files Created
```
src/screens/
├── TestListScreen.js      # Browse available tests
├── TestDetailScreen.js    # Test details and instructions
├── QuestionScreen.js      # Take the test (loads GK.json)
└── ResultScreen.js        # View results and explanations
```

### Environment Variables
Make sure `.env` file has:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚨 Troubleshooting

### If app doesn't start:
```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### If you see "Port already in use":
```bash
npx kill-port 8081
npm start
```

### If GK.json doesn't load:
- Check file path: `data/GK.json` should exist
- File should be valid JSON format
- Check console for import errors

## 📈 Next Steps (Optional Enhancements)

1. **Supabase Database Integration**
   - Store test results
   - User progress tracking
   - Leaderboards

2. **More Test Categories**
   - Add more JSON files for different subjects
   - Create test management system

3. **Advanced Features**
   - Test timers with pause/resume
   - Bookmark questions
   - Test analytics and insights
   - Offline mode

4. **Admin Panel**
   - Create/edit tests
   - Manage questions
   - View user analytics

## 🎉 Ready to Go!

Your Test Series app is now fully functional with:
- ✅ User authentication
- ✅ Complete test-taking flow
- ✅ Your 50 GK questions integrated
- ✅ Results and explanations
- ✅ Responsive design (web + mobile)

**Start the app with `npm start` and begin testing!**
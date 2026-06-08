# Setup Guide - Test Series Platform

## ✅ Completed Setup Steps

1. ✅ Expo project initialized
2. ✅ Supabase client configured with your credentials
3. ✅ All dependencies installed
4. ✅ Folder structure created (src/screens, src/components, src/lib)
5. ✅ LoginScreen created with authentication
6. ✅ DashboardScreen created with user interface
7. ✅ Navigation configured in App.js

## 🚀 Running the Application

### Start the Development Server

```bash
npm start
```

This will start the Expo development server and show you a QR code.

### Run on Different Platforms

**Web:**
```bash
npm run web
```
Press `w` in the terminal after running `npm start`

**Android:**
```bash
npm run android
```
Press `a` in the terminal after running `npm start`
(Requires Android Studio and emulator or physical device)

**iOS:**
```bash
npm run ios
```
Press `i` in the terminal after running `npm start`
(Requires macOS with Xcode)

## 📱 Testing the App

### Using Expo Go (Mobile)

1. Install Expo Go app on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Run `npm start`
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

### Using Web Browser

1. Run `npm run web`
2. Browser will open automatically at http://localhost:8081

## 🔐 Supabase Configuration

Your Supabase credentials are already configured in `src/lib/supabase.js`:
- URL: https://rqoppoeunupscsdsrbkb.supabase.co
- Anon Key: Configured ✅

### Setting up Supabase Database (Next Steps)

You'll need to create tables in your Supabase dashboard:

1. Go to https://rqoppoeunupscsdsrbkb.supabase.co
2. Navigate to Table Editor
3. Create tables for:
   - `test_series` - Store test information
   - `questions` - Store questions
   - `user_responses` - Store user answers
   - `results` - Store test results

## 📂 Project Structure

```
testSeries/
├── App.js                      # Main entry point with navigation
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── src/
│   ├── lib/
│   │   └── supabase.js        # Supabase client (configured)
│   ├── screens/
│   │   ├── LoginScreen.js     # Login/Sign up screen
│   │   └── DashboardScreen.js # Main dashboard
│   └── components/            # Reusable components (empty for now)
└── node_modules/              # Installed packages
```

## 🎯 Current Features

### LoginScreen
- Email/password login
- User registration
- Form validation
- Error handling
- Loading states

### DashboardScreen
- User welcome message
- Test series cards (placeholders)
- Progress tracking (placeholder)
- Results viewing (placeholder)
- Profile management (placeholder)
- Logout functionality

## 🔧 Next Development Steps

1. **Create Supabase Tables**
   - Design database schema
   - Set up Row Level Security (RLS) policies

2. **Add More Screens**
   - TestListScreen - Browse available tests
   - TestDetailScreen - View test details
   - QuestionScreen - Take the test
   - ResultScreen - View results

3. **Create Reusable Components**
   - Custom buttons
   - Input fields
   - Cards
   - Loading indicators

4. **Implement Core Features**
   - Fetch test series from Supabase
   - Submit answers
   - Calculate scores
   - Store results

## 🐛 Troubleshooting

### Port Already in Use
If you see "Port 8081 already in use":
```bash
npx kill-port 8081
npm start
```

### Clear Cache
If you encounter issues:
```bash
npx expo start -c
```

### Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)

## 🎉 You're All Set!

Run `npm start` to begin development!

# Test Series Platform

A React Native (Expo) application for managing and taking test series, powered by Supabase.

## Features

- 🔐 User Authentication (Login/Sign Up)
- 📊 Dashboard with test series overview
- 📱 Cross-platform support (iOS, Android, Web)
- 🔒 Secure session management with Supabase

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Authentication, Database)
- **Navigation**: React Navigation
- **Storage**: Expo Secure Store

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For Web
```

## Project Structure

```
testSeries/
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Screen components
│   │   ├── LoginScreen.js
│   │   └── DashboardScreen.js
│   └── lib/
│       └── supabase.js # Supabase client configuration
├── App.js              # Main app entry point
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## Supabase Configuration

The app is configured to use Supabase for:
- User authentication (email/password)
- Session management
- Secure token storage

## Available Screens

### Login Screen
- Email/password authentication
- Sign up functionality
- Form validation

### Dashboard Screen
- User welcome message
- Test series overview cards
- Progress tracking
- Results viewing
- Profile management
- Logout functionality

## Development

To add new features:

1. Create new screens in `src/screens/`
2. Create reusable components in `src/components/`
3. Update navigation in `App.js`
4. Configure Supabase tables and policies as needed

## License

Private - All rights reserved

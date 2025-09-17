# Firebase Authentication Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `character-studio-react`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click **Google** provider
5. Toggle **Enable**
6. Set **Project support email** to your email
7. Click **Save**

## 3. Create Web App

1. In Firebase Console, click the **Web** icon (`</>`)
2. Enter app nickname: `character-studio-web`
3. Check **Also set up Firebase Hosting** (optional)
4. Click **Register app**
5. Copy the Firebase configuration object

## 4. Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Add your Firebase configuration to `.env`:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_firebase_app_id_here
   ```

## 5. Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click **Done**

## 6. Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can read/write their own profile
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Generation records - users can read/write their own records
    match /generation_records/{recordId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Click the hamburger menu (☰) in the top-right
4. Click **Sign In** → **Continue with Google**
5. Complete the Google sign-in flow
6. Verify you can see your profile in the menu

## 8. Production Considerations

### Security Rules
- Update Firestore rules for production
- Consider implementing role-based access control
- Add rate limiting for API calls

### Authentication
- Configure authorized domains in Firebase Console
- Set up custom domain for production
- Consider adding additional providers (email/password, etc.)

### Database
- Set up proper indexes for queries
- Implement data validation
- Consider backup strategies

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - Go to Authentication → Settings → Authorized domains

2. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure user is authenticated before accessing data

3. **Environment variables not loading**
   - Restart the development server after adding `.env`
   - Ensure all variables start with `VITE_`

### Debug Mode
Enable Firebase debug mode by adding to your browser console:
```javascript
localStorage.setItem('firebase:debug', '*');
```

## Next Steps

1. **User Management**: Implement user profile editing
2. **Usage Tracking**: Connect usage data to Firebase
3. **Subscription Management**: Integrate with payment provider
4. **Data Export**: Allow users to export their character data
5. **Analytics**: Add Firebase Analytics for user behavior tracking

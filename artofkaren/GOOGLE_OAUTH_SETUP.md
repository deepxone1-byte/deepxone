# Google OAuth Setup Instructions

To enable Google Sign In, you need to create OAuth credentials in the Google Cloud Console.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

## Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Configure the OAuth consent screen if prompted

## Step 3: Configure Authorized Redirect URIs

Add these redirect URIs:
- `http://localhost:4002/api/auth/google/callback`
- `http://192.168.2.241:4002/api/auth/google/callback`
- `http://artofkaren.com/api/auth/google/callback`

- Add your production URL when deploying

## Step 4: Copy Credentials

After creating the OAuth client:
1. Copy the **Client ID**
2. Copy the **Client Secret**

## Step 5: Update Environment Variables

### Backend (.env)
```env
GOOGLE_CLIENT_ID=1033155511628-vvb7epcndujei2opui2b41it8js0cf90.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://artofkaren.com/api/auth/google/callback
```

### Frontend (frontend/.env)
```env
VITE_GOOGLE_CLIENT_ID=1033155511628-vvb7epcndujei2opui2b41it8js0cf90.apps.googleusercontent.com
```

## Step 6: Restart Servers

After updating the environment variables:
```bash
# Restart backend (will automatically restart if using nodemon)
# Restart frontend
cd frontend
npm run dev
```

## Testing

1. Go to http://artofkaren.com/login
2. Click "Sign in with Google"
3. Complete the Google authentication flow
4. You should be redirected back to the dashboard

## Troubleshooting

- **Error: redirect_uri_mismatch** - Make sure the redirect URI in Google Console exactly matches the callback URL
- **OAuth not configured** - Check that the credentials are properly set in the .env files
- **Authentication failed** - Check the browser console and server logs for detailed error messages

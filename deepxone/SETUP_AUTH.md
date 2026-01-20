# Setting Up Authentication & Database

Complete guide to enable Google Auth and email capture for DeepXone.

---

## Prerequisites

- MySQL 8.0+ installed
- Google Cloud account (free)
- Node.js 18+ (already have)

---

## Step 1: Set Up MySQL Database (5 minutes)

### Install MySQL (if not already installed):

**Windows:**
```bash
# Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
# OR use Chocolatey:
choco install mysql

# Start MySQL service:
net start MySQL80
```

**Check if MySQL is running:**
```bash
mysql --version
# Should show: mysql  Ver 8.0.x
```

### Create Database:

```bash
# Login to MySQL:
mysql -u root -p

# Create database:
CREATE DATABASE deepxone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify:
SHOW DATABASES;
# Should see 'deepxone' in the list

# Exit:
exit
```

### Run Schema:

```bash
cd deepxone
mysql -u root -p deepxone < database/schema.sql
```

**Verify tables created:**
```bash
mysql -u root -p deepxone
SHOW TABLES;
# Should see: users, user_sessions, user_scenarios, decision_history

# Check users table structure:
DESCRIBE users;

exit
```

---

## Step 2: Generate NextAuth Secret (1 minute)

```bash
# Generate random secret:
openssl rand -base64 32
```

Copy the output (looks like: `Xj9k2mP8vQ...`)

---

## Step 3: Set Up Google OAuth (5 minutes)

### Create Google Cloud Project:

1. Go to: https://console.cloud.google.com/
2. Click **"Select a project"** → **"New Project"**
3. Name: **DeepXone Decisions**
4. Click **Create**

### Enable Google+ API:

1. In sidebar: **APIs & Services** → **Library**
2. Search: **"Google+ API"**
3. Click → **Enable**

### Create OAuth Credentials:

1. **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **OAuth client ID**
3. If prompted, configure consent screen:
   - User Type: **External**
   - App name: **DeepXone Decisions**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue** (skip scopes)
   - Add test users: Your email
   - Click **Save and Continue**

4. Create OAuth Client:
   - Application type: **Web application**
   - Name: **DeepXone Web Client**
   - Authorized JavaScript origins:
     - `http://192.168.2.241:6001`
     - `http://localhost:6001`
   - Authorized redirect URIs:
     - `http://192.168.2.241:6001/api/auth/callback/google`
     - `http://localhost:6001/api/auth/callback/google`
   - Click **Create**

5. **Copy the credentials:**
   - Client ID: `123456789-abc...apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abc...`

---

## Step 4: Update Environment Variables

Edit `deepxone/.env.local`:

```bash
# Database Configuration (update these)
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=deepxone
DATABASE_USER=root
DATABASE_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD

# NextAuth Configuration (update these)
NEXTAUTH_URL=http://192.168.2.241:6001
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_FROM_STEP_2

# Google OAuth Configuration (update these)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

**Save the file!**

---

## Step 5: Install New Dependencies

```bash
cd deepxone
npm install
```

This installs:
- `next-auth` - Authentication for Next.js
- `mysql2` - MySQL driver
- `bcrypt` - Password hashing (for email-only auth later)

---

## Step 6: Test Database Connection

```bash
# Test MySQL connection:
mysql -u root -p -h localhost deepxone -e "SELECT 1 as health;"

# Should output:
# +--------+
# | health |
# +--------+
# |      1 |
# +--------+
```

---

## Step 7: Restart Dev Server

The server should auto-reload, but if not:

```bash
# Kill existing server (Ctrl+C if running)
# Restart:
npm run dev
```

---

## Step 8: Test Authentication Flow

1. Open: **http://192.168.2.241:6001**
2. Create a custom scenario (this one is FREE)
3. Try to create a 2nd custom scenario
4. Modal should appear with:
   - Email input field
   - "Sign in with Google" button
5. Click **"Sign in with Google"**
6. Should redirect to Google login
7. After auth, redirects back to app
8. Check database:

```bash
mysql -u root -p deepxone
SELECT * FROM users;
# Should see your user record!

SELECT * FROM user_sessions;
# Should see your active session!

exit
```

---

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check MySQL password in .env.local
- Reset MySQL password if needed:
  ```bash
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
  ```

### "Unknown database 'deepxone'"
- Database wasn't created. Run:
  ```bash
  mysql -u root -p
  CREATE DATABASE deepxone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

### "Google OAuth redirect_uri_mismatch"
- Check authorized redirect URIs in Google Console
- Must match EXACTLY: `http://192.168.2.241:6001/api/auth/callback/google`
- No trailing slash!

### "NEXTAUTH_SECRET is not set"
- Generate one: `openssl rand -base64 32`
- Add to .env.local

### Tables don't exist
- Run schema: `mysql -u root -p deepxone < database/schema.sql`

### Can't connect to MySQL
- Check if MySQL is running:
  ```bash
  # Windows:
  net start MySQL80

  # Or check services:
  services.msc
  # Look for MySQL80, ensure it's "Running"
  ```

---

## What Happens After Setup?

### User Flow:
1. ✅ User tries 1st custom scenario → Works (no gate)
2. 🔒 User tries 2nd custom scenario → Auth modal appears
3. User chooses:
   - Option A: Enter email (simple capture)
   - Option B: Sign in with Google (full account)
4. ✅ Unlocks unlimited custom scenarios
5. 💾 Custom scenarios saved to their account
6. 📊 Decision history tracked

### Database Records Created:
- `users` table: email, name, google_id, avatar_url
- `user_sessions` table: 7-day session cookie
- `user_scenarios` table: saved custom scenarios
- `decision_history` table: all AI decisions (analytics)

### For You (Business Owner):
- 📧 Collect emails for follow-up
- 👤 User accounts for personalization
- 📈 Track which scenarios people test
- 🎯 See which decision modes they prefer
- 💰 Build prospect list

---

## Security Notes

- ✅ Passwords never stored (Google OAuth)
- ✅ Session cookies: HttpOnly, 7-day expiration
- ✅ Database: Parameterized queries (SQL injection safe)
- ✅ Google OAuth: Industry-standard security
- ✅ HTTPS in production (not local dev)

---

## Production Deployment (Later)

When deploying to production (Vercel, etc.):

1. Use **Planetscale** or **AWS RDS** for MySQL
2. Update `NEXTAUTH_URL` to production domain
3. Update Google OAuth redirect URIs
4. Enable HTTPS
5. Set secure cookies

---

## Need Help?

Common issues and solutions documented above. If stuck:
1. Check browser console for errors
2. Check Next.js terminal output
3. Check MySQL logs
4. Verify .env.local values

---

**Setup complete! Now you can capture leads and build user accounts.** 🎉

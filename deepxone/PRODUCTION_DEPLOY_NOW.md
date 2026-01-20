# DeepXone Production Deployment - Step by Step

## 🚀 Deploy to Linux Server

Follow these commands in order based on your deployment method.

---

## Deployment Method 1: Shared Folder (VirtualBox)

### On Windows Machine

```powershell
# Copy to shared folder
.\copy-to-shared.ps1
```

### On Ubuntu (VirtualBox Guest)

```bash
# Sync from shared folder
cd /media/sf_prodrelease
sudo bash sync-from-shared.sh
```

---

## Deployment Method 2: Direct SSH/SCP

### On Windows Machine

```powershell
# Upload to Linux server (replace with your server IP)
scp -r D:\deepxone\deepxone user@192.168.2.xx:/home/user/
```

### On Linux Server

```bash
# SSH into server
ssh user@192.168.2.xx

# Navigate to app directory
cd /home/user/deepxone

# Continue with deployment steps below
```

---

## Deployment Method 3: Git Pull (Recommended)

### Prerequisites

1. Code must be committed and pushed to GitHub
2. Linux server must have git installed
3. SSH keys configured for GitHub access

### On Linux Server

```bash
# SSH into server
ssh user@192.168.2.xx

# Navigate to deployment location
cd /var/www  # or /home/user

# Clone repository (first time only)
git clone https://github.com/deepxone1-byte/deepxone.git
cd deepxone/deepxone

# Or if already cloned, pull latest changes
cd /var/www/deepxone/deepxone
git pull origin main

# Continue with deployment steps below
```

---

## Post-Transfer Deployment Steps

Run these commands on your Linux server after files are transferred.

### Step 1: Backup Database (IMPORTANT!)

```bash
# Create backup directory
mkdir -p backups

# Backup current database
mysqldump -u deepxone -p deepxone > backups/deepxone_$(date +%Y%m%d_%H%M%S).sql

# Verify backup created
ls -lh backups/ | tail -1
```

---

### Step 2: Install Dependencies

```bash
# Install Node modules
npm install

# This may take a few minutes...
```

---

### Step 3: Update Environment Variables

```bash
# Edit .env.local
nano .env.local
```

**Important production settings:**

```env
# AI Provider
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
AI_PROVIDER=openai

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=deepxone
DATABASE_USER=deepxone
DATABASE_PASSWORD=your_secure_password_here

# NextAuth (IMPORTANT: Update URL to production)
NEXTAUTH_URL=http://192.168.2.xx:6001
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Google OAuth (Update callback for production)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Generate new NextAuth secret:**

```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET
```

Save and exit: `Ctrl+X`, `Y`, `Enter`

---

### Step 4: Set Up MySQL Database (First Time Only)

```bash
# Login to MySQL
sudo mysql -u root -p

# In MySQL prompt:
CREATE DATABASE IF NOT EXISTS deepxone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'deepxone'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON deepxone.* TO 'deepxone'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Load schema
mysql -u deepxone -p deepxone < database/schema.sql

# Verify tables created
mysql -u deepxone -p deepxone -e "SHOW TABLES;"
```

Expected tables:
- users
- user_sessions
- user_scenarios
- decision_history

---

### Step 5: Build for Production

```bash
# Build Next.js application
npm run build

# This compiles TypeScript and optimizes assets
```

---

### Step 6: Update Google OAuth Redirect URIs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   http://192.168.2.xx:6001/api/auth/callback/google
   ```
   Replace `192.168.2.xx` with your actual server IP

4. Add to **Authorized JavaScript origins**:
   ```
   http://192.168.2.xx:6001
   ```

5. Click Save

---

### Step 7: Restart Application

#### Option A: Using PM2 (Recommended)

```bash
# If already running
pm2 restart deepxone

# Or start fresh
pm2 start npm --name "deepxone" -- start
pm2 save

# Setup auto-start on boot (first time only)
pm2 startup
# Copy and run the command it shows
```

#### Option B: Using the deploy script

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

#### Option C: Manual restart

```bash
# Kill existing process
lsof -ti:6001 | xargs kill -9

# Start in background
nohup npm start > logs/server.log 2>&1 &
```

---

### Step 8: Verify Deployment

```bash
# Check PM2 status
pm2 status deepxone

# View recent logs
pm2 logs deepxone --lines 50

# Test health endpoint
curl http://localhost:6001

# Test from network
curl http://192.168.2.xx:6001
```

**Open in browser:**
```
http://192.168.2.xx:6001
```

Replace `192.168.2.xx` with your actual server IP.

---

## Quick Update (After Initial Setup)

For subsequent deployments:

```bash
# Navigate to app directory
cd /var/www/deepxone/deepxone  # or wherever deployed

# Pull latest code (if using git)
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart
pm2 restart deepxone

# Check status
pm2 status deepxone
pm2 logs deepxone --lines 20
```

---

## Troubleshooting

### Server won't start

```bash
# Check logs
pm2 logs deepxone --err

# Check for port conflicts
lsof -i :6001

# Check if Next.js build succeeded
ls -la .next/
```

### Database connection errors

```bash
# Test MySQL connection
mysql -u deepxone -p deepxone

# Check if MySQL is running
sudo systemctl status mysql

# Verify credentials in .env.local
cat .env.local | grep DATABASE
```

### npm install fails

```bash
# Fix permissions
sudo chown -R $USER:$USER ~/deepxone
sudo chown -R $USER:$USER ~/.npm

# Clear cache and retry
npm cache clean --force
npm install
```

### Cannot access from browser

```bash
# Check firewall
sudo ufw status
sudo ufw allow 6001/tcp

# Check if app is running
pm2 status
curl http://localhost:6001

# Check Next.js is listening on correct interface
netstat -tlnp | grep 6001
```

### Build errors

```bash
# Delete build artifacts and rebuild
rm -rf .next
npm run build

# Check for missing environment variables
cat .env.local
```

---

## Rollback (If Something Goes Wrong)

```bash
# Restore database from backup
mysql -u deepxone -p deepxone < backups/deepxone_YYYYMMDD_HHMMSS.sql

# Revert to previous git commit (if using git)
git log --oneline -5
git reset --hard <previous-commit-hash>
npm install
npm run build
pm2 restart deepxone
```

---

## Production Checklist

Before going live:

- [ ] Database backed up
- [ ] .env.local configured with production values
- [ ] NEXTAUTH_URL set to production URL
- [ ] NEXTAUTH_SECRET generated (32+ random characters)
- [ ] Google OAuth redirect URIs updated
- [ ] Database schema loaded
- [ ] npm install completed
- [ ] npm run build completed without errors
- [ ] PM2 running the application
- [ ] Application accessible from browser
- [ ] Firewall configured (allow port 6001)
- [ ] SSL certificate installed (if using domain/HTTPS)

---

## Monitoring

### View Live Logs

```bash
# Follow logs in real-time
pm2 logs deepxone -f

# Last 100 lines
pm2 logs deepxone --lines 100

# Only errors
pm2 logs deepxone --err
```

### Check Resource Usage

```bash
# PM2 monitoring dashboard
pm2 monit

# System resources
htop

# Disk usage
df -h

# Memory usage
free -h
```

### Database Backup Schedule

```bash
# Create cron job for daily backups
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * mysqldump -u deepxone -pyour_password deepxone > /home/user/backups/deepxone_$(date +\%Y\%m\%d).sql
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start app | `pm2 start deepxone` |
| Stop app | `pm2 stop deepxone` |
| Restart app | `pm2 restart deepxone` |
| View logs | `pm2 logs deepxone` |
| Check status | `pm2 status` |
| Backup DB | `mysqldump -u deepxone -p deepxone > backup.sql` |
| Test app | `curl http://localhost:6001` |
| Update & deploy | `git pull && npm i && npm run build && pm2 restart deepxone` |

---

## Support Resources

- **Database Setup**: See `database/schema.sql`
- **Environment Config**: See `.env.example`
- **Full Linux Guide**: See `DEPLOY_LINUX.md`
- **Auth Setup**: See `SETUP_AUTH.md`
- **AI Setup**: See `AI_SETUP.md`

---

**DeepXone Decisions™** - Production deployment ready! 🎉

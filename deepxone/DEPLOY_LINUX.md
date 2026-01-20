# Deploy DeepXone to Linux Server

Complete guide to deploy DeepXone Decisions on a Linux server.

---

## Prerequisites on Linux Server

- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- Node.js 18+
- MySQL 8.0+
- Nginx (for reverse proxy)
- Git

---

## Step 1: Install Dependencies

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v18+
npm --version
```

### Install MySQL 8.0
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

---

## Step 2: Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www
cd /var/www

# Clone repo (replace with your actual repo URL)
sudo git clone https://github.com/deepxone1-byte/deepxone.git
cd deepxone/deepxone

# Set ownership
sudo chown -R $USER:$USER /var/www/deepxone
```

---

## Step 3: Set Up MySQL Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE deepxone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create dedicated user
CREATE USER 'deepxone'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON deepxone.* TO 'deepxone'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;

# Run schema
mysql -u deepxone -p deepxone < database/schema.sql
```

**Verify tables created:**
```bash
mysql -u deepxone -p deepxone -e "SHOW TABLES;"
# Should show: users, user_sessions, user_scenarios, decision_history
```

---

## Step 4: Configure Environment Variables

```bash
cd /var/www/deepxone/deepxone

# Create production .env.local
nano .env.local
```

**Add this configuration:**
```bash
# AI Provider Configuration
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4-turbo-preview
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=deepxone
DATABASE_USER=deepxone
DATABASE_PASSWORD=your_secure_password_here

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET
```

**Save and exit:** `Ctrl+X`, `Y`, `Enter`

---

## Step 5: Install Node Modules

```bash
cd /var/www/deepxone/deepxone
npm install
```

---

## Step 6: Build for Production

```bash
npm run build
```

**This will:**
- Compile TypeScript
- Bundle assets
- Optimize for production
- Create `.next` directory

---

## Step 7: Set Up PM2 Process Manager

```bash
# Start the app with PM2
pm2 start npm --name "deepxone" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Copy and run the command it outputs
```

**PM2 Commands:**
```bash
pm2 status           # Check status
pm2 logs deepxone    # View logs
pm2 restart deepxone # Restart app
pm2 stop deepxone    # Stop app
pm2 delete deepxone  # Remove from PM2
```

---

## Step 8: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/deepxone
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:6001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/deepxone /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## Step 9: Set Up SSL with Let's Encrypt (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)
```

**Auto-renewal (already set up by Certbot):**
```bash
sudo certbot renew --dry-run  # Test renewal
```

---

## Step 10: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## Step 11: Update Google OAuth Redirect URIs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth client
3. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
   - `https://www.yourdomain.com/api/auth/callback/google`
4. Save

---

## Step 12: Test Deployment

```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs deepxone

# Test locally
curl http://localhost:6001

# Test via domain
curl https://yourdomain.com
```

**Open in browser:**
- https://yourdomain.com

---

## Deployment Checklist

- [x] Node.js 18+ installed
- [x] MySQL 8.0+ installed and secured
- [x] Database created and schema loaded
- [x] Repository cloned
- [x] Dependencies installed (`npm install`)
- [x] `.env.local` configured with production values
- [x] App built (`npm run build`)
- [x] PM2 running the app
- [x] Nginx configured as reverse proxy
- [x] SSL certificate installed (HTTPS)
- [x] Firewall configured
- [x] Google OAuth redirect URIs updated
- [x] DNS pointing to server IP

---

## Monitoring & Maintenance

### View Logs
```bash
pm2 logs deepxone        # Live logs
pm2 logs deepxone --lines 100  # Last 100 lines
tail -f /var/log/nginx/access.log  # Nginx access logs
tail -f /var/log/nginx/error.log   # Nginx error logs
```

### Restart Application
```bash
pm2 restart deepxone
```

### Update Code from Git
```bash
cd /var/www/deepxone/deepxone
git pull origin main
npm install  # Install any new dependencies
npm run build  # Rebuild
pm2 restart deepxone
```

### Database Backup
```bash
# Backup database
mysqldump -u deepxone -p deepxone > backup-$(date +%Y%m%d).sql

# Restore from backup
mysql -u deepxone -p deepxone < backup-20260120.sql
```

### Monitor Resource Usage
```bash
pm2 monit        # PM2 monitor
htop             # System resources
df -h            # Disk usage
free -h          # Memory usage
```

---

## Performance Optimization

### Enable PM2 Cluster Mode
```bash
# Stop current instance
pm2 delete deepxone

# Start in cluster mode (uses all CPU cores)
pm2 start npm --name "deepxone" -i max -- start
pm2 save
```

### Nginx Caching
Add to Nginx config:
```nginx
# Cache static assets
location /_next/static/ {
    proxy_pass http://localhost:6001;
    proxy_cache_valid 200 60m;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization
```bash
mysql -u root -p
```
```sql
-- Add indexes if needed
USE deepxone;
SHOW INDEX FROM decision_history;

-- Optimize tables
OPTIMIZE TABLE users, user_sessions, user_scenarios, decision_history;
```

---

## Troubleshooting

### App Won't Start
```bash
pm2 logs deepxone --err  # Check error logs
pm2 describe deepxone    # Get detailed info
```

**Common issues:**
- Port 6001 already in use: `sudo lsof -i :6001`
- Database connection: Check `.env.local` credentials
- Build errors: Delete `.next` and rebuild

### Nginx 502 Bad Gateway
```bash
sudo nginx -t                    # Test config
sudo systemctl status nginx      # Check status
pm2 status                       # Check if app is running
curl http://localhost:6001       # Test app directly
```

### Database Connection Errors
```bash
# Test MySQL connection
mysql -u deepxone -p -h localhost deepxone

# Check if MySQL is running
sudo systemctl status mysql

# Check firewall
sudo ufw status
```

### SSL Certificate Issues
```bash
sudo certbot certificates  # List certificates
sudo certbot renew        # Renew manually
```

---

## Security Hardening

### Disable Root Login (SSH)
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### Fail2Ban (Prevent Brute Force)
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Auto-Updates
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### MySQL Security
```sql
-- Remove test database
DROP DATABASE IF EXISTS test;

-- Review users
SELECT user, host FROM mysql.user;

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';
FLUSH PRIVILEGES;
```

---

## Production URLs

After deployment, your app will be available at:

- **Production:** https://yourdomain.com
- **Google OAuth Callback:** https://yourdomain.com/api/auth/callback/google
- **Health Check:** https://yourdomain.com (check status)

---

## Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying DeepXone Decisions..."

cd /var/www/deepxone/deepxone

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart deepxone

echo "✅ Deployment complete!"
pm2 status
```

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Support

**Logs Location:**
- App: `pm2 logs deepxone`
- Nginx: `/var/log/nginx/`
- MySQL: `/var/log/mysql/`

**Docs:**
- Next.js: https://nextjs.org/docs
- PM2: https://pm2.keymetrics.io/docs/
- Nginx: https://nginx.org/en/docs/

---

**DeepXone Decisions™** - Production deployment complete! 🎉

# iUtility System Configuration Guide

This document provides comprehensive configuration setup for the unified iUtility system, including backend, admin system, and client portal configurations.

## 📋 Table of Contents

1. [Backend Configuration](#backend-configuration)
2. [Admin System Configuration](#admin-system-configuration)
3. [Client Portal Configuration](#client-portal-configuration)
4. [Development Setup](#development-setup)
5. [Production Deployment](#production-deployment)
6. [Environment Variables Reference](#environment-variables-reference)

## 🔧 Backend Configuration

### Environment Setup

1. **Copy the environment template:**

   ```bash
   cd iutility/backend
   cp env.example .env
   ```

2. **Configure database settings:**

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=iutility
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

3. **Set JWT secrets:**

   ```env
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   ```

4. **Configure email service:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM_EMAIL=noreply@iutility.com
   ```

### Provider Configuration

#### GamSwitch (Airtime & Cashpower)

```env
GAMSWITCH_BASE_URL=https://test.gamswitchgm.com
GAMSWITCH_INTERCHANGE=gswlive
GAMSWITCH_USERNAME=your_gamswitch_username
GAMSWITCH_PASSWORD=your_gamswitch_password
GAMSWITCH_HASH_KEY=your_gamswitch_hash_key
GAMSWITCH_SECURITY_KEY=your_gamswitch_security_key
```

#### NAWEC (Cashpower Only)

```env
NAWEC_URL=https://api.nawec.gm
NAWEC_USERNAME=your_nawec_username
NAWEC_PASSWORD=your_nawec_password
NAWEC_GRANT_TYPE=password
NAWEC_SCOPE=read write
NAWEC_BASIC_TOKEN=your_nawec_basic_token
NAWEC_CONTENT_TYPE=application/x-www-form-urlencoded
NAWEC_ORIGIN=https://nawec.gm
NAWEC_ENV=production
NAWEC_API_VERSION=v1
```

#### Cashpower Provider Selection

```env
DEFAULT_CASHPOWER_PROVIDER=gamswitch
# Options: gamswitch, nawec
```

### Balance Monitoring

```env
BALANCE_CRITICAL_THRESHOLD=100
BALANCE_WARNING_THRESHOLD=500
BALANCE_LOW_THRESHOLD=1000
SYSTEM_NOTIFICATION_EMAILS=admin@iutility.com,alerts@iutility.com
```

## 🖥️ Admin System Configuration

### Environment Setup

1. **Copy the environment template:**

   ```bash
   cd iutility/admin-system
   cp env.example .env
   ```

2. **Configure API endpoint:**

   ```env
   VITE_API_BASE_URL=http://localhost:9000/api/v1
   ```

3. **Set authentication keys:**

   ```env
   VITE_JWT_STORAGE_KEY=iutility_admin_token
   VITE_REFRESH_TOKEN_KEY=iutility_admin_refresh_token
   ```

4. **Configure development server:**
   ```env
   VITE_DEV_SERVER_PORT=3001
   VITE_DEV_SERVER_HOST=localhost
   ```

### Feature Flags

```env
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_DEVELOPER_TOOLS=true
```

## 📱 Client Portal Configuration

### Environment Setup

1. **Copy the environment template:**

   ```bash
   cd iutility/client-portal
   cp env.example .env
   ```

2. **Configure API endpoint:**

   ```env
   VITE_API_BASE_URL=http://localhost:9000/api/v1
   ```

3. **Set authentication keys:**

   ```env
   VITE_JWT_STORAGE_KEY=iutility_client_token
   VITE_REFRESH_TOKEN_KEY=iutility_client_refresh_token
   ```

4. **Configure development server:**
   ```env
   VITE_DEV_SERVER_PORT=3000
   VITE_DEV_SERVER_HOST=localhost
   ```

### Service Configuration

```env
VITE_ENABLE_AIRTIME_SERVICE=true
VITE_ENABLE_CASHPOWER_SERVICE=true
VITE_DEFAULT_SERVICE=airtime
```

### Security Settings

```env
VITE_ENABLE_2FA=false
VITE_ENABLE_LOGIN_NOTIFICATIONS=true
VITE_ENABLE_SESSION_MONITORING=true
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOGIN_LOCKOUT_DURATION=900000
```

## 🚀 Development Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher)
3. **Git**

### Installation Steps

1. **Clone and setup the project:**

   ```bash
   git clone <repository-url>
   cd iutility
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   cp env.example .env
   # Configure .env file
   ```

3. **Install admin system dependencies:**

   ```bash
   cd ../admin-system
   npm install
   cp env.example .env
   # Configure .env file
   ```

4. **Install client portal dependencies:**
   ```bash
   cd ../client-portal
   npm install
   cp env.example .env
   # Configure .env file
   ```

### Database Setup

1. **Create database:**

   ```sql
   CREATE DATABASE iutility CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run migrations:**

   ```bash
   cd backend
   npm run migrate:up
   ```

3. **Verify migration status:**
   ```bash
   npm run migrate:status
   ```

### Development Scripts

#### Backend

```bash
# Start development server
npm run dev

# Run migrations
npm run migrate:up

# Create backup
npm run backup:create

# Check migration status
npm run migrate:status
```

#### Admin System

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Client Portal

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏭 Production Deployment

### Backend Deployment

1. **Environment Configuration:**

   ```env
   NODE_ENV=production
   PORT=9000
   DB_HOST=your_production_db_host
   DB_NAME=iutility_production
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Build and Deploy:**
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment

1. **Build applications:**

   ```bash
   # Admin System
   cd admin-system
   npm run build

   # Client Portal
   cd client-portal
   npm run build
   ```

2. **Deploy to web server:**
   - Upload `dist` folders to your web server
   - Configure reverse proxy for API calls
   - Set up SSL certificates

### Database Migration

1. **Create production backup:**

   ```bash
   npm run backup:create
   ```

2. **Run migrations:**

   ```bash
   npm run migrate:up
   ```

3. **Verify deployment:**
   ```bash
   npm run migrate:status
   ```

## 📊 Environment Variables Reference

### Backend Variables

| Variable                     | Description                | Default     | Required |
| ---------------------------- | -------------------------- | ----------- | -------- |
| `PORT`                       | Server port                | 9000        | No       |
| `NODE_ENV`                   | Environment mode           | development | No       |
| `DB_HOST`                    | Database host              | localhost   | Yes      |
| `DB_NAME`                    | Database name              | iutility    | Yes      |
| `DB_USER`                    | Database user              | -           | Yes      |
| `DB_PASSWORD`                | Database password          | -           | Yes      |
| `JWT_SECRET`                 | JWT signing secret         | -           | Yes      |
| `JWT_REFRESH_SECRET`         | JWT refresh secret         | -           | Yes      |
| `GAMSWITCH_BASE_URL`         | GamSwitch API URL          | -           | Yes      |
| `GAMSWITCH_USERNAME`         | GamSwitch username         | -           | Yes      |
| `GAMSWITCH_PASSWORD`         | GamSwitch password         | -           | Yes      |
| `NAWEC_URL`                  | NAWEC API URL              | -           | No       |
| `NAWEC_USERNAME`             | NAWEC username             | -           | No       |
| `NAWEC_PASSWORD`             | NAWEC password             | -           | No       |
| `DEFAULT_CASHPOWER_PROVIDER` | Default cashpower provider | gamswitch   | No       |
| `SMTP_HOST`                  | SMTP server host           | -           | Yes      |
| `SMTP_USER`                  | SMTP username              | -           | Yes      |
| `SMTP_PASS`                  | SMTP password              | -           | Yes      |

### Frontend Variables

| Variable                 | Description             | Default       | Required |
| ------------------------ | ----------------------- | ------------- | -------- |
| `VITE_API_BASE_URL`      | API base URL            | -             | Yes      |
| `VITE_APP_NAME`          | Application name        | iUtility      | No       |
| `VITE_DEV_SERVER_PORT`   | Development server port | 3000/3001     | No       |
| `VITE_JWT_STORAGE_KEY`   | JWT storage key         | -             | Yes      |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug mode       | true          | No       |
| `VITE_THEME`             | UI theme                | light         | No       |
| `VITE_TIMEZONE`          | Application timezone    | Africa/Banjul | No       |

## 🔒 Security Considerations

### Backend Security

1. **JWT Configuration:**

   - Use strong, unique secrets
   - Set appropriate expiration times
   - Implement refresh token rotation

2. **Database Security:**

   - Use strong passwords
   - Limit database user permissions
   - Enable SSL connections

3. **API Security:**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs

### Frontend Security

1. **Authentication:**

   - Secure token storage
   - Implement auto-logout
   - Session monitoring

2. **Data Protection:**
   - Sanitize user inputs
   - Implement CSRF protection
   - Secure file uploads

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection:**

   ```bash
   # Check database status
   mysql -u root -p -e "SHOW DATABASES;"

   # Verify connection
   npm run migrate:status
   ```

2. **Migration Issues:**

   ```bash
   # Check migration status
   npm run migrate:status

   # Rollback if needed
   npm run migrate:down

   # Restore from backup
   npm run backup:restore
   ```

3. **Frontend Build Issues:**

   ```bash
   # Clear node_modules
   rm -rf node_modules package-lock.json
   npm install

   # Clear build cache
   npm run build -- --force
   ```

### Logs and Debugging

1. **Backend Logs:**

   ```bash
   # View application logs
   tail -f logs/app.log

   # View error logs
   tail -f logs/error.log
   ```

2. **Frontend Debugging:**

   ```bash
   # Enable debug mode
   VITE_ENABLE_DEBUG_MODE=true npm run dev

   # Check browser console
   # Check network tab for API calls
   ```

## 📞 Support

For configuration issues:

1. Check environment variable documentation
2. Verify database connection settings
3. Review migration logs
4. Check application logs for errors
5. Ensure all required variables are set

---

**⚠️ Important**: Always backup your database before running migrations in production environments.

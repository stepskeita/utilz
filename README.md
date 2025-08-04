# iUtility - Unified Utility Services Platform

A comprehensive utility services platform that provides airtime and electricity token services through a unified API and management system.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd iutility
   ```

2. **Run the setup script:**

   ```bash
   ./setup.sh
   ```

3. **Configure environment files:**

   - Backend: `backend/.env`
   - Admin System: `admin-system/.env`
   - Client Portal: `client-portal/.env`

4. **Start development servers:**

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Admin System
   cd admin-system && npm run dev

   # Terminal 3 - Client Portal
   cd client-portal && npm run dev
   ```

5. **Access the applications:**
   - Backend API: http://localhost:9000
   - Admin System: http://localhost:3001
   - Client Portal: http://localhost:3000

## 📁 Project Structure

```
iutility/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # API controllers
│   │   ├── middlewares/    # Authentication and validation
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── migrations/     # Database migrations
│   ├── .env.example        # Environment template
│   └── package.json
├── admin-system/           # Admin management interface
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API integration
│   │   └── store/          # State management
│   ├── .env.example        # Environment template
│   └── package.json
├── client-portal/          # Client self-service portal
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API integration
│   │   └── store/          # State management
│   ├── .env.example        # Environment template
│   └── package.json
├── setup.sh               # Development setup script
├── CONFIGURATION.md       # Configuration guide
└── README.md             # This file
```

## 🔧 Features

### Backend API

- **Unified Authentication**: JWT-based authentication for clients and admins
- **Service Management**: Support for both airtime and electricity token services
- **Provider Integration**: GamSwitch and NAWEC provider integrations
- **Wallet System**: Client wallet management with balance monitoring
- **API Key Management**: Service-specific API key permissions
- **Transaction Tracking**: Comprehensive transaction history and status tracking
- **Email Notifications**: Automated email notifications for transactions
- **Balance Monitoring**: Automated balance monitoring with alerts

### Admin System

- **Client Management**: Complete client lifecycle management
- **Transaction Monitoring**: Real-time transaction tracking and analytics
- **API Key Management**: Create and manage API keys with service permissions
- **Wallet Management**: Manual wallet top-up request approval
- **System Analytics**: Comprehensive system analytics and reporting
- **User Management**: Admin user management and authentication

### Client Portal

- **Self-Service**: Complete self-service portal for clients
- **Transaction History**: View and filter transaction history
- **API Key Management**: Manage API keys with service subscriptions
- **Wallet Management**: View balance and transaction history
- **Service Management**: Access to both airtime and electricity services
- **Profile Management**: Update profile and change password

## 🛠️ Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npm run migrate:up

# Check migration status
npm run migrate:status

# Create database backup
npm run backup:create
```

### Frontend Development

```bash
# Admin System
cd admin-system
npm install
npm run dev

# Client Portal
cd client-portal
npm install
npm run dev
```

### Database Management

```bash
cd backend

# Run migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down

# Check migration status
npm run migrate:status

# Create backup
npm run backup:create

# List backups
npm run backup:list
```

## 🔌 API Integration

### Authentication

```bash
# Client Login
POST /api/v1/client/auth/login
{
  "email": "client@example.com",
  "password": "password"
}

# Admin Login
POST /api/v1/admin/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

### Airtime Service

```bash
# Purchase Airtime
POST /api/v1/airtime/purchase
{
  "phoneNumber": "2201234567",
  "amount": 50,
  "networkCode": "africell"
}

# Check Status
GET /api/v1/airtime/status/:transactionId

# Get History
GET /api/v1/airtime/history
```

### Cashpower Service

```bash
# Check Meter
POST /api/v1/cashpower/check-meter
{
  "meterNumber": "123456789"
}

# Purchase Token
POST /api/v1/cashpower/purchase
{
  "meterNumber": "123456789",
  "amount": 100
}

# Check Status
GET /api/v1/cashpower/status/:transactionId

# Get History
GET /api/v1/cashpower/history
```

## 🔒 Security

### API Key Permissions

- **Service-Specific Access**: API keys can be configured for airtime, electricity, or both services
- **IP Restrictions**: Configure IP address restrictions for API keys
- **Usage Tracking**: Monitor API key usage and performance
- **Automatic Expiration**: Set expiration dates for API keys

### Authentication

- **JWT Tokens**: Secure JWT-based authentication
- **Refresh Tokens**: Automatic token refresh mechanism
- **Session Management**: Secure session handling
- **Password Security**: Bcrypt password hashing

### Data Protection

- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Cross-Site Request Forgery protection

## 📊 Monitoring

### Balance Monitoring

- **Automated Alerts**: Email notifications for low balance
- **Threshold Configuration**: Configurable warning and critical thresholds
- **Real-time Monitoring**: Continuous balance monitoring
- **Alert Management**: Multiple notification channels

### Transaction Monitoring

- **Real-time Tracking**: Live transaction status updates
- **Error Handling**: Comprehensive error tracking and reporting
- **Performance Metrics**: Transaction success rates and response times
- **Provider Monitoring**: Monitor provider availability and performance

## 🚀 Deployment

### Production Setup

1. **Environment Configuration:**

   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Configure production settings

   # Admin System
   cd admin-system
   cp env.example .env
   # Configure production settings

   # Client Portal
   cd client-portal
   cp env.example .env
   # Configure production settings
   ```

2. **Database Setup:**

   ```bash
   cd backend
   npm run migrate:up
   npm run backup:create
   ```

3. **Build Applications:**

   ```bash
   # Admin System
   cd admin-system
   npm run build

   # Client Portal
   cd client-portal
   npm run build
   ```

4. **Deploy:**
   - Upload backend to your server
   - Upload frontend builds to your web server
   - Configure reverse proxy for API calls
   - Set up SSL certificates

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 9000
CMD ["npm", "start"]
```

## 📚 Documentation

- **[Configuration Guide](CONFIGURATION.md)**: Complete configuration setup
- **[Migration Guide](backend/src/migrations/README.md)**: Database migration documentation
- **[API Documentation](backend/API.md)**: Complete API reference
- **[Deployment Guide](DEPLOYMENT.md)**: Production deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the documentation files
- **Issues**: Create an issue on GitHub
- **Configuration**: Refer to CONFIGURATION.md
- **Migrations**: Check backend/src/migrations/README.md

---

**⚠️ Important**: Always backup your database before running migrations in production environments.

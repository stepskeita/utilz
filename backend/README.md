# iUtility: Utility Services API

## Overview

iUtility is a robust Node.js and Express application designed to facilitate utility service purchases including mobile airtime and electricity tokens across various service providers. This API serves as an intermediary between clients and utility service providers, offering a seamless utility purchase experience with strong security controls and flexible integration options.

## Key Features

- **Multi-Service Support**: Integration with GamSwitch API for airtime (Africell, Qcell, Comium, Gamcel) and electricity tokens (NAWEC)
- **User Management**: Authentication with role-based access control
- **Utility Request Processing**: Reliable transaction handling with comprehensive tracking
- **Wallet Management**: Client wallet system for prepaid utility purchases
- **Admin Portal**: Administrative features for platform management
- **Security**: Dynamic CORS implementation and JWT-based authentication
- **Request Validation**: Input validation using Formik and Yup
- **Error Handling**: Centralized error management system

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Third-party APIs**: 
  - GamSwitch API for airtime purchases
  - NAWEC API for electricity token purchases
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Formik + Yup
- **Security**: Custom CORS management, role-based access control

## Project Structure

```
iutility/backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── ApiKey.js (enhanced with service subscription fields)
│   │   ├── UtilityTransaction.js (replaces TopUpRequest)
│   │   ├── ClientWallet.js
│   │   ├── WalletTransaction.js
│   │   └── associations.js
│   ├── controllers/
│   │   ├── utilityController.js
│   │   ├── authController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── utilityService.js
│   │   ├── authService.js
│   │   └── corsService.js
│   ├── routes/
│   │   ├── index.js
│   │   └── v1/
│   │       ├── index.js
│   │       ├── utilityRoutes.js
│   │       ├── authRoutes.js
│   │       └── adminRoutes.js
│   ├── middlewares/
│   │   ├── validator.js
│   │   ├── authMiddleware.js
│   │   ├── corsMiddleware.js
│   │   └── errorHandler.js
│   └── utils/
│       ├── apiResponse.js
│       └── logger.js
├── package.json
├── server.js
└── README.md
```

## Database Models

### Core Models

1. **Client**: Client accounts with wallet and API key management
2. **ApiKey**: Enhanced with service subscription fields (isAirtime, isCashpower, isBoth)
3. **UtilityTransaction**: Replaces TopUpRequest with type field (airtime/cashpower)
4. **ClientWallet**: Wallet system for prepaid utility purchases
5. **WalletTransaction**: Detailed transaction logging
6. **User**: Admin user accounts for platform management

### Model Associations

- Client has many ApiKeys and UtilityTransactions
- Client has one ClientWallet
- ClientWallet has many WalletTransactions
- UtilityTransaction has one WalletTransaction
- ApiKey has many ApiUsage records

## API Endpoints

### Public Routes

- **POST /api/v1/auth/login**: User authentication
- **POST /api/v1/auth/register**: New user registration
- **POST /api/v1/auth/refresh-token**: Refresh authentication token
- **POST /api/v1/auth/logout**: User logout

### Protected Routes

- **POST /api/v1/utility/airtime**: Initiate an airtime purchase
- **GET /api/v1/utility/airtime/history**: Get airtime transaction history
- **POST /api/v1/utility/cashpower**: Initiate an electricity token purchase
- **GET /api/v1/utility/cashpower/history**: Get electricity transaction history

### Admin Routes

- **GET /api/v1/admin/clients**: Manage clients
- **GET /api/v1/admin/transactions**: View transaction history
- **GET /api/v1/admin/apikeys**: Manage API keys

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file based on the `.env.example` file and configure:
   - Database credentials
   - JWT secrets
   - Port configuration
   - Environment settings
   - GamSwitch API credentials
   - NAWEC API credentials
4. Run database migrations: `npm run dev`
5. Start the server: `npm start`

## Environment Variables

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_NAME=iutility
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=1h

# Server Configuration
PORT=9000
NODE_ENV=development

# GamSwitch API Configuration
GAMSWITCH_BASE_URL=https://test.gamswitchgm.com
GAMSWITCH_INTERCHANGE=gswlive
GAMSWITCH_USERNAME=your_username
GAMSWITCH_PASSWORD=your_password
GAMSWITCH_HASH_KEY=your_hash_key
GAMSWITCH_SECURITY_KEY=your_security_key

# NAWEC API Configuration
NAWEC_GRANT_TYPE=password
NAWEC_USERNAME=your_username
NAWEC_PASSWORD=your_password
NAWEC_SCOPE=your_scope
NAWEC_URL=https://api.nawec.gm
NAWEC_BASIC_TOKEN=your_basic_token
NAWEC_CONTENT_TYPE=application/x-www-form-urlencoded
NAWEC_ORIGIN=your_origin
NAWEC_ENV=production
NAWEC_API_VERSION=v1
```

## API Key Service Subscriptions

The ApiKey model now includes service subscription fields:

- **isAirtime**: Access to airtime services
- **isCashpower**: Access to electricity token services  
- **isBoth**: Access to both airtime and electricity services

## Transaction Types

The UtilityTransaction model supports two transaction types:

- **airtime**: Mobile airtime purchases
- **cashpower**: Electricity token purchases

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. 
# Installation & Setup Guide

## Prerequisites

Before installing the Futy League Management System, ensure your development environment meets the following requirements:

### System Requirements
- **Operating System**: Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)
- **Node.js**: Version 18.17.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **MongoDB**: Version 5.0 or higher (local installation or cloud instance)
- **Git**: Version 2.30.0 or higher

### Hardware Requirements
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: Minimum 10GB free space
- **CPU**: Multi-core processor (4+ cores recommended)

### Network Requirements
- **Internet Connection**: Required for package installation and external API calls
- **Firewall**: Open ports for MongoDB (27017) and Next.js dev server (3000)

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ravibazaz/FUTY-FRONT.git

# Navigate to the project directory
cd FUTY-FRONT

# Verify the clone
ls -la
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Output:**
```
├── @types/node@20.10.0
├── mongoose@8.0.0
├── next@15.0.0
├── react@19.0.0
├── zod@3.22.0
└── ... (additional dependencies)
```

### 3. Environment Configuration

Create the environment configuration file:

```bash
# Create environment file
touch .env.local
```

**Required Environment Variables:**

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/futy-league
MONGODB_TEST_URI=mongodb://localhost:27017/futy-league-test

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# External Services
BREVO_API_KEY=your-brevo-api-key
BREVO_REST_URL=https://api.brevo.com/v3
BREVO_MAIL_FROM=admin@futy-league.com
MAIL_FROM_NAME=Futy League

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Geocoding Service
GEOCODE_API_KEY=your-geocoding-api-key

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Futy League Management
NEXT_PUBLIC_APP_VERSION=1.0.0

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
ALLOWED_DOCUMENT_TYPES=application/pdf,text/plain

# Security Configuration
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Development Configuration
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### 4. Database Setup

#### Local MongoDB Installation

**Windows (using Chocolatey):**
```powershell
choco install mongodb
net start MongoDB
```

**macOS (using Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Database Initialization

```bash
# Start MongoDB service
sudo systemctl start mongod

# Verify MongoDB is running
mongosh --eval "db.runCommand({ping: 1})"

# Create database and initial collections
mongosh futy-league --eval "
  db.createCollection('users');
  db.createCollection('teams');
  db.createCollection('leagues');
  db.createCollection('tournaments');
  db.createCollection('referees');
  db.createCollection('stores');
  db.createCollection('vendors');
  db.createCollection('grounds');
  db.createCollection('clubs');
  db.createCollection('agegroups');
  db.createCollection('managerinvitations');
  db.createCollection('playerinvitations');
  db.createCollection('faninvitations');
  db.createCollection('tournamentaccepted');
  db.createCollection('tournamentorderhistories');
  db.createCollection('orderhistories');
  db.createCollection('adverts');
  db.createCollection('categories');
  db.createCollection('friendlys');
  db.createCollection('groundfacilities');
  db.createCollection('notifications');
  db.createCollection('payments');
"
```

### 5. Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore

2. **Generate Service Account Key:**
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file
   - Extract values for `.env.local`

3. **Configure FCM:**
   - Enable Cloud Messaging in Firebase Console
   - Copy server key for push notifications

### 6. Stripe Setup

1. **Create Stripe Account:**
   - Sign up at [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get API keys from Developers → API Keys

2. **Configure Webhooks:**
   - Add webhook endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, etc.
   - Copy webhook secret to `.env.local`

### 7. Brevo (Sendinblue) Setup

1. **Create Account:**
   - Sign up at [Brevo](https://www.brevo.com/)
   - Verify email and complete setup

2. **Generate API Key:**
   - Go to SMTP & API → API Keys
   - Create new API key
   - Copy to `.env.local`

### 8. Development Server

```bash
# Start development server
npm run dev

# Expected output:
# ▲ Next.js 15.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
# ✓ Ready in 2.3s
```

### 9. Database Seeding (Optional)

```bash
# Run database seeding script
npm run seed

# Or manually seed with sample data
node scripts/seed.js
```

### 10. Testing Setup

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

#### Port Conflicts
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port 3000
kill -9 $(lsof -t -i:3000)
```

#### Environment Variable Issues
```bash
# Validate .env.local syntax
node -e "require('dotenv').config({path: '.env.local'}); console.log('Environment loaded successfully');"

# Check for missing variables
node scripts/check-env.js
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

## Production Deployment

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- Database URLs should point to production MongoDB
- API keys should use production credentials
- CORS origins should include your domain
- Debug and development flags should be disabled

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected and seeded
- [ ] External services (Firebase, Stripe, Brevo) configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] File upload directories created with proper permissions
- [ ] Backup strategy implemented
- [ ] Monitoring and logging configured

## Support

For additional help:
- Check the [Issues](https://github.com/your-organization/futy-league-management/issues) page
- Review the [API Documentation](./06-api-documentation.md)
- Contact the development team

---

**Installation completed successfully!** 🎉

Your Futy League Management System is now ready for development.
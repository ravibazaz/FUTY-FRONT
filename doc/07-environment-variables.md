# Environment Variables Configuration

## Overview

The Futy League Management System uses environment variables to configure database connections, authentication secrets, external service integrations, and application settings. This document provides a comprehensive guide to all required and optional environment variables.

## Environment File Structure

### Main Environment File
Create a `.env.local` file in the project root:

```bash
# Copy from .env.example and configure
cp .env.example .env.local
```

### Environment File Priority
1. `.env.local` (highest priority - gitignored)
2. `.env.development.local`
3. `.env.test.local`
4. `.env.production.local`
5. `.env` (lowest priority)

## Database Configuration

### MongoDB Connection

```bash
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futy_league?retryWrites=true&w=majority

# Alternative: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/futy_league

# Database Name (optional - defaults to connection string database)
MONGODB_DB=futy_league

# Connection Options
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME_MS=30000
```

### Redis Configuration (Optional)

```bash
# Redis for caching and sessions
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

## Authentication & Security

### JWT Configuration

```bash
# JWT Secret Key (generate a strong random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here-32-chars-minimum

# JWT Expiration Times
JWT_ACCESS_TOKEN_EXPIRE=15m
JWT_REFRESH_TOKEN_EXPIRE=7d
JWT_RESET_PASSWORD_EXPIRE=1h
JWT_EMAIL_VERIFICATION_EXPIRE=24h

# JWT Issuer and Audience
JWT_ISSUER=futy-league-management
JWT_AUDIENCE=futy-league-users
```

### Session Configuration

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Session Settings
SESSION_MAX_AGE=86400  # 24 hours in seconds
SESSION_UPDATE_AGE=3600  # 1 hour in seconds
```

### Password Security

```bash
# Password Hashing
BCRYPT_ROUNDS=12

# Password Requirements
PASSWORD_MIN_LENGTH=7
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=false
```

## External Service Integrations

### Firebase Configuration

```bash
# Firebase Project Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK (for server-side operations)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Push Notification Settings
FCM_SERVER_KEY=your-fcm-server-key
```

### Stripe Payment Processing

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
STRIPE_SECRET_KEY=sk_test_your-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Settings
STRIPE_CURRENCY=usd
STRIPE_TAX_RATE=0.08  # 8% tax rate

# Tournament Fee Settings
TOURNAMENT_BASE_FEE=50
TOURNAMENT_PREMIUM_FEE=100
REFERRAL_FEE=25
```

### Brevo Email Service

```bash
# Brevo (Sendinblue) Configuration
BREVO_API_KEY=your-brevo-api-key-here
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-smtp-username
BREVO_SMTP_PASS=your-smtp-password

# Email Templates
BREVO_WELCOME_TEMPLATE_ID=1
BREVO_RESET_PASSWORD_TEMPLATE_ID=2
BREVO_EMAIL_VERIFICATION_TEMPLATE_ID=3
BREVO_TOURNAMENT_CONFIRMATION_TEMPLATE_ID=4

# Email Settings
FROM_EMAIL=noreply@futy-league.com
FROM_NAME=Futy League Management
```

### Google Maps Integration

```bash
# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Geocoding Settings
GEOCODING_LANGUAGE=en
GEOCODING_REGION=US
```

## Application Configuration

### Next.js Configuration

```bash
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
NEXT_PUBLIC_NODE_ENV=development

# Build Settings
NEXT_TELEMETRY_DISABLED=1
```

### File Upload Configuration

```bash
# Upload Settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
ALLOWED_DOCUMENT_TYPES=application/pdf

# Upload Directories
UPLOAD_DIR=./public/uploads
TEMP_UPLOAD_DIR=./temp/uploads

# Image Processing
IMAGE_QUALITY=80
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
```

### Logging Configuration

```bash
# Log Level
LOG_LEVEL=info  # error, warn, info, debug

# Log Files
LOG_FILE=./logs/app.log
ERROR_LOG_FILE=./logs/error.log

# External Logging (optional)
LOGTAIL_TOKEN=your-logtail-token  # For Logtail logging
SENTRY_DSN=your-sentry-dsn  # For Sentry error tracking
```

## Third-Party API Keys

### Sports Data APIs (Optional)

```bash
# Football Data API
FOOTBALL_DATA_API_KEY=your-football-data-api-key

# Weather API for outdoor events
WEATHER_API_KEY=your-weather-api-key
OPENWEATHER_API_KEY=your-openweather-api-key
```

### Social Media Integration (Optional)

```bash
# Twitter/X API
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# Facebook API
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## Development & Testing

### Development Settings

```bash
# Debug Mode
DEBUG=true
DEBUG_DATABASE_QUERIES=false
DEBUG_API_REQUESTS=true

# Development Tools
ENABLE_SWAGGER=true
ENABLE_GRAPHQL_PLAYGROUND=false
```

### Testing Configuration

```bash
# Test Database
TEST_MONGODB_URI=mongodb://localhost:27017/futy_league_test

# Test Email Settings (use test service)
TEST_EMAIL_SERVICE=mailtrap
MAILTRAP_API_TOKEN=your-mailtrap-token

# Test Payment Settings
STRIPE_TEST_MODE=true
```

## Security Settings

### CORS Configuration

```bash
# CORS Settings
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Content-Type,Authorization,X-Requested-With
```

### Rate Limiting

```bash
# Rate Limiting Settings
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Strict Rate Limits for Auth
AUTH_RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5

# File Upload Limits
UPLOAD_RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
UPLOAD_RATE_LIMIT_MAX_UPLOADS=10
```

### Security Headers

```bash
# Content Security Policy
CSP_DEFAULT_SRC=self
CSP_SCRIPT_SRC=self 'unsafe-inline' 'unsafe-eval'
CSP_STYLE_SRC=self 'unsafe-inline'
CSP_IMG_SRC=self data: https:

# Other Security Headers
HSTS_MAX_AGE=31536000
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=false
```

## Monitoring & Analytics

### Application Monitoring

```bash
# Application Performance Monitoring
APM_SERVICE_NAME=futy-league
APM_SECRET_TOKEN=your-apm-token
APM_SERVER_URL=https://apm-server.example.com

# Health Check
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_DATABASE=true
HEALTH_CHECK_EXTERNAL_SERVICES=true
```

### Analytics

```bash
# Google Analytics
GA_TRACKING_ID=GA-XXXXXXXXXX

# Mixpanel
MIXPANEL_TOKEN=your-mixpanel-token

# Custom Analytics
ANALYTICS_ENABLED=true
ANALYTICS_TRACK_EVENTS=true
```

## Deployment Configuration

### Production Environment

```bash
# Production URLs
NEXT_PUBLIC_APP_URL=https://futy-league.com
NEXT_PUBLIC_API_URL=https://api.futy-league.com

# SSL/TLS
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/private.key

# Load Balancer
LB_HEALTH_CHECK_PATH=/api/health
LB_STICKY_SESSIONS=true
```

### Docker Configuration

```bash
# Docker Settings
DOCKER_IMAGE_TAG=latest
DOCKER_CONTAINER_NAME=futy-league-app
DOCKER_NETWORK=futy-network

# Database Container
DB_CONTAINER_NAME=futy-mongodb
DB_VOLUME_PATH=./docker/volumes/mongodb
```

## Environment Validation

### Required Variables Check

The application includes environment validation on startup:

```javascript
// lib/config/env.js
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'FIREBASE_API_KEY',
  'STRIPE_SECRET_KEY',
  'BREVO_API_KEY'
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### Environment-Specific Configurations

```javascript
// Different configs for different environments
const configs = {
  development: {
    debug: true,
    logLevel: 'debug',
    database: 'dev_db'
  },
  test: {
    debug: false,
    logLevel: 'error',
    database: 'test_db'
  },
  production: {
    debug: false,
    logLevel: 'info',
    database: 'prod_db'
  }
};
```

## Security Best Practices

### Secret Management

1. **Never commit secrets to version control**
2. **Use environment-specific secret values**
3. **Rotate secrets regularly**
4. **Use secret management services in production** (AWS Secrets Manager, Azure Key Vault, etc.)

### Environment File Security

```bash
# .gitignore should include:
.env*
!.env.example

# Create .env.example with dummy values
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your-jwt-secret-here
# ... other variables with dummy values
```

### Production Deployment

For production deployments:

1. Use environment-specific `.env.production.local` files
2. Set variables through deployment platform (Vercel, Heroku, Docker)
3. Use secret management services
4. Enable encryption for sensitive data
5. Regular security audits of environment configurations

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGODB_URI` format
   - Verify network connectivity
   - Check MongoDB Atlas IP whitelist

2. **JWT Token Errors**
   - Ensure `JWT_SECRET` is set and secure
   - Check token expiration settings

3. **Firebase Integration Issues**
   - Verify Firebase project configuration
   - Check API keys and service account credentials

4. **Email Not Sending**
   - Verify Brevo API key
   - Check SMTP settings
   - Review email templates

### Environment Validation Script

```bash
# Run environment validation
npm run validate-env

# Check specific service connectivity
npm run test-db-connection
npm run test-firebase
npm run test-stripe
```

## Support

For environment configuration issues:
- Check the `.env.example` file for reference
- Review application logs for configuration errors
- Contact the development team with specific error messages
- Use the issue tracker for configuration-related bugs

---

**Note**: Always keep your `.env.local` file secure and never share it publicly. Use the `.env.example` file as a template for required variables.
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

#App Name \
APP_NAME='FUTY'
##MONGODB_URI=mongodb://localhost:27017/nextFrienlyDB
NODE_ENV=local
##HOST=localhost
JWT_SECRET=
NEXT_PUBLIC_API_URL=https://futy-api.makeitlive.info
##For production
##MONGODB_URI=mongodb+srv://your-user:your-pass@your-cluster.mongodb.net/newsDB
MONGODB_URI=mongodb+srv://your-user:your-pass@your-cluster.mongodb.net/newsDB
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM_NAME="${APP_NAME}"

GOOGLE_API_KEY=

BREVO_API_KEY=
BREVO_MAIL_FROM=
BREVO_REST_URL=https://api.brevo.com/v3/smtp/email

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
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
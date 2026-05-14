# Futy League Management System

A comprehensive, enterprise-grade sports league management platform built with Next.js 15, MongoDB, and modern web technologies. The system enables complete lifecycle management of sports leagues, tournaments, teams, and players with advanced features including admin dashboards, payment processing, push notifications, and real-time updates.

## 🎯 Key Features

### Core Functionality
- **League Management**: Create and manage multiple sports leagues with hierarchical organization
- **Team & Player Management**: Comprehensive team registration, roster management, and player profiles
- **Tournament Management**: Create, organize, and manage tournaments with various formats
- **Referee Management**: Referee assignment, availability tracking, and fee management
- **User Management**: Multi-role user system (Players, Managers, Fans, Referees, Admins)

### Admin Features
- **Comprehensive Admin Dashboard**: Real-time analytics, performance metrics, and system monitoring
- **User Administration**: Create, manage, and monitor all platform users
- **Content Moderation**: Approve/reject user-generated content and manage platform policies
- **Financial Management**: Stripe payment processing, revenue tracking, and financial reporting
- **System Configuration**: Platform settings, feature flags, and email templates

### Technical Capabilities
- **Authentication & Security**: JWT-based authentication with role-based access control (RBAC)
- **Payment Processing**: Integrated Stripe payments for tournament fees and registrations
- **Push Notifications**: Firebase Cloud Messaging for real-time notifications
- **Email Notifications**: Brevo SMTP integration for transactional emails
- **File Management**: Secure image and document uploads with validation
- **API Documentation**: RESTful API with comprehensive endpoint documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB 5.0+
- Firebase project (for push notifications)
- Stripe account (for payment processing)
- Brevo account (for email service)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd futy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Application: `http://localhost:3000`
   - API: `http://localhost:3000/api`

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
futy/
├── /app                    # Next.js App Router & API routes
│   ├── /api               # REST API endpoints
│   ├── /admin             # Admin panel pages
│   ├── /auth              # Authentication pages
│   └── layout.tsx         # Root layout
├── /components            # React components
│   ├── /ui               # Reusable UI components
│   ├── /layout           # Layout components
│   ├── /forms            # Form components
│   └── /dashboard        # Dashboard components
├── /lib                   # Utility libraries & helpers
│   ├── /models           # MongoDB models
│   ├── /auth             # Authentication utilities
│   ├── /services         # External service integrations
│   ├── /db               # Database configuration
│   └── /config           # Configuration management
├── /actions              # Next.js server actions
├── /types                # TypeScript type definitions
├── /public               # Static assets
├── /doc                  # Documentation
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## 🔐 Security

The platform implements enterprise-grade security measures:

- **Authentication**: JWT-based authentication with secure token management
- **Authorization**: Role-based access control (RBAC) with granular permissions
- **Data Protection**: Bcrypt password hashing and optional field-level encryption
- **Input Validation**: Zod schema validation for all API endpoints
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Security**: Configurable CORS with origin validation
- **Security Headers**: HTTP security headers for XSS, clickjacking, and MIME-sniffing protection

For detailed security information, see [doc/08-security.md](doc/08-security.md).

## 🔧 Environment Configuration

The application requires several environment variables for external services:

### Database
- `MONGODB_URI`: MongoDB connection string

### Authentication
- `JWT_SECRET`: JWT signing secret
- `NEXTAUTH_SECRET`: NextAuth.js secret

### External Services
- `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`: Firebase configuration
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`: Stripe payment keys
- `BREVO_API_KEY`: Email service configuration
- `GOOGLE_MAPS_API_KEY`: Google Maps integration

For complete environment configuration details, see [doc/07-environment-variables.md](doc/07-environment-variables.md).

## 📖 Documentation

Comprehensive documentation is available in the `/doc` folder:

- **[01-project-overview.md](doc/01-project-overview.md)** - System architecture and technology stack
- **[02-installation.md](doc/02-installation.md)** - Detailed setup and installation guide
- **[03-folder-structure.md](doc/03-folder-structure.md)** - Directory structure and organization
- **[04-authentication.md](doc/04-authentication.md)** - Authentication and authorization system
- **[05-admin-features.md](doc/05-admin-features.md)** - Admin panel and management features
- **[06-api-documentation.md](doc/06-api-documentation.md)** - API endpoints and usage
- **[07-environment-variables.md](doc/07-environment-variables.md)** - Configuration guide
- **[08-security.md](doc/08-security.md)** - Security measures and best practices

## 🛠️ Development

### Run Tests
```bash
npm run test
npm run test:watch
```

### Build & Lint
```bash
npm run build
npm run lint
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 📦 Technology Stack

- **Frontend**: React 19, Next.js 15 with App Router, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, NextAuth.js
- **Styling**: Tailwind CSS, CSS Modules
- **Form Validation**: Zod
- **File Upload**: Multer
- **Payments**: Stripe API
- **Email**: Brevo SMTP
- **Notifications**: Firebase Cloud Messaging
- **Testing**: Jest, React Testing Library
- **API**: RESTful API with comprehensive endpoint documentation

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Zod schema validation with detailed error messages
- **Authentication Errors**: Clear error responses for auth failures
- **API Errors**: Standardized error response format
- **Database Errors**: Graceful handling of database connection issues
- **File Upload Errors**: Validation of file size and type

## 📊 Performance

- **Lazy Loading**: Components loaded on-demand
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Strategic caching of frequently accessed data
- **Image Optimization**: Automatic image optimization and resizing
- **API Pagination**: Paginated responses to manage data efficiently

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 📞 Support

For support, issues, or questions:

1. Check the comprehensive documentation in `/doc` folder
2. Review API documentation in [doc/06-api-documentation.md](doc/06-api-documentation.md)
3. Check environment configuration in [doc/07-environment-variables.md](doc/07-environment-variables.md)
4. Contact the development team

## 📋 Project Status

**Current Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Active Development

---

**Note**: For detailed technical documentation, setup instructions, and architecture details, refer to the documentation files in the `/doc` directory.
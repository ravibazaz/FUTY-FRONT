# Project Folder Structure

This document provides a comprehensive overview of the Futy League Management System's directory structure, explaining the purpose and organization of each folder and key files.

## Root Directory Structure

```
futy-league-management/
├── .env.local                    # Environment variables (gitignored)
├── .gitignore                    # Git ignore patterns
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── jsconfig.json                # JavaScript configuration
├── eslint.config.js             # ESLint configuration
├── prettier.config.js           # Prettier configuration
├── middleware.js                # Next.js middleware
├── .next/                       # Build output (gitignored)
├── node_modules/                # Dependencies (gitignored)
├── public/                      # Static assets
├── uploads/                     # User-uploaded files (gitignored)
├── doc/                         # Documentation
├── app/                         # Next.js App Router
├── components/                  # React components
├── lib/                         # Utilities and configurations
├── actions/                     # Server actions
└── types/                       # TypeScript type definitions
```

## `/app` Directory - Next.js App Router

The `/app` directory contains all Next.js routes, API endpoints, and page components using the App Router architecture.

```
app/
├── layout.js                    # Root layout component
├── page.js                      # Home page
├── globals.css                  # Global styles
├── loading.js                   # Global loading component
├── error.js                     # Global error component
├── not-found.js                 # 404 page
├── api/                         # API routes
│   ├── users/                   # User management endpoints
│   │   ├── signup/
│   │   ├── login/
│   │   ├── loginbycode/
│   │   ├── resendcode/
│   │   ├── forgetpassword/
│   │   ├── playerinvitationcodecheck/
│   │   ├── managerinvitationcodecheck/
│   │   ├── faninvitationcodecheck/
│   │   ├── deleteaccount/
│   │   └── signupnext/
│   ├── teams/                   # Team management
│   │   ├── route.js
│   │   ├── add/
│   │   ├── check-club-age/
│   │   ├── invitationmanagers/
│   │   ├── list/
│   │   │   ├── [club_id]/
│   │   │   └── [club_id]/[ageGroupId]/
│   │   └── [id]/
│   ├── tournaments/             # Tournament management
│   │   ├── route.js
│   │   ├── add/
│   │   └── list/
│   ├── tournamentaccepted/      # Tournament acceptance
│   │   ├── route.js
│   │   ├── add/
│   │   └── list/
│   ├── referees/                # Referee management
│   │   ├── route.js
│   │   ├── dashboard/
│   │   ├── list/
│   │   └── [id]/
│   ├── stores/                  # Store/e-commerce
│   │   ├── route.js
│   │   ├── categorywise/[cat_id]/
│   │   ├── createorder/
│   │   └── [id]/
│   ├── stripe/                  # Payment processing
│   │   └── webhook/
│   ├── push/                    # Push notifications
│   │   └── send/
│   ├── vendors/                 # Vendor management
│   ├── uploads/                 # File serving
│   │   ├── [filename]/
│   │   └── */[filename]/        # Category-specific uploads
│   └── check-auth/              # Authentication check
├── admin/                       # Admin panel pages
│   ├── layout.js
│   ├── page.js
│   ├── leagues/
│   ├── teams/
│   ├── managers/
│   └── users/
├── dashboard/                   # User dashboard
├── profile/                     # User profile pages
└── auth/                        # Authentication pages
    ├── login/
    ├── signup/
    └── verify/
```

### API Routes Organization

- **`/api/users/*`**: User authentication, registration, and profile management
- **`/api/teams/*`**: Team CRUD operations, invitations, and relationships
- **`/api/tournaments/*`**: Tournament creation, management, and acceptance
- **`/api/referees/*`**: Referee profiles, dashboards, and search
- **`/api/stores/*`**: E-commerce functionality and product management
- **`/api/stripe/*`**: Payment processing and webhook handling
- **`/api/push/*`**: Firebase Cloud Messaging integration
- **`/api/uploads/*`**: File serving and media management

## `/components` Directory - React Components

Reusable React components organized by functionality and complexity.

```
components/
├── ui/                          # Basic UI components
│   ├── Button.js
│   ├── Input.js
│   ├── Modal.js
│   ├── Table.js
│   ├── Card.js
│   ├── Badge.js
│   ├── Alert.js
│   ├── Spinner.js
│   └── Form.js
├── layout/                      # Layout components
│   ├── Header.js
│   ├── Sidebar.js
│   ├── Footer.js
│   ├── Navigation.js
│   └── Breadcrumb.js
├── forms/                       # Form components
│   ├── LoginForm.js
│   ├── SignupForm.js
│   ├── TeamForm.js
│   ├── TournamentForm.js
│   ├── ProfileForm.js
│   └── SearchForm.js
├── dashboard/                   # Dashboard components
│   ├── DashboardCard.js
│   ├── StatsWidget.js
│   ├── RecentActivity.js
│   ├── QuickActions.js
│   └── NotificationPanel.js
├── teams/                       # Team-related components
│   ├── TeamCard.js
│   ├── TeamList.js
│   ├── TeamDetails.js
│   ├── TeamInvitation.js
│   └── TeamSearch.js
├── tournaments/                 # Tournament components
│   ├── TournamentCard.js
│   ├── TournamentList.js
│   ├── TournamentDetails.js
│   ├── TournamentForm.js
│   └── TournamentFilters.js
├── referees/                    # Referee components
│   ├── RefereeCard.js
│   ├── RefereeProfile.js
│   ├── RefereeDashboard.js
│   └── RefereeSearch.js
├── stores/                      # E-commerce components
│   ├── ProductCard.js
│   ├── ProductList.js
│   ├── Cart.js
│   ├── Checkout.js
│   └── OrderHistory.js
├── auth/                        # Authentication components
│   ├── LoginModal.js
│   ├── SignupWizard.js
│   ├── PasswordReset.js
│   └── EmailVerification.js
├── admin/                       # Admin-specific components
│   ├── AdminSidebar.js
│   ├── DataTable.js
│   ├── BulkActions.js
│   ├── AuditLog.js
│   └── SystemSettings.js
├── shared/                      # Shared utilities
│   ├── ErrorBoundary.js
│   ├── LoadingStates.js
│   ├── EmptyStates.js
│   ├── Pagination.js
│   └── SearchFilters.js
└── providers/                   # Context providers
    ├── AuthProvider.js
    ├── ThemeProvider.js
    ├── NotificationProvider.js
    └── DataProvider.js
```

### Component Organization Principles

- **Atomic Design**: Components organized from basic (ui/) to complex (feature-specific)
- **Separation of Concerns**: UI, business logic, and data fetching separated
- **Reusability**: Components designed for maximum reuse across the application
- **Composition**: Complex components built from simpler, composable parts

## `/lib` Directory - Core Utilities

Core business logic, configurations, and utility functions.

```
lib/
├── db/                          # Database configuration
│   ├── connect.js               # MongoDB connection
│   ├── models/                  # Mongoose models
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── League.js
│   │   ├── Tournament.js
│   │   ├── Referee.js
│   │   ├── Store.js
│   │   ├── Vendor.js
│   │   ├── Ground.js
│   │   ├── Club.js
│   │   ├── AgeGroup.js
│   │   ├── ManagerInvitation.js
│   │   ├── PlayerInvitation.js
│   │   ├── FanInvitation.js
│   │   ├── TournamentAccepted.js
│   │   ├── TournamentOrderHistory.js
│   │   ├── OrderHistory.js
│   │   ├── Advert.js
│   │   ├── Category.js
│   │   ├── Friendly.js
│   │   ├── GroundFacility.js
│   │   ├── Notification.js
│   │   └── Payment.js
│   └── indexes.js               # Database indexes
├── auth/                        # Authentication utilities
│   ├── jwt.js                   # JWT token handling
│   ├── middleware.js            # Route protection
│   ├── bcrypt.js                # Password hashing
│   └── session.js               # Session management
├── validations/                 # Zod validation schemas
│   ├── userSchemas.js
│   ├── teamSchemas.js
│   ├── tournamentSchemas.js
│   ├── refereeSchemas.js
│   ├── storeSchemas.js
│   └── commonSchemas.js
├── services/                    # External service integrations
│   ├── firebase.js              # Firebase Admin SDK
│   ├── stripe.js                # Stripe payment processing
│   ├── brevo.js                 # Email service
│   ├── geocode.js               # Geocoding service
│   └── notifications.js         # Push notification service
├── utils/                       # Utility functions
│   ├── fileUpload.js            # File handling utilities
│   ├── imageProcessing.js       # Image manipulation
│   ├── dateUtils.js             # Date/time utilities
│   ├── stringUtils.js           # String manipulation
│   ├── arrayUtils.js            # Array operations
│   └── validationUtils.js       # Validation helpers
├── constants/                   # Application constants
│   ├── apiEndpoints.js
│   ├── userRoles.js
│   ├── statusCodes.js
│   ├── errorMessages.js
│   └── config.js
├── hooks/                       # Custom React hooks
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── usePagination.js
└── config/                      # Configuration files
    ├── database.js
    ├── firebase.js
    ├── stripe.js
    └── app.js
```

### Library Organization

- **Database Layer**: Models, connections, and database operations
- **Authentication**: JWT, middleware, and security utilities
- **External Services**: Third-party API integrations
- **Business Logic**: Core application logic and workflows
- **Utilities**: Helper functions and common operations

## `/actions` Directory - Server Actions

Server-side actions for data mutations and complex operations.

```
actions/
├── users/                       # User-related actions
│   ├── createUser.js
│   ├── updateUser.js
│   ├── deleteUser.js
│   ├── authenticateUser.js
│   └── updateProfile.js
├── teams/                       # Team management actions
│   ├── createTeam.js
│   ├── updateTeam.js
│   ├── deleteTeam.js
│   ├── inviteManager.js
│   └── joinTeam.js
├── tournaments/                 # Tournament actions
│   ├── createTournament.js
│   ├── updateTournament.js
│   ├── acceptTournament.js
│   ├── cancelTournament.js
│   └── processPayment.js
├── referees/                    # Referee actions
│   ├── updateRefereeProfile.js
│   ├── searchReferees.js
│   └── assignReferee.js
├── stores/                      # E-commerce actions
│   ├── createProduct.js
│   ├── updateProduct.js
│   ├── processOrder.js
│   └── manageInventory.js
├── notifications/               # Notification actions
│   ├── sendPushNotification.js
│   ├── sendEmail.js
│   └── createNotification.js
└── admin/                       # Administrative actions
    ├── manageUsers.js
    ├── manageLeagues.js
    ├── systemSettings.js
    └── auditActions.js
```

### Server Actions Design

- **Type Safety**: Full TypeScript support for server actions
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Server-side validation and authorization
- **Performance**: Optimized database queries and caching

## `/types` Directory - TypeScript Definitions

TypeScript type definitions and interfaces.

```
types/
├── index.ts                     # Main type exports
├── user.ts                      # User-related types
├── team.ts                      # Team and league types
├── tournament.ts                # Tournament types
├── referee.ts                   # Referee types
├── store.ts                     # E-commerce types
├── api.ts                       # API response types
├── form.ts                      # Form-related types
├── component.ts                 # Component prop types
└── config.ts                    # Configuration types
```

## Additional Directories

### `/public` Directory
```
public/
├── images/                      # Static images
│   ├── logos/
│   ├── icons/
│   └── placeholders/
├── fonts/                       # Custom fonts
├── favicon.ico                  # Favicon
└── robots.txt                   # SEO configuration
```

### `/uploads` Directory (Runtime Generated)
```
uploads/
├── managers/                    # Manager profile images
├── players/                     # Player profile images
├── referees/                    # Referee profile images
├── fans/                        # Fan profile images
├── teams/                       # Team logos and images
├── tournaments/                 # Tournament images
├── stores/                      # Product images
├── grounds/                     # Ground/facility images
├── leagues/                     # League logos
├── clubs/                       # Club logos
└── adverts/                     # Advertisement images
```

### `/doc` Directory
```
doc/
├── 01-project-overview.md
├── 02-installation.md
├── 03-folder-structure.md
├── 04-authentication.md
├── 05-admin-features.md
├── 06-api-documentation.md
├── 07-environment-variables.md
├── 08-security.md
├── app/                         # API documentation by route
├── components/                  # Component documentation
├── lib/                         # Library documentation
└── guides/                      # User guides and tutorials
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.js`, `TeamCard.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `validateEmail.js`)
- **API Routes**: kebab-case for directories, camelCase for files
- **Models**: PascalCase (e.g., `User.js`, `Tournament.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

## Import/Export Patterns

- **Default Exports**: Used for main components and utilities
- **Named Exports**: Used for multiple exports from a module
- **Barrel Exports**: `index.js` files for clean imports
- **Absolute Imports**: Configured for clean import paths

## Development Workflow

1. **Feature Development**: Create components in `/components`
2. **API Development**: Add routes in `/app/api`
3. **Business Logic**: Implement in `/lib` or `/actions`
4. **Type Safety**: Define types in `/types`
5. **Testing**: Add tests alongside implementation files
6. **Documentation**: Update docs in `/doc`

This structure ensures maintainability, scalability, and clear separation of concerns throughout the application.
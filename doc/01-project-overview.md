# Project Overview

## Introduction

**Futy League Management System** is a comprehensive, full-stack sports management platform built with modern web technologies. This application provides a complete ecosystem for managing sports leagues, teams, tournaments, referees, players, and administrative operations through an intuitive web interface and robust API infrastructure.

## Architecture Overview

### Technology Stack

#### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with custom components
- **Styling**: Bootstrap CSS framework with responsive design
- **State Management**: React hooks and server state management
- **Form Handling**: React Hook Form with Zod validation

#### Backend
- **Runtime**: Node.js (Next.js API routes)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **File Storage**: Local file system with base64 encoding/decoding
- **Email Service**: Brevo (Sendinblue) API integration
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Payment Processing**: Stripe webhook integration

#### Development Tools
- **Validation**: Zod schemas for type-safe validation
- **Geocoding**: Custom postcode-to-coordinate conversion
- **Image Processing**: Base64 image upload and processing
- **Real-time Communication**: FCM for mobile push notifications

## Core Business Domains

### User Management System
- **Multi-role Architecture**: Support for Players, Managers, Fans, and Referees
- **Progressive Signup**: Multi-step registration with invitation codes
- **Profile Management**: Comprehensive user profiles with performance metrics
- **Location Services**: Postcode-based geocoding for location-aware features

### Team & League Hierarchy
- **Hierarchical Structure**: Teams → Clubs → Leagues with nested relationships
- **Age Group Management**: Support for different age categories within teams
- **Ground Associations**: Geographic location tracking for venues
- **Invitation System**: Secure team joining through invitation codes

### Tournament Management
- **Tournament Lifecycle**: Creation, acceptance, and management workflows
- **Payment Integration**: Stripe-powered tournament fees and payments
- **Notification System**: Real-time updates via push notifications
- **Distance-based Filtering**: Location-aware tournament discovery

### Referee Management
- **Profile System**: Detailed referee profiles with qualifications
- **Dashboard**: Personalized referee dashboard with recommendations
- **Search & Discovery**: Advanced filtering and search capabilities

### E-commerce Integration
- **Product Catalog**: Store system with categorized products
- **Order Management**: Complete order lifecycle with image handling
- **Vendor Management**: Active vendor listings and management

## Application Structure

### `/app` Directory
The Next.js App Router structure containing:
- **API Routes**: RESTful endpoints under `/api/*`
- **Page Components**: Server and client components for UI
- **Layout System**: Nested layouts for different user roles
- **Loading & Error States**: Comprehensive error boundaries

### `/components` Directory
Reusable React components organized by:
- **UI Components**: Buttons, forms, modals, tables
- **Layout Components**: Headers, sidebars, navigation
- **Feature Components**: Domain-specific components (teams, tournaments, etc.)
- **Shared Components**: Common utilities and helpers

### `/lib` Directory
Core business logic and utilities:
- **Database Layer**: MongoDB connections and configurations
- **Authentication**: JWT utilities and middleware
- **External Services**: Firebase, Stripe, Brevo integrations
- **Helper Functions**: Geocoding, file processing, validation
- **Models**: Mongoose schemas and data models

### `/actions` Directory
Server actions for:
- **Data Mutations**: Create, update, delete operations
- **Form Submissions**: Server-side form processing
- **API Interactions**: External service communications
- **Business Logic**: Complex operations and workflows

## Key Features & Capabilities

### Advanced User Experience
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Progressive Enhancement**: Server-side rendering with client hydration
- **Real-time Updates**: Push notifications and live data updates
- **Offline Support**: Service worker integration for offline functionality

### Data Management
- **Complex Queries**: MongoDB aggregation pipelines for advanced filtering
- **Geospatial Operations**: Location-based queries and distance calculations
- **File Upload System**: Base64 encoding with secure file handling
- **Data Validation**: Comprehensive Zod schemas for all data operations

### Security & Performance
- **Authentication System**: JWT tokens with HTTP-only cookies
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Server and client-side validation
- **Performance Optimization**: Database indexing and query optimization

### Integration Capabilities
- **Payment Processing**: Stripe webhook handling for secure payments
- **Email Communications**: Brevo API for transactional emails
- **Push Notifications**: Firebase integration for mobile notifications
- **Geolocation Services**: Postcode geocoding for location features

## Development & Deployment

### Development Environment
- **Hot Reload**: Next.js development server with fast refresh
- **Type Safety**: TypeScript integration for better developer experience
- **Code Quality**: ESLint and Prettier for consistent code standards
- **Testing**: Unit and integration test suites

### Production Deployment
- **Build Optimization**: Next.js production builds with static generation
- **Database Scaling**: MongoDB clustering and indexing strategies
- **File Storage**: Cloud storage migration considerations
- **Monitoring**: Error tracking and performance monitoring

## Business Value

This platform delivers significant value by:
- **Streamlining Operations**: Automated workflows for sports management
- **Enhancing User Experience**: Intuitive interfaces for all user types
- **Ensuring Data Integrity**: Robust validation and security measures
- **Enabling Scalability**: Modular architecture for future growth
- **Supporting Multiple Stakeholders**: Comprehensive feature set for leagues, teams, and individuals

The Futy League Management System represents a modern, scalable solution for sports organization management, combining cutting-edge web technologies with domain-specific business logic to create a powerful platform for the sports industry.
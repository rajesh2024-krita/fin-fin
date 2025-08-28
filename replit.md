# Overview

Fintcs is a Finance Management System built as a full-stack application with a React frontend and Express.js backend. The system manages financial operations for societies including user management, member registration, loan processing, monthly demand calculations, voucher creation, and comprehensive reporting. It supports role-based access control with four distinct user roles: Super Admin, Society Admin, User, and Member.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod schema validation
- **Component Structure**: Feature-based organization with shared UI components

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful API structure with role-based authorization middleware
- **File Structure**: Modular separation of routes, storage layer, and database configuration

## Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations with schema definitions in shared directory
- **Key Entities**: 
  - Users with role-based access (SuperAdmin, SocietyAdmin, User, Member)
  - Societies with configuration settings
  - Members with personal and financial details
  - Loans with type categorization and payment tracking
  - Vouchers with line-item accounting
  - Monthly demand processing with header/row structure
- **Relationships**: Proper foreign key relationships between entities with cascade operations

## Authentication & Authorization
- **Token Strategy**: JWT tokens stored in localStorage
- **Password Security**: bcrypt hashing with salt rounds
- **Role-Based Access**: Middleware-enforced permissions at API level
- **Route Protection**: Frontend route guards based on user roles
- **Session Management**: Token-based stateless authentication

## Development Environment
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: ESLint and TypeScript compiler checks
- **Build Process**: Separate client and server build pipelines
- **Development Tools**: Replit-specific plugins for development environment

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **bcrypt**: Password hashing and verification
- **jsonwebtoken**: JWT token generation and verification

## UI & Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development tools
- **wouter**: Lightweight routing library for React

## Form & Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Validation resolver for React Hook Form

## Data Management
- **@tanstack/react-table**: Headless table library for data display
- **nanoid**: URL-safe unique ID generator
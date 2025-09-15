# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechStore is an e-commerce platform built with Next.js 15, React 19, and TypeScript. It's designed as a demonstration project for custom e-commerce development services, targeting small to medium businesses who want to eliminate platform fees and gain full control over their online store.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Database migrations with Drizzle
npx drizzle-kit generate  # Generate migrations from schema
npx drizzle-kit migrate   # Apply migrations to database
npx drizzle-kit studio    # Open Drizzle Studio GUI
```

## Architecture Overview

### Tech Stack
- **Frontend Framework**: Next.js 15.5.3 with App Router (fullstack)
- **UI Library**: React 19.1.0
- **Component Library**: shadcn/ui (Radix UI based)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript with strict mode enabled
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk.dev
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form with Zod validation
- **Font System**: Geist font family via next/font

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
  - `/api/` - API routes (auth, products, orders, customers, admin)
  - `/sign-in/` & `/sign-up/` - Clerk authentication pages
- `/src/components/` - Reusable React components
  - `/ui/` - shadcn/ui components
  - `/layout/` - Layout components (header, footer, navigation)
  - `/products/` - Product-related components
  - `/cart/` - Shopping cart components
  - `/checkout/` - Checkout flow components
  - `/admin/` - Admin dashboard components
- `/src/lib/` - Utility libraries and configurations
  - `/db/` - Drizzle ORM schema and database connection
  - `/api/` - API client utilities
  - `/utils/` - Helper functions
- `/src/store/` - Zustand state management stores
- `/src/types/` - TypeScript type definitions
- `/src/hooks/` - Custom React hooks
- `/public/` - Static assets (SVGs, images)
- `/ai_docs/` - Documentation for AI assistance and project planning
  - `technical/` - Technical specs, PRD, implementation plan
  - `business/` - Go-to-market strategy
- `/drizzle/` - Database migrations (auto-generated)

### Path Aliases
- `@/*` maps to `./src/*` for clean imports

## Key Business Context

The project implements a full e-commerce solution with:
- **Customer Features**: Product catalog, shopping cart, user authentication, order management, reviews
- **Admin Features**: Product/order/user management, analytics dashboard, category management
- **Target Market**: Small to medium businesses currently paying $12K-$50K annually in platform fees

## Database Schema (Implemented with Drizzle ORM)

The system uses PostgreSQL with Drizzle ORM. Core tables:
- **products** - Product catalog with pricing, SKU, stock management
- **customers** - User profiles linked to Clerk authentication
- **orders** - Order processing with status tracking
- **orderItems** - Individual items within orders
- **carts** - Shopping cart persistence
- **cartItems** - Items in shopping carts
- **adminUsers** - Admin users with role-based permissions

All tables include proper relations, timestamps, and UUID primary keys.

## Implementation Roadmap

**Week 1**: Foundation - Setup, authentication, product catalog
**Week 2**: Core Features - Shopping cart, order system, admin panel
**Week 3**: Polish - Search/filters, reviews, UI enhancements, deployment

## API Design Pattern

RESTful API endpoints following this structure:
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/cart/*` - Shopping cart operations
- `/api/orders/*` - Order processing
- `/api/admin/*` - Admin-only operations

## Development Notes

- The project uses Next.js App Router with React Server Components (fullstack architecture)
- TypeScript strict mode is enabled - ensure all types are properly defined
- Tailwind CSS v4 is configured with PostCSS
- Clerk handles all authentication - configure keys in `.env.local`
- Drizzle ORM manages database operations with type safety
- shadcn/ui components should be installed via CLI when needed
- Zustand stores persist cart data in localStorage
- **Current Status**: Core infrastructure setup complete (auth, database, state management)
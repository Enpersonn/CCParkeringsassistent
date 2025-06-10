# CC Parkeringsassistent

A modern, full-stack parking management system built with Remix, Supabase, and TypeScript. This application provides a comprehensive solution for managing parking facilities, user access, and parking operations with a focus on user experience and administrative control.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### User Management

- **Authentication & Authorization**

  - Secure email/password authentication via Supabase
  - Role-based access control (Admin/User)
  - Session management with secure token handling
  - User verification system for new registrations

- **User Profiles**
  - Personal information management
  - Profile picture support
  - Contact information
  - Parking preferences
  - Account settings

### Parking Management

- **Real-time Parking Operations**

  - parking spot availability tracking
  - Indoor and outdoor parking location management
  - Dynamic parking spot status updates

- **Reservation System**
  - Spot reservations

### Admin Dashboard

- **Comprehensive Management Tools**
  - User management and oversight
  - Parking spot configuration
  - Location management
  - parking request monitoring
  - Guest parking administration
  - Analytics and reporting
  - System configuration

## 🛠 Tech Stack

### Frontend

- **Framework**: [Remix](https://remix.run/) v2.16.8

  - Server-side rendering
  - File-based routing
  - Built-in data loading
  - Optimized asset handling

- **UI & Styling**

  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - [shadcn/ui](https://ui.shadcn.com/) for component library
  - Responsive design with mobile-first approach

- **State Management & Data Handling**
  - React Hooks for local state
  - Zod for schema validation
  - TanStack Table for data tables
  - Sonner for toast notifications

### Backend

- **Database & Authentication**: [Supabase](https://supabase.com/)
  - PostgreSQL database
  - Row Level Security (RLS)
  - Built-in authentication
  - Edge functions

### Development Tools

- **Language**: TypeScript 5.1.6
- **Package Manager**: pnpm
- **Code Quality**:
  - Biome for linting and formatting
  - TypeScript for type safety
- **Build Tools**:
  - Vite for development and building
  - PostCSS for CSS processing
  - Tailwind for styling
- **Performance Optimization**:
  - LRU Cache (lru-cache) for efficient data caching
  - Memory-efficient caching strategies
  - Optimized data retrieval for frequently accessed resources

## 📦 Project Structure

```
app/
├── components/         # Reusable UI components
│   ├── admin/         # Admin dashboard components
│   ├── app/           # Main application components
│   ├── general/       # Shared/common components
│   └── ui/            # Base UI components (shadcn/ui)
├── hooks/             # Custom React hooks
├── lib/               # Core libraries and utilities
│   ├── supabase/     # Supabase client and utilities
│   ├── auth/         # Authentication utilities
│   └── utils/        # Helper functions
├── routes/            # Application routes
│   ├── _app/         # Main application routes
│   ├── _auth/        # Authentication routes
│   ├── _app/admin/   # Admin dashboard routes
│   └── admin/        # Admin API endpoints
├── schemas/           # Zod validation schemas
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── view/              # View-specific components
```

### Route File Structure

Each route directory can contain the following files:

```
routes/
├── _app._index/            # Home route
│   ├── loader.ts           # Server-side data fetching
│   ├── action.ts           # Form submissions & data mutations
│   ├── route.tsx           # Main route component
│   └── table.tsx           # Table component (if needed)
├── _app.active-parking/    # Active parking route
│   ├── loader.ts           # Fetches active parking data
│   ├── action.ts           # Handles parking updates
│   └── route.tsx           # Renders active parking UI
├── auth.callback/          # Route with no loader or action
├── _auth/                  # Authentication routes
└── admin/                  # Admin routes
```

Note: Remix uses dot-based naming for routes (e.g., `_app._index`) rather than nested folders. This is different from Next.js's app router structure. The dot notation in the filename creates the same URL structure as nested folders would.

#### Route File Purposes

- **loader.ts**

  - Server-side function that runs before route rendering
  - Handles data fetching and preparation
  - Manages authentication and authorization
  - Implements caching strategies
  - Returns data to the route component

- **action.ts**

  - Handles form submissions and data mutations
  - Processes POST, PUT, DELETE, and PATCH requests
  - Manages database operations
  - Handles API endpoints
  - Returns responses to client actions

- **route.tsx**

  - Main React component for the route
  - Receives and displays data from loader
  - Implements page layout and UI
  - Manages user interactions
  - Integrates with action handlers

- **table.tsx**
  - Specialized component for tabular data
  - Implements TanStack Table functionality
  - Handles sorting, filtering, and pagination
  - Manages data formatting and display
  - Controls row selection and interactions

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended) or npm
- Git
- Supabase account and project
- Code editor (VS Code recommended)

### Installation

1. **Clone the Repository**

   ```bash
   git clone [repository-url]
   cd ccparkeringsassistent
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_API_KEY=your_admin_api_key

   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking

## 🔒 Authentication & Authorization

The application uses Supabase for authentication with the following features:

- **Authentication Methods**

  - Email/password authentication
  - Magic link authentication
  - Session management
  - Secure token handling

- **Authorization**
  - Role-based access control
  - User roles: Admin, Regular User
  - Row Level Security (RLS) policies
  - Protected routes and API endpoints

## 📊 Database Schema

The application uses the following main tables:

- `users` - User accounts
- `profiles` - profile information
- `parking_locations` - Parking facility locations
- `parking_spots` - Parking spot information
- `parking_requests` - Parking reservations
- `guests` - Guest parking management

## 🎨 UI Components

The application uses a modern component library built with:

- **Base Components**

  - Tables (TanStack Table)
  - Forms (React Hook Form)
  - Dialogs and Modals
  - Toast notifications (Sonner)
  - Data grids
  - Charts and graphs

- **Layout Components**
  - Responsive navigation
  - Dashboard layouts
  - Form layouts
  - Card components
  - Grid systems

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop browsers (1920px and below)
- Tablets (768px - 1024px)
- Mobile devices (320px - 767px)

## 🚀 Deployment

The application can be deployed to various platforms:

1. **Build the Application**

   ```bash
   pnpm build
   ```

2. **Deploy Options**
   - Vercel
   - Netlify
   - Self-hosted server
   - Docker container

## 📝 License

This project is private and proprietary. All rights reserved.

## 👤 Authors

- Nicklas Båkind-Øverjordet

## 🙏 Acknowledgments

- Remix team for the amazing framework
- Supabase team for the backend infrastructure
- shadcn/ui for the beautiful component library
- Isaac Z. Schlueter for the lru-cache package
- All other open-source contributors

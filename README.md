# CC Parkeringsassistent

A modern parking management system built with Remix, Supabase, and TypeScript. This application helps manage parking spots, users, and parking requests in a user-friendly interface.

## 🚀 Features

- **User Management**

  - User authentication and authorization
  - User verification system
  - Admin and regular user roles
  - Profile management

- **Parking Management**

  - Real-time parking spot availability
  - Indoor and outdoor parking locations
  - Parking spot reservations
  - Active parking tracking
  - Guest parking management

- **Admin Dashboard**
  - User management
  - Parking spot management
  - Location management
  - Parking request monitoring
  - Guest management
  - Real-time statistics

## 🛠 Tech Stack

- **Framework**: [Remix](https://remix.run/) (v2.16.8)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**:
  - [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Hooks
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## 📦 Project Structure

```
app/
├── components/         # Reusable UI components
│   ├── admin/         # Admin-specific components
│   ├── app/           # Main app components
│   ├── general/       # Shared components
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── routes/            # Application routes
│   ├── _app/          # Main app routes
│   ├── _auth/         # Authentication routes
│   ├── _app/admin/    # Admin routes
│   └── admin/         # Admin endpoints
├── schemas/           # Zod validation schemas
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── view/              # View-specific components
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended)
- Supabase account and project

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd ccparkeringsassistent
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_API_KEY=your_admin_api_key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking

## 🔒 Authentication

The application uses Supabase for authentication with the following features:

- Email/password authentication
- Session management
- Role-based access control (Admin/User)
- User verification system

## 🎨 UI Components

The application uses a combination of Radix UI primitives and shadcn/ui components, styled with Tailwind CSS. Key components include:

- Tables for data display
- Forms for data input
- Dialogs for confirmations
- Toast notifications
- Responsive layouts
- Dark/light mode support

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop browsers
- Tablets
- Mobile devices

## 📝 License

This project is private and proprietary. All rights reserved.

## 👥 Authors

- Your Nicklas Båkind-Øverjordet

## 🙏 Acknowledgments

- Remix team for the amazing framework
- Supabase team for the backend infrastructure
- shadcn/ui for the beautiful component library
- All other open-source contributors

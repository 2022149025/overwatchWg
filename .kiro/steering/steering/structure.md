# Project Structure

## Architecture

Next.js App Router architecture with server/client component separation. Clerk handles authentication, Supabase manages data persistence.

## Directory Layout

```
/app                    # Next.js App Router (primary)
  /actions              # Server actions
  /api                  # API routes
  /components           # React components
  /dashboard            # Dashboard page
  /gallery              # Gallery page
  /generate             # Generation page
  /hooks                # React hooks
  /login, /signup       # Auth pages
  /profile              # User profile
  layout.tsx            # Root layout with Clerk + Analytics
  page.tsx              # Home page
  globals.css           # Global styles

/lib                    # Shared utilities
  supabase.ts           # Supabase client (client/admin)
  supabase-helpers.ts   # Database helpers
  types.ts              # Shared TypeScript types
  features.ts           # Feature flags
  *Service.ts           # Service modules

/src                    # Legacy Vite app (being phased out)
  /components
  /services
  /views

/supabase
  /migrations           # Database migrations

/docs                   # Documentation
/public                 # Static assets
```

## Key Patterns

### Supabase Client Usage

- **Client-side**: Use `getSupabaseClient()` in Client Components
- **Server-side**: Use `getSupabaseAdmin()` in Server Components/Actions
- Admin client bypasses RLS - always validate user access

### Authentication

- Middleware protects routes (see `middleware.ts`)
- Public routes: `/`, `/login`, `/signup`, `/api/webhooks`
- All other routes require authentication via Clerk

### Component Organization

- Server Components by default (Next.js 15)
- Client Components marked with `'use client'`
- Shared components in `/app/components`
- Page-specific components in page directories

### Styling

- Tailwind utility classes
- Dark theme (gray-900 background)
- Responsive design with mobile-first approach

### Database Schema

Tables: `users`, `images`, `prompts`, `generations`, `user_api_keys`
- All tables use UUID primary keys
- Foreign keys reference `users.id`
- Timestamps: `created_at`, `updated_at`

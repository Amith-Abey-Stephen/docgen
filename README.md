# DocGen

DocGen is a monolithic Next.js 15 application for report creation and platform management. It combines the public site, member workspace, admin tools, and a super-admin control plane in one App Router codebase.

## What It Includes

- Public landing, login, and signup flows
- Member report creation, history, and account settings
- Admin dashboards for organization-scoped user and report management
- Super-admin platform management for users, organizations, settings, audit logs, stats, and analytics
- Next.js route handlers for auth and all internal APIs
- MongoDB via Mongoose for persistence and automatic seed data
- Cookie-based session auth with middleware route protection
- Tailwind CSS UI with React Query data hooks

## Current Architecture

The old split frontend/backend structure has been consolidated into a single Next.js app. The active runtime code lives in:

- `src/app`
- `src/components`
- `src/hooks`
- `src/lib`
- `public`

Legacy folders from the pre-migration setup are no longer needed for runtime and can be removed when you want a cleaner repository history:

- `client/`
- `server/`
- `shared/`
- `script/`
- `monolithic-nextjs/`
- `vite.config.ts`
- `components.json`
- `tsc_output.txt`

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- MongoDB / Mongoose
- Zod
- Radix UI
- Framer Motion
- Recharts

## Core Roles

- `member`: create reports, view history, manage own profile settings
- `admin`: review organization-scoped users and reports
- `super_admin`: manage the full platform, including users, organizations, settings, analytics, and audit logs

## Major Features

- Public auth with login, signup, logout, and current-session lookup
- Member dashboard with report creation and report history
- Admin overview, member listing, and report listing
- Super-admin overview with platform-wide stats
- User CRUD with role assignment and organization assignment
- Organization CRUD with active/inactive status
- Site settings CRUD
- Audit logs for auth and management actions
- Analytics charts for role breakdown, organization status, and report activity timeline
- Seeded demo data and default platform records
- Middleware-based access control for member, admin, and super-admin routes

## Folder Structure

```text
src/
  app/
    api/
      admin/
      auth/
      reports/
      super-admin/
    admin/
    dashboard/
    login/
    signup/
    super-admin/
    globals.css
    layout.tsx
    page.tsx
  components/
    layout/
    ui/
    providers.tsx
  hooks/
    use-admin.ts
    use-auth.ts
    use-reports.ts
    use-super-admin.ts
    use-toast.ts
  lib/
    http.ts
    mongodb.ts
    queryClient.ts
    schema.ts
    session.ts
    storage.ts
public/
middleware.ts
next.config.ts
postcss.config.js
tailwind.config.ts
tsconfig.json
```

## How It Works

### Frontend

- App Router pages in `src/app` render the public site plus the member, admin, and super-admin dashboards
- Shared layout and UI primitives live under `src/components`
- Client-side API integration is handled through React Query hooks in `src/hooks`

### Backend

- API endpoints are implemented as Next route handlers in `src/app/api`
- MongoDB connectivity is centralized in `src/lib/mongodb.ts`
- Business logic, seed routines, and data access are handled in `src/lib/storage.ts`
- Session creation and cookie handling live in `src/lib/session.ts`

### Auth And Authorization

Authentication uses cookie sessions:

- `docgen_session` stores the logged-in user id
- `docgen_role` stores the logged-in role

Protected route groups:

- `/dashboard/*` requires an authenticated user
- `/admin/*` requires `admin` or `super_admin`
- `/super-admin/*` requires `super_admin`

The admin APIs are scoped to the admin's organization. Full platform management is reserved for super admins.

## Environment Variables

The app currently requires one environment variable:

- `DATABASE_URL`

Example:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/docgen
```

Use [.env.example](/d:/Main%20Project/Anirudhan/docgen/.env.example) as the template.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env
```

Then set `DATABASE_URL` to your MongoDB connection string.

### 3. Run development

```bash
npm run dev
```

### 4. Type-check

```bash
npm run check
```

### 5. Build production

```bash
npm run build
```

### 6. Start production mode

```bash
npm run start
```

## Available Scripts

- `npm run dev` starts Next.js in development mode
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run check` runs TypeScript type-checking

## Application Routes

### Public

- `/`
- `/login`
- `/signup`

### Member

- `/dashboard`
- `/dashboard/create`
- `/dashboard/history`
- `/dashboard/settings`

### Admin

- `/admin`
- `/admin/create`
- `/admin/members`
- `/admin/reports`
- `/admin/settings`

### Super Admin

- `/super-admin`
- `/super-admin/users`
- `/super-admin/organizations`
- `/super-admin/analytics`
- `/super-admin/audit-logs`
- `/super-admin/settings`

## API Routes

### Auth

- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Reports

- `GET /api/reports`
- `POST /api/reports`

### Admin

- `GET /api/admin/members`
- `GET /api/admin/reports`

### Super Admin

- `GET /api/super-admin/stats`
- `GET /api/super-admin/analytics`
- `GET /api/super-admin/users`
- `POST /api/super-admin/users`
- `PATCH /api/super-admin/users/:id`
- `DELETE /api/super-admin/users/:id`
- `GET /api/super-admin/organizations`
- `POST /api/super-admin/organizations`
- `PATCH /api/super-admin/organizations/:id`
- `DELETE /api/super-admin/organizations/:id`
- `GET /api/super-admin/settings`
- `PATCH /api/super-admin/settings`
- `GET /api/super-admin/audit-logs`

## Seed Data

On first use, the app seeds baseline records if the database is empty.

Seeded users:

- `member@example.com` / `password`
- `admin@example.com` / `password`
- `superadmin@example.com` / `password`

Seeded platform records:

- a default organization
- default site settings

Seed logic lives in [src/lib/storage.ts](/d:/Main%20Project/Anirudhan/docgen/src/lib/storage.ts).

## Site Settings

Super admins can manage platform-level settings, including:

- platform name
- support email
- default organization name
- maintenance mode
- public signup availability
- default user role
- organization requirement for new users

These settings directly affect auth and user-creation behavior.

## Audit Logging

The platform records management and auth activity for auditing. Current log coverage includes:

- login
- logout
- registration
- user create, update, and delete
- organization create, update, and delete
- site settings updates

Audit logs are exposed in the super-admin dashboard and via `GET /api/super-admin/audit-logs`.

## Important Notes

### Passwords Are Demo-Only

Passwords are currently stored and compared directly. Replace this with hashed passwords before any real production use.

### Sessions Are Simple Cookies

The app stores user id and role in cookies. For production, use stronger session signing, expiration strategy, and invalidation.

### Admin Scope Matters

Admin access is intentionally narrower than super-admin access. Use the super-admin routes and APIs for platform-wide operations.

### Tailwind In Production

If styles work locally but not on Vercel, verify that `tailwind.config.ts`, `postcss.config.js`, and `src/app/globals.css` are committed and that the deployment is using the current monolithic Next.js root.

## Suggested Cleanup

If you want to fully finalize the migration, remove the legacy folders listed above and keep the repo centered on the Next.js app only.

Recommended keep set:

- `src/`
- `public/`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `next-env.d.ts`
- `middleware.ts`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `.env.example`
- `.gitignore`
- `README.md`

## Verification

Recent verification for this codebase has been done with:

- `npm run check`

## Next Improvements

- Replace plain-text passwords with hashing
- Add stronger session management
- Add tests for auth, APIs, and middleware
- Add organization membership workflows from the admin UI
- Remove legacy migration leftovers from git completely

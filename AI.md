# Content Creator Dashboard

## Project Overview
This is a modern Content Creator Dashboard built with Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui components, Prisma + PostgreSQL, and OpenAI API integration. The dashboard helps content creators generate blog posts and social media captions using AI, while tracking engagement metrics.

## Technology Stack
- Next.js 15.3.2 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui component library
- Prisma ORM with PostgreSQL
- Auth.js (NextAuth.js v5) for authentication
- OpenAI API for content generation
- Framer Motion for animations
- i18next for internationalization

## Project Structure
- `/src/app` - Next.js App Router pages and layouts
  - `/(dashboard)` - Dashboard routes (protected)
  - `/api` - API routes
  - `/auth` - Authentication-related pages
  - `/login` - Login page
  - `/register` - Registration page
  - `/privacy` - Privacy Policy page
  - `/terms` - Terms of Service page
- `/src/components` - Reusable React components
  - `/ui` - shadcn/ui components
  - `/dashboard` - Dashboard-specific components
  - `/auth` - Authentication components
  - `/tools` - Tool-specific components
- `/src/lib` - Utility functions and shared code
  - `auth.ts` - Auth.js configuration
  - `prisma.ts` - Prisma client
  - `translations.ts` - i18n translations
  - `utils.ts` - Utility functions
- `/src/hooks` - Custom React hooks
- `/src/context` - React Context providers
- `/src/types` - TypeScript types and interfaces
- `/prisma` - Prisma schema and migrations

## Authentication Flow
1. User visits the site and is redirected to `/login` if not authenticated
2. User can register a new account at `/register`
3. User can log in with email/password (OAuth providers are planned for future implementation)
4. After successful authentication, user is redirected to the dashboard
5. Protected routes check for valid session before rendering
6. Middleware ensures unauthenticated users are redirected to login

## Data Models
- User - Stores user information and authentication details
- Account - Stores OAuth account information
- Session - Stores user session information
- VerificationToken - Stores tokens for email verification
- Generation - Stores AI-generated content (blog posts, captions)
- EngagementMetric - Stores engagement metrics for analytics

## Key Features
- Authentication with Auth.js (NextAuth.js v5)
- User registration with password hashing
- Dashboard with engagement metrics visualization
- Blog Post Generator with OpenAI GPT-4o-mini integration
- Social Caption Generator with platform-specific outputs
- Dark/light theme toggle
- Responsive design for all screen sizes
- Comprehensive i18n support for all text content
- Loading states with spinners for better UX
- Form validation with translated error messages
- Automatic saving of generated content

## Development Status
- Project setup complete
- Authentication implemented with email/password
- Dashboard layout and navigation implemented
- Blog Post Generator implemented
- Social Caption Generator implemented
- Theme switching implemented
- i18n support implemented
- Responsive design implemented

## API Integration
- OpenAI API for content generation using GPT-4o-mini model
- Simulated streaming responses for real-time feedback
- Error handling for API failures
- Optional description field for better AI generation results
- Automatic saving of generated content to database

## Database
- PostgreSQL with Prisma ORM
- Proper indexing for performance
- Secure data storage with proper relations
- Password hashing for security
- Robust connection management to prevent "prepared statement does not exist" errors
- Automatic reconnection logic for serverless environments

## Internationalization
- All text content uses i18n translations
- Form validation messages are translated
- English is the default language
- Structure in place for adding more languages

## User Experience
- The application includes several UX enhancements:
  - Loading spinners for all async operations
  - Toast notifications for feedback
  - Form validation with helpful error messages
  - Dark/light theme toggle
  - Responsive design for all screen sizes
  - Smooth animations between pages
  - Success animations for form submissions
  - Animated testimonials with typing effect
  - Empty state illustrations and messages
  - Beautiful charts with proper theming
  - Rotating loading messages during transitions
  - Sidebar animations for mobile navigation
  - Proper contrast in both light and dark themes
  - Visual feedback for form errors
  - Privacy Policy and Terms of Service pages with client-side back navigation
  - Legal pages accessible from auth screens with proper centering
  - Custom BackButton component for safe navigation

## Code Quality
- The codebase follows best practices:
  - Comprehensive JSDoc comments
  - Detailed bug fixes documentation
  - Consistent component structure
  - Proper error handling
  - Accessibility considerations
  - Type safety with TypeScript
  - Responsive design patterns
  - Separation of concerns
  - Reusable components
  - Performance optimizations
  - Robust database connection management
  - Graceful error recovery with retry mechanisms

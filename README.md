# Content Creator Dashboard

A modern dashboard for content creators to generate blog posts and social media captions using AI, while tracking engagement metrics.

## Features

- 🔐 Authentication with email/password and OAuth
- 📊 Dashboard with engagement metrics visualization
- ✍️ AI-powered blog post generator
- 📱 Social media caption generator
- 🌓 Dark/light theme toggle
- 📱 Responsive design for all screen sizes
- 🌐 i18n support for internationalization

## Tech Stack

- Next.js 15.3.2 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Prisma ORM with PostgreSQL
- Auth.js (NextAuth.js v5)
- OpenAI API
- Framer Motion
- i18next for internationalization

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/content-creator-dashboard.git
cd content-creator-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your own values.

5. Set up the database:

```bash
npx prisma migrate dev --name init
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and shared code
- `/src/hooks` - Custom React hooks
- `/src/context` - React Context providers
- `/src/types` - TypeScript types and interfaces
- `/prisma` - Prisma schema and migrations

## Authentication

The application uses Auth.js (NextAuth.js v5) for authentication. Users can sign in with:

- Email and password
- Google OAuth (coming soon)
- GitHub OAuth (coming soon)

The authentication flow includes:

1. User registration with password hashing
2. Secure login with JWT tokens
3. Protected routes with middleware
4. Session management

## Database Schema

The application uses Prisma ORM with PostgreSQL. The main models are:

- `User` - Stores user information and authentication details
- `Account` - Stores OAuth account information
- `Session` - Stores user session information
- `VerificationToken` - Stores tokens for email verification
- `Generation` - Stores AI-generated content (blog posts, captions)
- `EngagementMetric` - Stores engagement metrics for analytics

## Internationalization

All text content in the application is internationalized using i18next:

- Form labels and buttons
- Error messages and notifications
- Form validation messages
- Dashboard content

The application is structured to easily add more languages in the future.

## User Experience

The application includes several UX enhancements:

- Loading spinners for all async operations
- Toast notifications for feedback
- Form validation with helpful error messages
- Dark/light theme toggle
- Responsive design for all screen sizes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Checkpoint

A GitHub analytics dashboard that visualizes your coding activity and repository statistics. Built with Next.js 15, TypeScript, and Tailwind CSS on the GitHub GraphQL API.

## Features

- 📊 Interactive contribution calendar with year navigation
- 📈 Language distribution analytics and insights
- 🔄 Real-time GitHub data sync via GraphQL
- 🔒 Secure GitHub OAuth integration
- 📱 Device flow support for CLI authentication
- 🔄 Automatic token refresh and session management

## Quick Start

1. Clone and install:
```bash
git clone https://github.com/jayrichh/checkpoint-self.git
cd checkpoint-self
npm install
```

2. Set up GitHub OAuth:
- Create OAuth App in GitHub Developer Settings
- Set Homepage URL to `https://checkpoint-self.vercel.app` (or your domain)
- Set Authorization callback URL to `https://checkpoint-self.vercel.app/api/auth/callback`
- Enable Device Flow if needed
- Create `.env.local` from `.env.example`
- Add OAuth credentials and demo token

3. Run it:
```bash
npm run dev
```

## Authentication

### OAuth Integration
- Web-based OAuth flow with automatic token refresh
- Device flow support for CLI authentication
- Application-level auth for demo mode using PAT
- Secure token storage and management
- Background token refresh handling

### GraphQL API Integration
- Uses GitHub GraphQL API v4 for efficient data fetching
- Batched queries for contribution data and repository stats
- Real-time data synchronization with rate limiting
- Optimized query patterns for performance
- Cached responses for improved load times

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   └── auth/          # Auth endpoints
│   └── github/           # GitHub analytics pages
├── components/            # React components
├── lib/                  # Utilities and services
└── types/               # TypeScript types
```

## Tech Stack

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- GitHub GraphQL API v4
- Framer Motion animations
- Nivo data visualization
- Zustand state management

## Development

### Environment Variables
```env
NEXT_PUBLIC_GITHUB_CLIENT_ID=   # OAuth Client ID
GITHUB_CLIENT_SECRET=           # OAuth Secret
NEXT_PUBLIC_GITHUB_TOKEN=       # Demo PAT
NEXT_PUBLIC_APP_URL=           # App URL
```

### Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # Run ESLint
```

### Key Files
- `src/lib/auth.ts`: Authentication logic
- `src/lib/github.ts`: GraphQL API integration
- `src/app/api/auth/*`: Auth endpoints
- `src/app/github/page.tsx`: Analytics dashboard

## License

MIT

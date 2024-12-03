# Committed

A GitHub analytics dashboard that visualizes your coding activity and repository statistics. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📊 Interactive contribution calendar
- 📈 Language distribution analytics
- 🔄 Real-time GitHub data sync
- 🌓 Dark mode support
- 📱 Responsive design
- 🔒 Secure GitHub OAuth integration
- 📱 Device flow support for CLI authentication
- 🔄 Token refresh and session management

## Setup

1. Clone the repository:
```bash
git clone https://github.com/jayrichh/committed.git
cd committed
```

2. Install dependencies:
```bash
npm install
```

3. Create a GitHub OAuth App:
- Go to GitHub Settings > Developer settings > OAuth Apps > New OAuth App
- Set Homepage URL to `https://committed.vercel.app` (or your domain)
- Set Authorization callback URL to `https://committed.vercel.app/api/auth/callback`
- Enable Device Flow in your OAuth App settings if you want to support CLI authentication
- Copy the Client ID and Client Secret

4. Create a Personal Access Token for demo profile:
- Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
- Generate a new token with the following scopes:
  - `repo`
  - `read:user`
- Copy the token

5. Create a `.env.local` file:
```env
# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Personal token for demo profile
NEXT_PUBLIC_GITHUB_TOKEN=your_personal_access_token

# App URLs
NEXT_PUBLIC_APP_URL=https://committed.vercel.app
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_GITHUB_CLIENT_ID`: GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth App Client Secret
- `NEXT_PUBLIC_GITHUB_TOKEN`: Personal Access Token for demo profile
- `NEXT_PUBLIC_APP_URL`: Your app's URL (e.g., https://committed.vercel.app)

## Authentication Flows

### Web OAuth Flow
1. User clicks "Connect GitHub"
2. User is redirected to GitHub for authorization
3. After authorization, user is redirected back with a code
4. Code is exchanged for access and refresh tokens
5. User data is loaded using the access token

### Device Flow (for CLI)
1. App requests device code from GitHub
2. User enters code on GitHub's device activation page
3. App polls for token until user completes activation
4. Access and refresh tokens are stored securely

### Token Refresh
- Access tokens expire after 8 hours
- Refresh tokens are used to obtain new access tokens
- Token refresh is handled automatically in the background

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Nivo](https://nivo.rocks/)
- [Zustand](https://github.com/pmndrs/zustand)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   └── auth/          # Auth endpoints
│   └── github/           # GitHub analytics pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── Navigation.tsx    # Main navigation
├── lib/                  # Utilities and services
│   ├── auth.ts          # Authentication logic
│   └── github.ts        # GitHub API integration
└── types/               # TypeScript types
```

## Development

### Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Key Files

- `src/lib/auth.ts`: Authentication logic and state management
- `src/lib/github.ts`: GitHub API integration and data fetching
- `src/app/api/auth/*`: Authentication API routes
- `src/app/github/page.tsx`: Main analytics dashboard

## License

MIT

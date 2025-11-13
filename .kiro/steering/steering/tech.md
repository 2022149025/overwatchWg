# Tech Stack

## Framework & Build System

- **Framework**: Next.js 15 (App Router)
- **Build Tool**: Next.js (primary), Vite (legacy support)
- **Runtime**: Node.js
- **Language**: TypeScript 5.8

## Core Dependencies

- **React**: 19.2.0
- **Authentication**: @clerk/nextjs
- **Database**: @supabase/supabase-js
- **AI**: @google/genai (Gemini)
- **Styling**: Tailwind CSS 3.4
- **Analytics**: @vercel/analytics
- **File Processing**: jszip

## Development Tools

- **Linting**: ESLint with Next.js config
- **CSS**: PostCSS + Autoprefixer
- **Type Checking**: TypeScript strict mode

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npm run dev:vite         # Start Vite dev server (legacy)

# Build & Deploy
npm run build            # Production build
npm start                # Start production server
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## API Integration

- **PixelLab API**: `https://api.pixellab.ai` (pixel art generation)
- **Gemini API**: Prompt translation and enhancement
- Rate limiting: 500ms delay between API calls

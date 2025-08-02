This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## TMC Frontend - Travel Management Console

A modern travel planning and itinerary management application built with Next.js, React, and TypeScript.

### Features

- Interactive travel itinerary planning
- User preferences and profile management
- Dynamic destination recommendations
- Responsive design with modern UI components
- 3D visualizations with React Three Fiber

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Deployment on Vercel

This project is optimized for deployment on Vercel. Follow these steps:

### Option 1: Deploy from Git Repository

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Configure environment variables if needed
5. Deploy!

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

Make sure to set these environment variables in your Vercel dashboard:

- `NEXTAUTH_URL`: Your production domain
- `NEXTAUTH_SECRET`: A secure random string
- Any other API keys or secrets your app requires

The deployment is automatically configured with the included `vercel.json` file.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── itinerary/         # Itinerary pages
│   ├── preferences/       # User preferences
│   ├── profile/           # User profile
│   ├── signin/            # Authentication
│   └── signup/            # User registration
├── components/            # Reusable UI components
├── lib/                   # Utility functions
└── assets/               # Static assets
```

## Tech Stack

- **Framework**: Next.js 15.4.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind
- **3D Graphics**: React Three Fiber
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

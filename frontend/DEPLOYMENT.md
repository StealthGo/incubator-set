# Deployment Guide for The Modern Chanakya Frontend

This guide will help you deploy the frontend application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Backend Deployed**: Ensure your backend is deployed and accessible
3. **Environment Variables**: Have your production API URLs ready

## Step 1: Environment Variables Setup

1. Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the environment variables in `.env.local`:
   ```bash
   # Next.js Configuration
   NEXTAUTH_URL=https://your-frontend-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Backend API URL - Update this with your deployed backend URL
   NEXT_PUBLIC_API_URL=https://your-backend-api.herokuapp.com
   ```

## Step 2: Vercel Deployment

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the frontend directory:
   ```bash
   cd frontend
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new
   - Set up environment variables when prompted

### Option B: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New..." → "Project"

4. Import your repository

5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.next`

6. Add Environment Variables in Vercel Dashboard:
   - `NEXTAUTH_URL`: https://your-frontend-domain.vercel.app
   - `NEXTAUTH_SECRET`: your-nextauth-secret-key-here
   - `NEXT_PUBLIC_API_URL`: https://your-backend-api.herokuapp.com

7. Click "Deploy"

## Step 3: Post-Deployment Configuration

1. **Custom Domain** (Optional):
   - Go to your project settings in Vercel
   - Add your custom domain
   - Update `NEXTAUTH_URL` environment variable

2. **CORS Configuration**:
   - Update your backend CORS settings to include your Vercel domain
   - Example domains to allow:
     - `https://your-app.vercel.app`
     - `https://your-custom-domain.com`

3. **Backend URL**:
   - Ensure `NEXT_PUBLIC_API_URL` points to your production backend
   - Test API connectivity from the deployed frontend

## Step 4: Verification

1. Visit your deployed URL
2. Test the following features:
   - User registration/login
   - Chat conversation flow
   - Itinerary generation
   - Profile management

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Frontend deployment URL | `https://myapp.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | `your-secret-key` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.myapp.com` |

## Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run type-check`
- Check ESLint errors: `npm run lint`
- Review build logs in Vercel dashboard

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS configuration
- Ensure backend is accessible from Vercel's servers

### Image Loading Issues
- Verify image domains in `next.config.ts`
- Check if external image sources are accessible

## Performance Optimization

The frontend is configured with:
- Image optimization via Next.js
- Automatic code splitting
- Compression enabled
- Optimized package imports
- Static generation where possible

## Monitoring

Consider adding:
- **Error Tracking**: Sentry or similar
- **Analytics**: Google Analytics or Vercel Analytics
- **Performance Monitoring**: Core Web Vitals tracking

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for client-side errors
3. Verify environment variables are set correctly
4. Test API endpoints directly

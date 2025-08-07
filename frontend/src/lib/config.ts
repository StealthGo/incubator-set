// Production configuration for environment variables
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Auth Configuration
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  
  // Feature Flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // External Services
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  
  // Error Tracking
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// Validate required environment variables in production
if (config.isProduction) {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

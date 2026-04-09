/**
 * Application Configuration
 * Central configuration file for the application
 */

// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_APP_ENV',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_FEATURE_ANALYTICS',
  'NEXT_PUBLIC_FEATURE_DEBUG',
  'NEXT_PUBLIC_AUTH_ENABLED',
] as const;

// Validate required environment variables
function validateEnvironment() {
  const missingVars: string[] = [];
  const emptyVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (value === undefined) {
      missingVars.push(varName);
    } else if (value === '') {
      emptyVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error(
      '❌ ERROR: Missing required environment variables:',
      missingVars.join(', ')
    );
    console.error(
      '   Please check your .env file and ensure all required variables are defined.'
    );
  }

  if (emptyVars.length > 0) {
    console.error(
      '❌ ERROR: Empty required environment variables:',
      emptyVars.join(', ')
    );
    console.error(
      '   These variables are defined but have empty values. Please provide valid values.'
    );
  }

  // Warn about empty optional variables
  const emptyOptionalVars: string[] = [];
  optionalEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (value === '') {
      emptyOptionalVars.push(varName);
    }
  });

  if (emptyOptionalVars.length > 0) {
    console.warn(
      '⚠️  WARNING: Empty optional environment variables:',
      emptyOptionalVars.join(', ')
    );
    console.warn(
      '   These variables will use default values. Set them explicitly if needed.'
    );
  }

  // Display summary
  if (missingVars.length === 0 && emptyVars.length === 0) {
    console.log('✅ All required environment variables are configured');
  } else {
    console.error(
      `\n❌ Configuration Error: ${missingVars.length + emptyVars.length} required environment variable(s) need attention\n`
    );
  }
}

// Run validation
validateEnvironment();

export const appConfig = {
  app: {
    name: 'App',
    description: 'Application',
    version: '1.0.0',
    env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:44346/api',
    timeout: 30000,
  },
  auth: {
    enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
    debug: process.env.NEXT_PUBLIC_FEATURE_DEBUG === 'true',
  },
} as const;

export type AppConfig = typeof appConfig;
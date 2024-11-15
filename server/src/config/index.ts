import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing.`);
  }
  return value;
};

export const cookieMaxAge =
  +process.env.COOKIE_MAX_AGE || 90 * 24 * 60 * 60 * 1000;
export const jwtSecret = getEnvVariable('JWT_SECRET');
export const accessTokenTtl = process.env.ACCESS_TOKEN_TTL || '60m';
export const refreshTokenTtl = process.env.REFRESH_TOKEN_TTL || '90d';
export const googleClientId = getEnvVariable('GOOGLE_CLIENT_ID');
export const googleClientSecret = getEnvVariable('GOOGLE_CLIENT_SECRET');
export const googleOAuthRedirectUrl = getEnvVariable(
  'GOOGLE_OAUTH_REDIRECT_URL'
);
export const origin = getEnvVariable('ORIGIN');

import dotenv from 'dotenv';

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET as string;
export const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

import { createCookieSessionStorage } from '@remix-run/node';

if (!process.env.SESSION_SECRET) throw new Error('Must provide session secret');

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365 * 100,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

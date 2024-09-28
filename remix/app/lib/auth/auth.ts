import { redirect, Session } from '@remix-run/node';
import { commitSession, getSession } from './session.server';
import { AuthorizationError } from 'remix-auth';
import { refreshTokens } from '~/services/auth.service';

export const checkSessionExists = async (request: Request) => {
  const session = await getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user?.accessToken) return false;
  return true;
};

export const authenticate = async (
  request: Request,
  session: Session,
  headers = new Headers()
) => {
  const user = session.get('user');

  try {
    if (!user?.accessToken) throw redirect('/login');

    if (new Date(user.expirationDate) < new Date()) {
      throw new AuthorizationError('Expired');
    }

    return user.accessToken;
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      const { accessToken, refreshToken, expirationDate } = await refreshTokens(
        user?.refreshToken
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.expirationDate = expirationDate;
      session.set('user', user);

      headers.append('Set-Cookie', await commitSession(session));
      if (request.method === 'GET') throw redirect(request.url, { headers });
      return accessToken;
    }
    throw error;
  }
};

import { redirect, Session } from '@remix-run/node';
import { commitSession, getSession } from './session.server';
import { AuthorizationError } from 'remix-auth';

export const checkUserSession = async (request: Request) => {
  const session = await getSession(request.headers.get('cookie'));
  const user = session.get('user');
  console.log({ user });
  if (!user?.accessToken) return false;
  // future external api check
  return true;
};

export const authenticate = async (
  request: Request,
  session: Session,
  headers = new Headers()
) => {
  try {
    const user = session.get('user');

    if (!user?.accessToken) throw redirect('/login');

    if (new Date(user.expirationDate) < new Date()) {
      throw new AuthorizationError('Expired');
    }

    return user.accessToken;
  } catch (error: any) {
    // if (error instanceof AuthorizationError) {
    //   let { accessToken, refreshToken, expirationDate } = await refreshToken(
    //     session.get('refreshToken')
    //   );
    //   session.set('accessToken', accessToken);
    //   session.set('refreshToken', refreshToken);
    //   session.set('expirationDate', expirationDate);
    //   headers.append('Set-Cookie', await commitSession(session));
    //   if (request.method === 'GET') throw redirect(request.url, { headers });
    //   return accessToken;
    // }
    // throw error;
  }
};

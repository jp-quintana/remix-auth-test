import { getSession } from '~/lib/auth/session.server';

export const checkUserSession = async (request: Request) => {
  const session = await getSession(request.headers.get('cookie'));
  const user = session.get('user');
  console.log({ user });
  if (!user?.accessToken) return false;
  // future external api check
  return true;
};

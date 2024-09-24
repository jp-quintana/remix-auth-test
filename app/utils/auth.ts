import { getSession } from '~/lib/auth/session.server';

export const checkUserSession = async (request: Request) => {
  const session = await getSession(request.headers.get('cookie'));

  if (!session) return false;
  // future external api check
  return true;
};

import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { authenticate } from '~/lib/auth/auth';
import { getSession } from '~/lib/auth/session.server';
import { fetchUser } from '~/services/user.service';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('cookie'));
  const accessToken = await authenticate(request, session);
  const user = await fetchUser(accessToken);
  return null;
}

const AppLayout = () => {
  return <Outlet />;
};

export default AppLayout;

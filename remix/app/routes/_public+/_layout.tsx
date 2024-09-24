import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { checkUserSession } from '~/utils/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionExists = await checkUserSession(request);

  if (sessionExists) {
    return redirect('/app');
  }
  return null;
}

const PublicLayout = () => {
  return <Outlet />;
};

export default PublicLayout;

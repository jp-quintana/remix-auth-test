import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { checkSessionExists } from '~/lib/auth/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionExists = await checkSessionExists(request);

  if (sessionExists) {
    return redirect('/app');
  }
  return null;
}

const PublicLayout = () => {
  return <Outlet />;
};

export default PublicLayout;

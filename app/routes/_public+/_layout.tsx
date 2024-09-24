import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { checkUserSession } from '~/utils/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionExists = checkUserSession(request);
  // if (sessionExists) {

  // }
  return null;
}

const PublicLayout = () => {
  return <Outlet />;
};

export default PublicLayout;

import { Outlet } from '@remix-run/react';

export default function AuthRoute() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Outlet />
    </div>
  );
}

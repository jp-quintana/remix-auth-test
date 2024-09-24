import { Outlet } from '@remix-run/react';

export default function AuthRoute() {
  return (
    <div className="bg-red">
      <Outlet />
    </div>
  );
}

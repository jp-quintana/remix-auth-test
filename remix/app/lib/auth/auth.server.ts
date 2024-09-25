import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/lib/auth/session.server';
import { FormStrategy } from 'remix-auth-form';
import { login } from '~/services/auth/auth.service';

export interface User {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  };
}

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const user = await login(email, password);
    return user;
  }),
  'user-pass'
);

import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/services/session.server';
import { FormStrategy } from 'remix-auth-form';
import { login } from './auth/auth.service';

export interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email')!;
    const password = form.get('password')!;

    console.log(email, password);
    const user = await login(email, password);

    return user;
  }),
  'user-pass'
);

import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/lib/auth/session.server';
import { FormStrategy } from 'remix-auth-form';
import { login } from '~/services/auth.service';
import { GoogleStrategy as gs } from 'remix-auth-google';

export interface User {
  accessToken: string;
  refreshToken: string;
  expirationDate: string;
  user: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  };
}

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  const user = await login(email, password);
  return user;
});

const googleStrategy = new gs(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL as string,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const user = await login(profile.emails[0].value, 'placeholder');
    return user;
  }
);

export const authenticator = new Authenticator<User>(sessionStorage);
authenticator.use(formStrategy, 'user-pass');
authenticator.use(googleStrategy, 'google-auth');

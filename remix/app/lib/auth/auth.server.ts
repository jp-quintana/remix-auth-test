import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/lib/auth/session.server';
import { FormStrategy } from 'remix-auth-form';
import { login } from '~/services/auth.service';
// import { GoogleStrategy as gs } from 'remix-auth-google';

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

// const googleStrategy = new gs(
//   {
//     clientID: '',
//     clientSecret: '',
//     callbackURL: '',
//   },
//   async ({ accessToken, refreshToken, extraParams, profile }) => {
//     // Get the user data from your DB or API using the tokens and profile
//     return User.findOrCreate({ email: profile.emails[0].value });
//   }
// );

// export const authenticator = new Authenticator<User>(sessionStorage);
// authenticator.use(formStrategy, 'user-pass');
// // authenticator.use(googleStrategy, 'google-auth');

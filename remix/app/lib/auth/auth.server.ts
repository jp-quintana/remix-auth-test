import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/lib/auth/session.server';
import { FormStrategy } from 'remix-auth-form';
import { login } from '~/services/auth.service';
// import { OAuth2Strategy } from 'remix-auth-oauth2';

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

// authenticator.use(
//   new OAuth2Strategy<User, { provider: 'provider-name' }, { id_token: string }>(
//     {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string,

//       authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//       tokenEndpoint: 'https://oauth2.googleapis.com/token',
//       redirectURI: process.env.GOOGLE_OAUTH_REDIRECT_URL as string,

//       scopes: [
//         'https://www.googleapis.com/auth/userinfo.profile',
//         'https://www.googleapis.com/auth/userinfo.email',
//       ], // optional
//     },
//     async ({ tokens, profile, context, request }) => {
//       // here you can use the params above to get the user and return it
//       // what you do inside this and how you find the user is up to you
//       return await getUser(tokens, profile, context, request);
//     }
//   ),
//   'oauth-google'
// );

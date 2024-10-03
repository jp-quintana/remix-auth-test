import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/lib/auth/session.server';
import { FormStrategy } from 'remix-auth-form';
import { login } from '~/services/auth.service';
import { OAuth2Strategy } from 'remix-auth-oauth2';

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
//   new OAuth2Strategy<
//     User,
//     { providers: "provider-name" },
//     { id_token: string }
//   >(
//     {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET,

//       authorizationEndpoint: "https://provider.com/oauth2/authorize",
//       tokenEndpoint: "https://provider.com/oauth2/token",
//       redirectURI: process.env.GOOGLE_OAUTH_REDIRECT_URL,

//       tokenRevocationEndpoint: "https://provider.com/oauth2/revoke", // optional

//       codeChallengeMethod: "S256", // optional
//       scopes: ["openid", "email", "profile"], // optional

//       authenticateWith: "request_body", // optional
//     },
//     async ({ tokens, profile, context, request }) => {
//       // here you can use the params above to get the user and return it
//       // what you do inside this and how you find the user is up to you
//       return await getUser(tokens, profile, context, request);
//     },
//   ),
//   'oauth-google'
// );

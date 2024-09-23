import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { getSession } from '~/services/session.server';

const Login = () => {
  return (
    <div>
      <Form method="post">
        <input type="email" name="email" required />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <button>Sign In</button>
      </Form>
    </div>
  );
};

export default Login;

// export async function loader({ request }: LoaderFunctionArgs) {
//   let session = await getSession(request.headers.get('cookie'));
//   let error = session.get(authenticator.sessionErrorKey);
//   return json({ error });
// }

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
      throwOnError: true,
    });
  } catch (error: unknown) {
    return error;
  }
}

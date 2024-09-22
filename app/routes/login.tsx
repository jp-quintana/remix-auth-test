import { ActionFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

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

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('user-pass', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
}

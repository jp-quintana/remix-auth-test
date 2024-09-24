import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

const Login = () => {
  const data = useActionData<typeof action>();
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
        {data?.error && <p>{data.error}</p>}
      </Form>
    </div>
  );
};

export default Login;

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
      throwOnError: true,
    });
  } catch (error: any) {
    const { message } = error;
    return { error: message || 'Something went wrong' };
  }
}

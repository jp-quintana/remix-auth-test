import { ActionFunctionArgs } from '@remix-run/node';
import { Form, Form as RemixForm, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
import { authenticator } from '~/lib/auth/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/app',
      throwOnError: true,
    });
  } catch (error: any) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      const { message } = error;
      return { error: message || 'Something went wrong' };
    }
    console.error({ error });
    return 'Something went wrong';
  }
}

const Login = () => {
  const data = useActionData<typeof action>();
  return (
    <div className="flex flex-col gap-y-3">
      <p className="font-bold text-lg">Login</p>
      <RemixForm method="post" className="flex flex-col justify-center">
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" className="border" required />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="border"
          required
        />
        <button>Sign In</button>
        {data?.error && <p>{data.error}</p>}
      </RemixForm>
      <Form action="/auth/google" method="post" className="flex justify-center">
        <button>Login with Google</button>
      </Form>
    </div>
  );
};

export default Login;

import { ActionFunctionArgs } from '@remix-run/node';
import { Form as RemixForm, useActionData } from '@remix-run/react';
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
    <div>
      <RemixForm method="post">
        <input type="email" name="email" required />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <button>Sign In</button>
        {data?.error && <p>{data.error}</p>}
      </RemixForm>
    </div>
  );
};

export default Login;

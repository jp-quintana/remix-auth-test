import { ActionFunctionArgs } from '@remix-run/node';
import { Form as RemixForm, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
import { authenticator } from '~/lib/auth/auth.server';
import { signup } from '~/services/auth.service';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.clone().formData();

    const name = formData.get('name') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await signup({ name, lastName, email, password });

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

const Signup = () => {
  const data = useActionData<typeof action>();
  return (
    <div className="flex flex-col gap-y-3">
      <p className="font-bold text-lg">Sign up</p>
      <RemixForm method="post" className="flex flex-col justify-center">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" className="border" required />
        <label htmlFor="lastName">Last name:</label>
        <input type="text" name="lastName" className="border" required />
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
        <button>Sign Up</button>
        {data?.error && <p>{data.error}</p>}
      </RemixForm>
    </div>
  );
};

export default Signup;

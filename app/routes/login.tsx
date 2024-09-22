import { Form } from '@remix-run/react';

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

import { AuthorizationError } from 'remix-auth';
import { User } from '../../lib/auth/auth.server';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(process.env.API_URL! + 'auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error: any) {
    throw new AuthorizationError(error.message);
  }
};

export const signup = async (
  userDetails: Omit<User, 'accessToken'>
): Promise<void> => {
  try {
    const response = await fetch(process.env.API_URL! + 'auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
  } catch (error: any) {
    throw new AuthorizationError(error.message);
  }
};

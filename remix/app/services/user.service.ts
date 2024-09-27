import { AuthorizationError } from 'remix-auth';
import { User } from '~/lib/auth/auth.server';

export const fetchUser = async (token: string): Promise<User> => {
  try {
    const response = await fetch(process.env.API_URL! + 'user/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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

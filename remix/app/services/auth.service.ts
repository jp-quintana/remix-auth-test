import { AuthorizationError } from 'remix-auth';
import { User } from '~/lib/auth/auth.server';

interface CreateUserDetails {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

interface RefreshTokens {
  accessToken: string;
  refreshToken?: string;
  expirationDate: string;
}

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

    const payload = { ...data };

    // TODO: check future
    if (typeof window === 'undefined') {
      let refreshToken = '';
      const cookies = response.headers.get('Set-Cookie')!.split(';');

      for (const cookie of cookies) {
        if (cookie.trim().startsWith('refreshToken=')) {
          refreshToken = cookie.trim().substring('refreshToken='.length);
          break;
        }
      }

      payload.refreshToken = refreshToken;
    }

    return payload;
  } catch (error: any) {
    throw new AuthorizationError(error.message);
  }
};

export const signup = async (userDetails: CreateUserDetails): Promise<void> => {
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

export const refreshTokens = async (
  refreshToken?: string
): Promise<RefreshTokens> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (refreshToken) {
    headers['Cookie'] = `refreshToken=${refreshToken}`;
  }

  const response = await fetch(process.env.API_URL! + 'auth/refresh', {
    method: 'POST',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  const payload = { ...data };

  console.log({ payload });

  // TODO: check future
  if (typeof window === 'undefined') {
    let refreshToken = '';
    const cookies = response.headers.get('Set-Cookie')!.split(';');

    for (const cookie of cookies) {
      if (cookie.trim().startsWith('refreshToken=')) {
        refreshToken = cookie.trim().substring('refreshToken='.length);
        break;
      }
    }

    payload.refreshToken = refreshToken;
  }

  return payload;
};

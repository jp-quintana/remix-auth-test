import { AuthorizationError } from 'remix-auth';
import { User } from '../../lib/auth/auth.server';

import DUMMY_USERS from '~/data/users.json';

export const login = async (email: string, password: string): User => {
  const user = DUMMY_USERS.find((user) => user.email === email);

  if (!user) throw new AuthorizationError('User does not exist');

  if (user.password !== password)
    throw new AuthorizationError('Email or password is incorrect');

  return user;
};

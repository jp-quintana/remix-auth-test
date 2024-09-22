import { User } from '../auth.server';

import DUMMY_USERS from '~/data/users.json';

export const login = (email: string, password: string): User => {
  const user = DUMMY_USERS.find((user) => user.email === email);

  if (!user) throw new Error('User does not exist');

  if (user.password !== password)
    throw new Error('Email or password is incorrect');

  return user;
};

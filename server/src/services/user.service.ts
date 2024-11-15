import axios from 'axios';
import {
  accessTokenTtl,
  googleClientId,
  googleClientSecret,
  googleOAuthRedirectUrl,
  jwtSecret,
  refreshTokenTtl,
} from '../config';
import qs from 'qs';
import { promises as fs } from 'fs';
import jwt from 'jsonwebtoken';

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}

const filePath = './src/data/users.json';

export class UserService {
  async save(newUser: any) {
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    const updatedUsers = [...users, newUser];
    await fs.writeFile(filePath, JSON.stringify(updatedUsers, null, 2));
  }

  async create() {}

  async findOneById(id: string) {
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    return users.find((user: any) => user.id === id);
  }

  async findOneByEmail(email: string) {
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    return users.find((user: any) => user.email === email);
  }

  upsertTokens(userId: string, email: string, role: string) {
    const payload = {
      user: { userId, email, role },
    };

    const accessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: accessTokenTtl,
    });

    const decoded = jwt.decode(accessToken) as { exp: number };

    const refreshToken = jwt.sign({ userId }, jwtSecret, {
      expiresIn: refreshTokenTtl,
    });

    return {
      accessToken,
      refreshToken,
      expirationDate: new Date(decoded.exp * 1000).toISOString(),
    };
  }

  async getGoogleTokens(code: string): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleOAuthRedirectUrl,
      grant_type: 'authorization_code',
    };

    try {
      const res = await axios.post<GoogleTokensResult>(
        url,
        qs.stringify(values),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!res.data) throw new Error('OAuth error');
      return res.data;
    } catch (error: any) {
      console.log({ getGoogleTokensError: error.response.data.error });
      throw new Error(error.message);
    }
  }

  async getGoogleUser({
    id_token,
    access_token,
  }: {
    id_token: string;
    access_token: string;
  }): Promise<GoogleUserResult> {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

    try {
      const res = await axios.get<GoogleUserResult>(url, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      });

      return res.data;
    } catch (error: any) {
      console.log({ getGoogleUserError: error.response.data.error });
      throw new Error(error.message);
    }
  }
}

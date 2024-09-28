import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  accessTokenTtl,
  cookieMaxAge,
  jwtSecret,
  refreshTokenTtl,
} from '../config';

const filePath = './src/data/users.json';

export class AuthController {
  static async login(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);

      const user = users.find((user: any) => user.email === email);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(401)
          .json({ message: 'Email or password is incorrect' });

      delete user.password;

      const payload = {
        user: { userId: user.id, email: user.email, role: user.role },
      };

      const accessToken = jwt.sign(payload, jwtSecret, {
        expiresIn: accessTokenTtl,
      });

      const decoded = jwt.decode(accessToken) as { exp: number };

      const refreshToken = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: refreshTokenTtl,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: cookieMaxAge,
      });

      return res.status(201).json({
        user,
        accessToken,
        expirationDate: new Date(decoded.exp * 1000).toISOString(),
      });
    } catch (error: any) {
      console.error({ error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async register(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);

      const userExists = users.some((user: any) => user.email === email);

      if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: uuid(),
        ...req.body,
        password: encryptedPassword,
        role: 'user',
      };

      const updatedUsers = [...users, newUser];

      await fs.writeFile(filePath, JSON.stringify(updatedUsers, null, 2));

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
      console.error({ error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async refresh(req: Request, res: Response, _next: NextFunction) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
      const decodedRefreshToken = jwt.verify(refreshToken, jwtSecret);

      const { userId } = decodedRefreshToken as { userId: string };

      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);

      const user = users.find((user: any) => user.id === userId);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const payload = {
        user: { userId: user.id, email: user.email, role: user.role },
      };
      const newAccessToken = jwt.sign(payload, jwtSecret, {
        expiresIn: accessTokenTtl,
      });

      const decodedNewAccessToken = jwt.decode(newAccessToken) as {
        exp: number;
      };

      const newRefreshToken = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: refreshTokenTtl,
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: cookieMaxAge,
      });

      return res.status(201).json({
        user,
        accessToken: newAccessToken,
        expirationDate: new Date(
          decodedNewAccessToken.exp * 1000
        ).toISOString(),
      });
    } catch (error: any) {
      return res
        .status(401)
        .json({ message: error.message || 'Invalid or expired token' });
    }
  }
}

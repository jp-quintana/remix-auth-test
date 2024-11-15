import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookieMaxAge, jwtSecret, origin } from '../config';
import { UserService } from '../services/user.service';

export class AuthController {
  constructor(private readonly userService: UserService) {}

  login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findOneByEmail(email);

      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!user.password) {
        return res.status(400).json({
          message:
            'This user signed up with Google OAuth. Please log in using Google.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(401)
          .json({ message: 'Email or password is incorrect' });

      if (user.password) delete user.password;

      const { accessToken, refreshToken, expirationDate } =
        this.userService.upsertTokens(user.id, user.email, user.rol);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: cookieMaxAge,
      });

      return res.status(201).json({
        user,
        accessToken,
        expirationDate,
      });
    } catch (error: any) {
      console.error({ error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  register = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await this.userService.findOneByEmail(email);

      if (existingUser) {
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

      await this.userService.save(newUser);

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
      console.error({ error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  refresh = async (req: Request, res: Response, _next: NextFunction) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
      const decodedRefreshToken = jwt.verify(refreshToken, jwtSecret);

      const { userId } = decodedRefreshToken as { userId: string };

      const user = await this.userService.findOneById(userId);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expirationDate: newExpirationDate,
      } = this.userService.upsertTokens(user.id, user.email, user.rol);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: cookieMaxAge,
      });

      return res.status(201).json({
        user,
        accessToken: newAccessToken,
        expirationDate: newExpirationDate,
      });
    } catch (error: any) {
      return res
        .status(401)
        .json({ message: error.message || 'Invalid or expired token' });
    }
  };

  googleOAuthHandler = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { code } = req.query as { code: string };

    try {
      const { id_token, access_token } = await this.userService.getGoogleTokens(
        code
      );

      const googleUser = await this.userService.getGoogleUser({
        id_token,
        access_token,
      });

      if (!googleUser.verified_email)
        return res.status(403).send('Google account not verified');

      const existingUser = await this.userService.findOneByEmail(
        googleUser.email
      );

      let user = existingUser;

      if (!existingUser) {
        const newUser = {
          id: uuid(),
          name: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
          password: null,
          role: 'user',
        };

        await this.userService.save(newUser);
        user = newUser;
      }

      const { accessToken, refreshToken, expirationDate } =
        this.userService.upsertTokens(user.id, user.email, user.rol);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: cookieMaxAge,
      });

      return res.status(201).json({
        user,
        accessToken,
        expirationDate,
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.redirect(`${origin}/auth/google/error`);
    }
  };
}

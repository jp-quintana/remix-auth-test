import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

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

      return res.status(201).json(user);
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

      const updatedUsers = [
        ...users,
        {
          id: uuid(),
          ...req.body,
          password: encryptedPassword,
          accessToken: '123',
        },
      ];

      await fs.writeFile(filePath, JSON.stringify(updatedUsers, null, 2));

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
      console.error({ error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  static async refresh(req: Request, res: Response, _next: NextFunction) {}
}

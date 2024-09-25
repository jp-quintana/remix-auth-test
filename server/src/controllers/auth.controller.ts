import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';

const filePath = './src/data/users.json';

export class AuthController {
  static async login(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);

      const user = users.find((user: any) => user.email === email);

      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.password !== password)
        return res.status(401).json({ message: 'Unauthorized' });

      return res.status(201).json(user);
    } catch (error: any) {
      console.error({ error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async register(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email } = req.body;
      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);

      const userExists = users.some((user: any) => user.email === email);

      if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const updatedUsers = [
        ...users,
        { id: uuid(), ...req.body, accessToken: '123' },
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

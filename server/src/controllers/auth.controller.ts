import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';

const filePath = './src/data/users.json';

export class AuthController {
  static async login(req: Request, res: Response, _next: NextFunction) {
    const { email, password } = req.body;
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    const user = users.find((user: any) => user.email === email);

    if (!user) res.status(404).json({ message: 'User not found' });

    if (user.password !== password)
      res.status(401).json({ message: 'Unauthorized' });

    res.json(user);
  }

  static async register(req: Request, res: Response, _next: NextFunction) {}
  static async refresh(req: Request, res: Response, _next: NextFunction) {}
}

import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';

const filePath = './src/data/users.json';

export class UserController {
  static async getUser(req: Request, res: Response, _next: NextFunction) {
    try {
      const { userId } = req.user;

      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);

      const user = users.find((user: any) => user.id === userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      delete user.password;

      return res.status(200).json({ user });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

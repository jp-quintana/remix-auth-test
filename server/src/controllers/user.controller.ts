import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';

const filePath = './src/data/users.json';

export class UserController {
  static async getUser(req: Request, res: Response, _next: NextFunction) {
    const { id } = req.user;
    // const data = await fs.readFile(filePath, 'utf-8');
    // const users = JSON.parse(data);

    // const user = users.find((user: any) => user.email === email);
  }
}

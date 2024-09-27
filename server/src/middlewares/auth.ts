import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class AuthMiddleware {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];

      if (!accessToken)
        return res
          .status(401)
          .json({ message: 'Authorization token missing or malformed' });

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
      const { user } = decoded as {
        user: { userId: string; email: string; role: string };
      };
      req.user = user;

      next();
    } catch (error: any) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}

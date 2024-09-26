import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth';

export class UserRoutes {
  static getRoutes() {
    const router = Router();
    router.get('/', AuthMiddleware.verifyToken, UserController.getUser);
    return router;
  }
}

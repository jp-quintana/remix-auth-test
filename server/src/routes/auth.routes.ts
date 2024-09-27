import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth';

export class AuthRoutes {
  static getRoutes() {
    const router = Router();
    router.post('/login', AuthController.login);
    router.post('/register', AuthController.register);
    router.post('/refresh', AuthController.refresh);
    return router;
  }
}

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export class AuthRoutes {
  static getRoutes() {
    const router = Router();
    router.post('/login', AuthController.login);
    router.post('/register', AuthController.register);
    router.get('/refresh', AuthController.refresh);
    return router;
  }
}

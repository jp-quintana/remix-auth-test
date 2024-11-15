import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from '../services/user.service';

export class AuthRoutes {
  static getRoutes() {
    const router = Router();
    const service = new UserService();
    const controller = new AuthController(service);
    router.post('/login', controller.login);
    router.post('/register', controller.register);
    router.post('/refresh', controller.refresh);
    router.get('/sessions/oauth/google', controller.googleOAuthHandler);
    return router;
  }
}

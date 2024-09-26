import { Router } from 'express';
import { AuthRoutes } from './auth.routes';
import { UserRoutes } from './user.routes';

export class Routes {
  static getRoutes() {
    const router = Router();
    router.use('/auth', AuthRoutes.getRoutes());
    router.use('/user', UserRoutes.getRoutes());
    return router;
  }
}

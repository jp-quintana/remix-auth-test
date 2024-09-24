import { Router } from 'express';
import { AuthRoutes } from './auth.routes';

export class Routes {
  static getRoutes() {
    const router = Router();
    router.use('/auth', AuthRoutes.getRoutes());
    return router;
  }
}

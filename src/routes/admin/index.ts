import * as express from 'express';
import { AdminRoutes } from './routes';
import { UserRoutes } from '../user/route';

export class AdminRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post('/send-invite', AdminRoutes.inviteUser);
    this.router.get('/all', UserRoutes.getUsersByQuery);
    this.router.put('/user/:id', UserRoutes.updateUser);
    this.router.delete('/user/:id', UserRoutes.softDeleteById);
  }
}




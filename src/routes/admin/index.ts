import * as express from 'express';
import { AdminRoutes } from './routes';

export class AdminRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post('/send-invite', AdminRoutes.inviteUser);
    // this.router.get('/verify-invite', AdminRoutes.verifyInvite); //written in auth
  }
}




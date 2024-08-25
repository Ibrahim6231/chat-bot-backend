// NPM Deps
import * as express from 'express';
import { UserRoutes } from './route';

// Internal Deps
export class UserRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router
      .get('/all', UserRoutes.getUsersByQuery)
      .get('/all-names', UserRoutes.getAllUsersNameNId)
  }
}

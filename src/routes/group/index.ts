import * as express from 'express';
import { GroupRoutes } from './route';

export class GroupRouter {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.router.post('/create', GroupRoutes.createGroup);
        this.router.get('/list', GroupRoutes.getAllGroupsList);
    }
}

import * as express from 'express';
import { MessageRoutes } from './route';

export class MessageRouter {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.router.post('/create', MessageRoutes.createMessage);
        this.router.get('/group-wise/:id', MessageRoutes.getMessageByGroup);
        this.router.put('/update/:id', MessageRoutes.updateMessage);
        this.router.delete('/delete/:messageId/:senderId', MessageRoutes.deleteById);
    }
}

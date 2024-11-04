import { Router } from 'express';
import SessionController from '@controllers/session/session.controller';
import requireUser from '@middlewares/require-user.middleware';

class UserRoutes {
    router: Router;
    controller = new SessionController();

    constructor() {
        this.router = Router();

        this.intialize();
    }

    intialize() {
        this.router.get('/', requireUser, this.controller.getSessions);
        this.router.patch('/', requireUser, this.controller.updateSession);
    }
}

export default new UserRoutes().router;

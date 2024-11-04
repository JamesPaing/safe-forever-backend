import AuthController from '@controllers/auth/auth.controller';
import requireUser from '@middlewares/require-user.middleware';
import { Router } from 'express';

class AuthRoutes {
    router: Router;
    controller = new AuthController();

    constructor() {
        this.router = Router();
        this.intialize();
    }

    intialize() {
        this.router.post('/login', this.controller.login);
        this.router.delete('/logout', requireUser, this.controller.logout);
        this.router.get('/me', requireUser, this.controller.me);
        this.router.get('/oauth/google', this.controller.googleOAuth);
    }
}

export default new AuthRoutes().router;

import { Router } from 'express';
import UserController from '@controllers/user/user.controller';
import { validate } from '@middlewares/validate.middleware';
import { validator } from '@controllers/user/user.request';

class UserRoutes {
    router: Router;
    controller = new UserController();

    constructor() {
        this.router = Router();
        this.intialize();
    }

    intialize() {
        this.router.get(
            '/',
            // validate(validator.findAll),
            // parsePagination,
            this.controller.findAll
        );

        this.router.post(
            '/',
            validate(validator.createOne),
            this.controller.createOne
        );

        this.router.delete('/', this.controller.deleteAll);
    }
}

export default new UserRoutes().router;

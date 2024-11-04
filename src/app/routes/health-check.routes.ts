import { Router } from 'express';

class HealthCheckRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.intialize();
    }

    intialize() {
        this.router.get('/healthcheck', (_, res) => {
            res.sendStatus(200);
        });
    }
}

export default new HealthCheckRoutes().router;

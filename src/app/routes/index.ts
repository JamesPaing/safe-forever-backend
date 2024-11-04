import { Express } from 'express';
import HealthCheckRoutes from './health-check.routes';
import userRoutes from './user.routes';
import sessionRoutes from './session.routes';
import authRoutes from './auth.routes';

const API_PREFIX = process.env.API_PREFIX || '/api';

class Routes {
    constructor(app: Express) {
        app.use('/', HealthCheckRoutes);
        app.use(`${API_PREFIX}/users`, userRoutes);
        app.use(`${API_PREFIX}/sessions`, sessionRoutes);
        app.use(`${API_PREFIX}/auth`, authRoutes);
    }
}

export default Routes;

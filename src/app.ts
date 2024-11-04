import { createServer, Server } from 'node:http';
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import Routes from './app/routes';
import logger from './utils/logger';
import errorHandler from '@helpers/error-handler';
import apiResponse from '@middlewares/api-response.middleware';
import deserializeUser from '@middlewares/deserialize-user.middleware';
import { coreOptions } from '@config/core-options.config';
import cookieParser from 'cookie-parser';

class App {
    app: Express;
    server: Server;

    constructor() {
        this.createServer();
        this.setup();
    }

    private createServer() {
        this.app = express();
        this.server = createServer(this.app);
    }

    private setup() {
        this.setupMiddlewares();
        this.setupRoutes();
        this.app.use(errorHandler.handler);
    }

    private setupMiddlewares() {
        this.app.use(
            morgan(`:date[clf] :method :url :status :response-time ms`)
        );
        this.app.options('*', cors(coreOptions));
        this.app.use(cors(coreOptions));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(apiResponse.handler);
        this.app.use(deserializeUser);
    }

    private setupRoutes() {
        new Routes(this.app);
    }

    start(port: number) {
        this.server.listen(port, () => {
            logger.info(`Server started on port ${port}...`);
        });

        return this;
    }
}

export default App;

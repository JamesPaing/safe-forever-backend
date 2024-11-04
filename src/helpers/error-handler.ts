import logger from '@utils/logger';
import { AppError } from './app-error';
import { GENERIC_ERR_MSG } from '../constants';

class ErrorHandler {
    constructor() {
        this.handler = this.handler.bind(this);
    }

    handlePrismaClientKnownRequestError(_: any) {
        const message = `Duplicated value, try again.`;

        return new AppError(message, 400);
    }

    handleCastErrorDB(err: any) {
        const message = `Invalid ${err.path}: ${err.value}!`;

        return new AppError(message, 400);
    }

    handleDuplicatedValueDB(err: any) {
        const value = Object.values(err.keyValue)[0];
        const message = `Duplicated: '${value}'. Please use another value!`;

        return new AppError(message, 400);
    }

    handleValidationErrorDB(err: any) {
        const errors = Object.values(err.details).map((el: any) => el.message);
        const message = `Invalid data input: ${errors.join(', ')}.`;

        return new AppError(message, 400);
    }

    handleJWTError(_: any) {
        return new AppError('Invalid token. Please log in again.', 401);
    }

    sendDev(err: any, res: any) {
        res.status(err.httpCode).json({
            status: err.status,
            httpCode: err.httpCode,
            name: err.name,
            message: err.message,
            error: err,
            stack: err.statck,
        });
    }

    sendProd(err: any, res: any) {
        // Operational
        if (err.isOperational) {
            res.status(err.httpCode).json({
                status: err.status,
                message: err.message,
            });
            // Unknown / programming
        } else {
            logger.error('Error ☹ ', err);

            // Send generic message back
            res.status(500).json({
                status: 'err',
                message: GENERIC_ERR_MSG,
            });
        }
    }

    handler(err: any, _: any, res: any, __: any) {
        err.status = err.status || 'error';
        err.httpCode = err.httpCode || 500;

        if (
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test'
        ) {
            this.sendDev(err, res);
        } else if (process.env.NODE_ENV === 'production') {
            let error = { ...err, name: err.name, message: err.message };

            switch (error.name) {
                case 'PrismaClientKnownRequestError':
                    error = this.handlePrismaClientKnownRequestError(error);
                    break;

                case 'CastError':
                    error = this.handleCastErrorDB(error);
                    break;

                case 'MongoError':
                    error = this.handleDuplicatedValueDB(error);
                    break;

                case 'ValidationError':
                    error = this.handleValidationErrorDB(error);
                    break;

                case 'JsonWebTokenError':
                    error = this.handleJWTError(error);
                    break;

                default:
                    break;
            }

            this.sendProd(error, res);
        }
    }
}

export default new ErrorHandler();

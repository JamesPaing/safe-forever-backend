import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

class ApiResponse {
    constructor() {
        this.handler = this.handler.bind(this);
    }

    handler(_: Request, res: Response, next: NextFunction) {
        // res.message = messageResponse(res);
        res.success = this.succesResponse(res);
        res.fail = this.failResponse(res);
        // res.serverError = serverErrorResponse(res);
        // res.notFound = notFoundResponse(res);
        // res.unauthorized = unauthorizedResponse(res);

        next();
    }

    succesResponse(res: Response) {
        return function <T>(body: Express.SuccessResponeBody<T>) {
            const { data, message = 'success', status = httpStatus.OK } = body;

            return res.status(status).json({
                data,
                message,
                status,
            });
        };
    }

    failResponse(res: Response) {
        return function <T>(body: Express.FailResponseBody<T>) {
            const {
                errors,
                message = 'fail',
                status = httpStatus.INTERNAL_SERVER_ERROR,
            } = body;

            return res.status(status).json({
                errors,
                message,
                status,
            });
        };
    }
}

export default new ApiResponse();

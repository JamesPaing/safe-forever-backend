import logger from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

const catchAsyncError = (asyncFn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        asyncFn(req, res, next).catch((err: any) => {
            process.env.NODE_ENV === 'development' &&
                logger.error(err, 'catched async error');
            next(err);
        });
    };
};

export default catchAsyncError;

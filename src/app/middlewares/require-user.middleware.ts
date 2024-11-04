import { AppError } from '@helpers/app-error';
import { NextFunction, Request, Response } from 'express';

export default function requireUser(
    req: Request,
    _: Response,
    next: NextFunction
) {
    const user = req.user;

    if (!user) {
        next(
            new AppError('You must login first to access this resource.', 403)
        );
    }

    return next();
}

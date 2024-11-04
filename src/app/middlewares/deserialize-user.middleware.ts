import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import jwt from '@utils/jwt';
import authService from '@services/auth.service';

export default async function deserializeUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const accessToken =
        get(req, 'cookies.access_token') ||
        get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

    const refreshToken =
        get(req, 'cookies.refresh_token') ||
        String(get(req, 'headers.x-refresh', '')).replace(/^Bearer\s/, '');

    if (!accessToken) {
        return next();
    }

    const { decoded, expired } = jwt.verify(accessToken);

    if (decoded) {
        req.user = decoded as Express.User;

        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken =
            await authService.reIssueAccessToken(refreshToken);

        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken);

            const cookieOptions = {
                httpOnly: true,
                domain: 'localhost',
                path: '/',
                sameSite: 'strict' as
                    | boolean
                    | 'strict'
                    | 'lax'
                    | 'none'
                    | undefined,
                secure: false,
            };

            res.cookie('access_token', newAccessToken, {
                maxAge: 900000, // 15 min
                ...cookieOptions,
            });
        }

        const result = jwt.verify(newAccessToken as string);

        req.user = result.decoded as Express.User;

        return next();
    }

    return next();
}

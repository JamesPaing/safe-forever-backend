import AuthService from '@services/auth.service';
import BaseController from '@controllers/ base.controller';
import { Request, Response } from 'express';
import catchAsyncError from '@helpers/catch-async-err';
import userService from '@services/user.service';
import * as process from 'node:process';

class AuthController extends BaseController {
    constructor() {
        super();
        this.login = this.login.bind(this);
    }

    public login = catchAsyncError(async (req: Request, res: Response) => {
        const responseData = await AuthService.loginUser(req.body, res);

        if (responseData) {
            res.success({
                data: responseData,
            });
        }
    });

    public logout = catchAsyncError(async (req: Request, res: Response) => {
        const updatedSession = await AuthService.logoutUser(req);

        AuthService.invalidateTokenCookies(res);

        if (updatedSession) {
            res.success({
                data: {
                    session: updatedSession,
                    access_token: null,
                    refresh_token: null,
                },
            });
        }
    });

    public me = catchAsyncError(async (req: Request, res: Response) => {
        const currentUser = await AuthService.getCurrentUser(req);

        if (currentUser) {
            res.success({
                data: currentUser,
            });
        } else {
            res.fail({
                errors: ['No user found.'],
            });
        }
    });

    googleOAuth = catchAsyncError(async (req: Request, res: Response) => {
        const oAuthUser = await AuthService.getOAuthUser(req);

        // upsert the user
        const user = await userService.upsertUser(oAuthUser);

        // login
        const responseData = await AuthService.loginOAuthUser(user, res);

        if (responseData) {
            // to main page
            res.redirect(process.env.ORIGIN!);
        } else {
            // to error page
            res.redirect(process.env.ORIGIN + '/oauth/error');
        }
    });
}

export default AuthController;

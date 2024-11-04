import SessionService from '@services/session.service';
import userRepository from '@repositories/user.repository';
import UserRepository from '@repositories/user.repository';
import hash from '@utils/hash';
import { Session, User } from '@prisma/client';
import jwt from '@utils/jwt';
import { AppError } from '@helpers/app-error';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { get } from 'lodash';
import userService from './user.service';
import axios from 'axios';
import qs from 'qs';
import jsonwebtoken from 'jsonwebtoken';

class AuthService {
    async loginUser(credentials: Auth.LoginInput, res: Response) {
        const user = await this.validateUser(credentials);

        // create a session
        const session = await SessionService.createSession({
            user_id: user.user_id,
        });

        // generate JWTs
        const authResponse = this.signJWts(user, session);

        // set cookies
        this.setTokenCookies(
            authResponse.access_token,
            authResponse.refresh_token,
            res
        );

        return authResponse;
    }

    async loginOAuthUser(oAuthUser: User, res: Response) {
        // create a session
        const session = await SessionService.createSession({
            user_id: oAuthUser.user_id,
        });

        // generate JWTs
        const authResponse = this.signJWts(oAuthUser, session);

        // set cookies
        this.setTokenCookies(
            authResponse.access_token,
            authResponse.refresh_token,
            res
        );

        return authResponse;
    }

    async validateUser(credentials: Auth.LoginInput) {
        const user = await userRepository.findOne({
            where: {
                email: credentials.email,
            },
        });

        if (!user) {
            throw new AppError('No user found.', httpStatus.BAD_REQUEST);
        }

        const isValid = await hash.check(credentials.password, user.password);

        if (!isValid) {
            throw new AppError('Incorrect password.', httpStatus.BAD_REQUEST);
        }

        return user;
    }

    signJWts(
        user: User,
        session: Session
    ): { user: User; session: Session } & {
        access_token: string;
        refresh_token: string;
    } {
        const payload = { ...user, session_id: session.session_id };

        return {
            user,
            session,
            access_token: jwt.sign(payload, {
                expiresIn: process.env.ACCESS_TOKEN_TTL,
            }),
            refresh_token: jwt.sign(payload, {
                expiresIn: process.env.REFRESH_TOKEN_TTL,
            }),
        };
    }

    async logoutUser(req: Request) {
        const sessionId = req.user?.session_id;

        return SessionService.updateSession(
            {
                session_id: sessionId,
            },
            {
                valid: false,
            }
        );
    }

    async reIssueAccessToken(refresToken: string) {
        // verify token
        const { decoded } = jwt.verify(refresToken);

        // get user's and session's ids
        const sessionId = get(decoded, 'session_id');
        const userId = get(decoded, 'user_id');

        if (!decoded || !sessionId) return false;

        const session = await SessionService.findById(sessionId);

        if (!session || !session.valid) return false;

        const user = await userService.findUser(userId);

        if (!user) return false;

        return jwt.sign(
            {
                ...user,
                session_id: session.session_id,
            },
            {
                expiresIn: process.env.ACCESS_TOKEN_TTL,
            }
        );
    }

    getCurrentUser(req: Request) {
        return UserRepository.findOne({
            where: {
                user_id: req.user?.user_id,
            },
        });
    }

    invalidateTokenCookies(res: Response) {
        const invalidateOptions = {
            maxAge: 0,
        };

        res.cookie('access_token', '', invalidateOptions);
        res.cookie('refresh_token', '', invalidateOptions);
    }

    async getOAuthUser(req: Request) {
        // get the code from qs
        const code = req.query.code as string;

        const googleOAuthTokens = await this.getGoogleOAuthTokens(code);
        const { id_token, access_token } = googleOAuthTokens;

        // (this is already enough and okay, but can still go further as below)
        const googleUser: any = jsonwebtoken.decode(id_token);
        if (!googleUser.email_verified) {
            throw new Error('Google account is not verified.');
        }

        // get user with token,
        return await this.getGoogleOAuthUser(id_token, access_token);
    }

    async getGoogleOAuthTokens(
        code: string
    ): Promise<Auth.GoogleOAuthTokenReponse> {
        // get the id and access token with the code
        const url = 'https://oauth2.googleapis.com/token';
        const values = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            grant_type: 'authorization_code',
        };
        const googleTokenData = await axios.post(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return googleTokenData.data;
    }

    async getGoogleOAuthUser(id_token: string, access_token: string) {
        // get user with token,
        const oAuthUserData = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );

        return oAuthUserData.data;
    }

    private setTokenCookies(
        access_token: string,
        refresh_token: string,
        res: Response
    ) {
        // set cookies
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

        res.cookie('access_token', access_token, {
            maxAge: 900000, // 15 min
            ...cookieOptions,
        });

        res.cookie('refresh_token', refresh_token, {
            maxAge: 3.154e10, // 1 year
            ...cookieOptions,
        });
    }
}

export default new AuthService();

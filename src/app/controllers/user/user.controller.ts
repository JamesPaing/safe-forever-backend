import BaseController from '@controllers/ base.controller';
import { type Prisma } from '@prisma/client';
import UserService from '../../services/user.service';
import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';

class UserController extends BaseController {
    constructor() {
        super();
        this.findAll = this.findAll.bind(this);
        this.createOne = this.createOne.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
    }

    async findAll(_: Request, res: Response) {
        const users = await UserService.findAllUsers();

        if (users) {
            res.success({
                data: users,
            });
        } else {
            res.fail({
                errors: ['Error finding users.'],
            });
        }
    }

    public async createOne(
        req: Request<{}, {}, Prisma.UserCreateInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await UserService.createUser(req.body);

            if (user?.user_id) {
                res.success({
                    data: omit(user, 'password'),
                    status: 201,
                });
            } else {
                res.fail({
                    errors: ['No user found.'],
                });
            }
        } catch (error) {
            next(error);
        }
    }

    public async deleteAll(_: Request, res: Response, next: NextFunction) {
        try {
            await UserService.deleteAllUsers();

            res.success({
                status: 204,
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;

import BaseController from '../ base.controller';
import catchAsyncError from '@helpers/catch-async-err';
import SessionService from '@services/session.service';
import { Request, Response } from 'express';
import { type Prisma } from '@prisma/client';

class SessionController extends BaseController {
    constructor() {
        super();
    }

    public getSessions = catchAsyncError(
        async (req: Request, res: Response) => {
            const sessions = await SessionService.getSessions(req);

            if (sessions) {
                res.success({
                    data: sessions,
                });
            }
        }
    );

    public updateSession = catchAsyncError(
        async (
            req: Request<
                {},
                {},
                Prisma.XOR<
                    Prisma.SessionUpdateInput,
                    Prisma.SessionUncheckedUpdateInput
                >,
                Prisma.SessionWhereUniqueInput
            >,
            res: Response
        ) => {
            const updatedSession = await SessionService.updateSession(
                {
                    ...req.query,
                    ...req.params,
                },
                req.body
            );

            if (updatedSession) {
                res.success({
                    data: updatedSession,
                });
            }
        }
    );
}

export default SessionController;

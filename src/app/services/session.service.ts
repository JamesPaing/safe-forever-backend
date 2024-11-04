import sessionRepository from '@repositories/session.repository';
import { type Prisma } from '@prisma/client';
import { Request } from 'express';

class SessionService {
    async createSession(data: Prisma.SessionUncheckedCreateInput) {
        return await sessionRepository.create(data);
    }

    async getSessions(req: Request) {
        const user = req.user!;

        console.log(user);

        return sessionRepository.findMany({
            user_id: user.user_id,
            valid: true,
        });
    }

    async findById(sessionId: string) {
        return sessionRepository.findOne({
            where: {
                session_id: sessionId,
            },
        });
    }

    async updateSession(
        where: Prisma.SessionWhereUniqueInput,
        data: Prisma.XOR<
            Prisma.SessionUpdateInput,
            Prisma.SessionUncheckedUpdateInput
        >
    ) {
        return sessionRepository.updateOne(where, data);
    }
}

export default new SessionService();

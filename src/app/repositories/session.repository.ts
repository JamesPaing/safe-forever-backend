import dbClient from '../../db/client';
import { type Prisma, Session } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

interface ISessionRepository {
    create(session: Session): Promise<Session>;
    findOne(
        args: Prisma.SessionFindFirstArgs<DefaultArgs>
    ): Promise<Session | null>;
    findMany(where: Prisma.SessionWhereInput): Promise<Session[]>;
    updateOne(
        where: Prisma.SessionWhereUniqueInput,
        data: Prisma.XOR<
            Prisma.SessionUpdateInput,
            Prisma.SessionUncheckedUpdateInput
        >
    ): Promise<Session>;
}

class SessionRepository implements ISessionRepository {
    private session: Prisma.SessionDelegate<DefaultArgs>;

    constructor() {
        this.session = dbClient.session;
    }

    async create(data: Prisma.SessionUncheckedCreateInput) {
        return this.session.create({
            data,
        });
    }

    async findOne(args: Prisma.SessionFindFirstArgs<DefaultArgs>) {
        return this.session.findFirst(args);
    }

    async findMany(where: Prisma.SessionWhereInput) {
        return this.session.findMany({
            where,
        });
    }

    async updateOne(
        where: Prisma.SessionWhereUniqueInput,
        data: Prisma.XOR<
            Prisma.SessionUpdateInput,
            Prisma.SessionUncheckedUpdateInput
        >
    ) {
        return this.session.update({
            where,
            data,
        });
    }
}

export default new SessionRepository();

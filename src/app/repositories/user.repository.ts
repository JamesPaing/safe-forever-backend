import hash from '../../utils/hash';
import dbClient from '../../db/client';
import { type Prisma, User } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

interface IUserRepository {
    create(user: User): Promise<User>;
    findOne(args: Prisma.UserFindFirstArgs<DefaultArgs>): Promise<User | null>;
    upsert(args: Prisma.UserUpsertArgs<DefaultArgs>): Promise<User>;
}

class UserRepository implements IUserRepository {
    private user: Prisma.UserDelegate<DefaultArgs>;

    constructor() {
        this.user = dbClient.user;
    }

    async create(data: Prisma.UserCreateInput) {
        return this.user.create({
            data: {
                ...data,
                password: hash.make(data.password),
            },
        });
    }

    async findOne(args: Prisma.UserFindFirstArgs<DefaultArgs>) {
        return this.user.findFirst(args);
    }

    async findAll() {
        return this.user.findMany();
    }

    async deleteAll() {
        return dbClient.$transaction([
            dbClient.session.deleteMany(),
            dbClient.user.deleteMany(),
        ]);
    }

    async upsert(args: Prisma.UserUpsertArgs): Promise<User> {
        return dbClient.user.upsert(args);
    }
}

export default new UserRepository();

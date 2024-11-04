import UserRepository from '../repositories/user.repository';
import { type Prisma } from '@prisma/client';
import { generateRandomString } from '@utils/generate-string';
import { omit } from 'lodash';
import hash from '@utils/hash';

class UserService {
    async createUser(data: Prisma.UserCreateInput) {
        return await UserRepository.create(data);
    }

    async findUser(userId: string) {
        return UserRepository.findOne({
            where: {
                user_id: userId,
            },
        });
    }

    async findAllUsers() {
        return UserRepository.findAll();
    }

    async deleteAllUsers() {
        return UserRepository.deleteAll();
    }

    async upsertUser(user: any) {
        return UserRepository.upsert({
            where: {
                email: user.email,
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            create: {
                ...omit(user, [
                    'id',
                    'verified_email',
                    'given_name',
                    'family_name',
                    'picture',
                    'name',
                ]),
                first_name: user.given_name || user.first_name,
                last_name: user.family_name || user.last_name,
                password: user.password || hash.make(generateRandomString()),
                user_name: user.user_name || user.name,
            },
            update: {
                ...omit(user, [
                    'id',
                    'verified_email',
                    'given_name',
                    'family_name',
                    'picture',
                    'name',
                ]),
                first_name: 'Mike',
            },
        });
    }
}

export default new UserService();

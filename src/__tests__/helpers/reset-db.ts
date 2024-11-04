import dbClient from '../../db/client';

export default async () => {
    await dbClient.$transaction([
        dbClient.session.deleteMany(),
        dbClient.user.deleteMany(),
    ]);
};

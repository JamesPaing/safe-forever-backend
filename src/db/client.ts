import { PrismaClient } from '@prisma/client';

const dbClient = new PrismaClient({
    datasources: {
        db: {
            url:
                process.env.NODE_ENV === 'test'
                    ? process.env.DB_URL_TEST
                    : process.env.DB_URL,
        },
    },
});

// const dbClient = new PrismaClient();

export default dbClient;

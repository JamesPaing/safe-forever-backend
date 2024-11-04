import App from '../app';
import supertest from 'supertest';
import { user } from './__fixtures__/users';
import { prismaMock } from '../db/singleton';

const app = new App().app;

beforeAll(() => {
    prismaMock.$connect();
});

afterAll(() => {
    prismaMock.$disconnect();
});

describe('user', () => {
    describe('get all users', () => {
        it('should return a user array', async () => {
            prismaMock.user.findMany.mockResolvedValue([user]);

            const response = await supertest(app).get('/api/users').expect(200);

            expect(response.body.message).toBe('success');
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data[0]).toHaveProperty('user_id');
        });
    });

    describe('create a new user', () => {
        it('should return created user, given your information', async () => {
            prismaMock.user.create.mockResolvedValue(user);

            const response = await supertest(app)
                .post('/api/users')
                .send({
                    user_name: user.user_name,
                    first_name: user.first_name,
                    email: user.email,
                    contact: user.contact,
                    password: user.password,
                })
                .expect(201);

            expect(response.body.message).toBe('success');
            expect(response.body.data).toHaveProperty('user_id');
            expect(response.body.data).toHaveProperty('created_at');
            expect(response.body.data).toHaveProperty('updated_at');
        }, 9999999);
    });
});

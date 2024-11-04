import App from '../app';
import supertest from 'supertest';
import { user } from './__fixtures__/users';
import resetDb from './helpers/reset-db';

const app = new App().app;

beforeEach(async () => {
    await resetDb();
});

describe('User', () => {
    describe('[GET /users] finding all users', () => {
        it('should return a user array', async () => {
            const response = await supertest(app).get('/api/users/');

            expect(response.body.message).toBe('success');
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    describe('[POST /users] creating a new user', () => {
        it('should return the created user, given correct user information', async () => {
            // prismaMock.user.create.mockResolvedValue(user);

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

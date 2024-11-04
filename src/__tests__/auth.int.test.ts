import App from '../app';
import supertest from 'supertest';
import resetDb from './helpers/reset-db';
import { user } from './__fixtures__/users';

const app = new App().app;

beforeEach(async () => {
    await resetDb();

    await supertest(app).post('/api/users').send({
        user_name: user.user_name,
        email: user.email,
        first_name: user.first_name,
        password: user.password,
        contact: user.contact,
    });
});

describe('Auth', () => {
    describe('[-] POST /login', () => {
        it('should return user and tokens, given email and password', async () => {
            const response = await supertest(app).post('/api/auth/login').send({
                email: user.email,
                password: user.password,
            });

            expect(response.body.message).toBe('success');
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.access_token).toBeDefined();
            expect(response.body.data.refresh_token).toBeDefined();
        });

        it('should return 400, given incorrect email or password', async () => {
            const response = await supertest(app)
                .post('/api/auth/login')
                .send({
                    email: user.email + 'mistake',
                    password: user.password,
                });

            expect(response.body.status).toBe('fail');
            expect(response.body.httpCode).toBe(400);
        });
    });
});

import App from '../app';
import request from 'supertest';

const app = new App().app;

describe('Server', () => {
    describe('[-] GET /healthcheck', () => {
        it('should return 200', async () => {
            await request(app).get('/healthcheck').expect(200);
        });
    });
});

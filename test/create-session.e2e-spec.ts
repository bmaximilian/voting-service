import { INestApplication } from '@nestjs/common';
import request from 'supertest';

declare const app: INestApplication;

describe('POST /api/v1/session', () => {
    it('should return unauthorized when calling with invalid credentials', async () => {
        const response = await request(app.getHttpServer()).post('/api/v1/session');

        expect(response.status).toEqual(401);
    });
});

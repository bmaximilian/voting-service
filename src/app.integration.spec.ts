import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { bootstrap } from './bootstrap';

/* eslint-disable jest/expect-expect */

describe('Application', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrap(3001);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should start the application', async () => {
        await request(app.getHttpServer()).get('/api').expect(301);
    });
});

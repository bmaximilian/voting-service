import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { NestApplication } from '@nestjs/core';
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
        expect(app).toBeInstanceOf(NestApplication);
    });

    it('should have the swagger module configured', async () => {
        await request(app.getHttpServer()).get('/api').expect(301);
    });

    it('should have an accessible health check route', async () => {
        await request(app.getHttpServer()).get('/').expect(200);
    });
});

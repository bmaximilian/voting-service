import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ApplicationModule } from '../src/ApplicationModule';

describe('HealthCheckController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET health check)', () => request(app.getHttpServer()).get('/').expect(200));

    afterEach(async () => {
        await app.close();
    });
});

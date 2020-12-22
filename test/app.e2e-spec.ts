import { INestApplication } from '@nestjs/common';
import request from 'supertest';

declare const app: INestApplication;

describe('HealthCheckController (e2e)', () => {
    it('/ (GET health check)', () => request(app.getHttpServer()).get('/').expect(200));
});

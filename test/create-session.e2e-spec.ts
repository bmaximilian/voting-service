import request from 'supertest';
import { INestApplication } from '@nestjs/common';

declare const app: INestApplication;
declare const validToken: string;

describe('POST /api/v1/sessions', () => {
    it('should return unauthorized when calling with invalid credentials', async () => {
        const response = await request(app.getHttpServer()).post('/api/v1/sessions');

        expect(response.status).toEqual(401);
    });

    it('should return bad request when calling with invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({});

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: ['start must be a Date instance', 'start should not be empty'],
            statusCode: 400,
        });
    });

    it('should return the created session', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-24T10:00:00.000Z',
            });

        expect(response.status).toEqual(201);
        expect(response.body.start).toEqual('2020-12-24T10:00:00.000Z');
        expect(response.body.end).toBeUndefined();
        expect(response.body.id).toBeString();
        expect(response.body.participants).toBeArrayOfSize(0);
        expect(response.body.topics).toBeArrayOfSize(0);
    });
});

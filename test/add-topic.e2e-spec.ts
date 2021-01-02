import request from 'supertest';
import { INestApplication } from '@nestjs/common';

declare const app: INestApplication;
declare const validToken: string;

describe('POST /api/v1/sessions/{id}/topics', () => {
    let session: { id: string };

    beforeAll(async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-24T10:00:00.000Z',
            });

        session = response.body;
    });

    it('should return unauthorized when calling with invalid credentials', async () => {
        const response = await request(app.getHttpServer()).post(`/api/v1/sessions/${session.id}/topics`);

        expect(response.status).toEqual(401);
    });

    it('should return bad request when calling with invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/topics`)
            .set('Authorization', validToken)
            .send({});

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: [
                'id should not be empty',
                'id must be a string',
                'answerOptions should not be empty',
                'answerOptions must be an array',
                'requiredNumberOfShares should not be empty',
                'requiredNumberOfShares must not be less than 0',
                'requiredNumberOfShares must be a number conforming to the specified constraints',
                'majority should not be empty',
            ],
            statusCode: 400,
        });
    });

    it('should return not found when calling with not existing session id', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions/invalid-session-id/topics')
            .set('Authorization', validToken)
            .send({
                id: '/api/v1/sessions/{id}/topics-topic:1',
                answerOptions: ['yes', 'no', 'abstention'],
                abstentionAnswerOption: 'abstention',
                requiredNumberOfShares: 70,
                majority: {
                    type: 'relative',
                },
            });

        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
            error: 'Not Found',
            message: 'Session with the id invalid-session-id not found',
            statusCode: 404,
        });
    });

    it('should return the created topic', async () => {
        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/topics`)
            .set('Authorization', validToken)
            .send({
                id: '/api/v1/sessions/{id}/topics-topic:1',
                answerOptions: ['yes', 'no', 'abstention'],
                abstentionAnswerOption: 'abstention',
                requiredNumberOfShares: 70,
                majority: {
                    type: 'relative',
                },
            });

        expect(response.status).toEqual(201);
        expect(response.body.id).toEqual('/api/v1/sessions/{id}/topics-topic:1');
        expect(response.body.answerOptions).toEqual(['yes', 'no', 'abstention']);
        expect(response.body.abstentionAnswerOption).toEqual('abstention');
        expect(response.body.requiredNumberOfShares).toEqual(70);
        expect(response.body.majority).toEqual({
            type: 'relative',
        });
    });

    it('should throw bad request when adding an already existing topic', async () => {
        const topic = {
            id: 'doubled-topic:1',
            answerOptions: ['yes', 'no', 'abstention'],
            abstentionAnswerOption: 'abstention',
            requiredNumberOfShares: 70,
            majority: {
                type: 'relative',
            },
        };

        const createResponse = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/topics`)
            .set('Authorization', validToken)
            .send(topic);

        expect(createResponse.status).toEqual(201);

        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/topics`)
            .set('Authorization', validToken)
            .send(topic);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Topic with id doubled-topic:1 already exists',
            statusCode: 400,
        });
    });
});

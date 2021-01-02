import request from 'supertest';
import { INestApplication } from '@nestjs/common';

declare const app: INestApplication;
declare const validToken: string;

describe('POST /api/v1/sessions/{id}/participants', () => {
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
        const response = await request(app.getHttpServer()).post(`/api/v1/sessions/${session.id}/participants`);

        expect(response.status).toEqual(401);
    });

    it('should return bad request when calling with invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({});

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: [
                'id should not be empty',
                'id must be a string',
                'shares should not be empty',
                'shares must not be less than 0',
                'shares must be a number conforming to the specified constraints',
            ],
            statusCode: 400,
        });
    });

    it('should return not found when calling with not existing session id', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions/invalid-session-id/participants')
            .set('Authorization', validToken)
            .send({
                id: 'participant_1',
                shares: 1,
            });

        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
            error: 'Not Found',
            message: 'Session with the id invalid-session-id not found',
            statusCode: 404,
        });
    });

    it('should return the created participant', async () => {
        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({
                id: 'participant_1',
                shares: 1,
            });

        expect(response.status).toEqual(201);
        expect(response.body.id).toEqual('participant_1');
        expect(response.body.shares).toEqual(1);
    });

    it('should create a participant with mandates', async () => {
        const mandatedParticipant = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({
                id: 'participant_2',
                shares: 1,
            });
        expect(mandatedParticipant.status).toEqual(201);
        expect(mandatedParticipant.body.id).toEqual('participant_2');

        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({
                id: 'participant_3',
                shares: 1,
                mandates: ['participant_2'],
            });

        expect(response.status).toEqual(201);
        expect(response.body.id).toEqual('participant_3');
        expect(response.body.shares).toEqual(1);
    });

    it('should throw bad request when trying to create a participant with mandates that dont exist', async () => {
        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({
                id: 'participant_100',
                shares: 1,
                mandates: ['participant_abc-not-existing'],
            });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message:
                'Cannot create mandate for participant with id participant_abc-not-existing. Participant does not exist', // eslint-disable-line max-len
            statusCode: 400,
        });
    });

    it('should throw bad request when adding an already existing participant', async () => {
        const addParticipantResponse = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({
                id: 'participant_1',
                shares: 1,
            });

        expect(addParticipantResponse.status).toEqual(201);

        const response = await request(app.getHttpServer())
            .post(`/api/v1/sessions/${session.id}/participants`)
            .set('Authorization', validToken)
            .send({
                id: 'participant_1',
                shares: 1,
            });

        expect(addParticipantResponse.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Participant already exists',
            statusCode: 400,
        });
    });
});

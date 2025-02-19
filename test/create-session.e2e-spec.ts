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

    it('should be able create a session with participants and topics', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-31T11:30:00.000Z',
                participants: [
                    { id: 'par_1', shares: 20 },
                    { id: 'par_2', shares: 30 },
                    { id: 'par_3', shares: 50, mandates: ['par_1'] },
                ],
                topics: [
                    {
                        id: 'top_1',
                        answerOptions: ['yes', 'no', 'abstention'],
                        abstentionAnswerOption: 'abstention',
                        requiredNumberOfShares: 70,
                        majority: {
                            type: 'relative',
                        },
                    },
                    {
                        id: 'top_2',
                        answerOptions: ['yes', 'no'],
                        requiredNumberOfShares: 80,
                        majority: {
                            type: 'qualified',
                            quorumInPercent: 66.66,
                        },
                    },
                ],
            });

        expect(response.status).toEqual(201);
        expect(response.body.start).toEqual('2020-12-31T11:30:00.000Z');
        expect(response.body.end).toBeUndefined();
        expect(response.body.id).toBeString();
        expect(response.body.participants).toBeArrayOfSize(3);
        expect(response.body.topics).toBeArrayOfSize(2);

        function findItemWithId<T extends { id: string }>(collection: T[], id: string): T {
            return collection.find((item) => item.id === id);
        }

        expect(findItemWithId(response.body.participants, 'par_1')).toBeDefined();
        expect(findItemWithId(response.body.participants, 'par_2')).toBeDefined();
        expect(findItemWithId(response.body.participants, 'par_3')).toBeDefined();

        expect(findItemWithId(response.body.topics, 'top_1')).toBeDefined();
        expect(findItemWithId(response.body.topics, 'top_2')).toBeDefined();
    });

    it('should throw when creating a session with invalid mandates', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-31T11:30:00.000Z',
                participants: [
                    { id: 'par_1', shares: 20 },
                    { id: 'par_2', shares: 50, mandates: ['par_1'] },
                    { id: 'par_3', shares: 10, mandates: ['par_4'] },
                ],
            });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Cannot create mandate for participant with id par_4. Participant does not exist',
            statusCode: 400,
        });
    });

    it('should throw when creating a session with doubled external ids for participants', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-31T11:30:00.000Z',
                participants: [
                    { id: 'par_1', shares: 20 },
                    { id: 'par_1', shares: 50 },
                    { id: 'par_2', shares: 10, mandates: ['par_1'] },
                ],
            });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Participant with id par_1 occurs multiple times',
            statusCode: 400,
        });
    });

    it('should throw when creating a session with doubled external ids for topics', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-31T11:30:00.000Z',
                topics: [
                    {
                        id: 'top_1',
                        answerOptions: ['yes', 'no', 'abstention'],
                        abstentionAnswerOption: 'abstention',
                        requiredNumberOfShares: 70,
                        majority: {
                            type: 'relative',
                        },
                    },
                    {
                        id: 'top_1',
                        answerOptions: ['yes', 'no'],
                        requiredNumberOfShares: 80,
                        majority: {
                            type: 'qualified',
                            quorumInPercent: 66.66,
                        },
                    },
                ],
            });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Topic with id top_1 occurs multiple times',
            statusCode: 400,
        });
    });
});

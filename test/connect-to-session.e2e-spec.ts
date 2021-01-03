import request from 'supertest';
import { Socket, connect } from 'socket.io-client';
import { INestApplication } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

declare const validToken: string;
declare const socketUrl: string;
declare const app: INestApplication;

describe('Connect to session', () => {
    let session: { id: string };
    const exp = new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime();
    let clientToken: string;
    let unauthenticatedClient: typeof Socket;
    let client: typeof Socket;

    beforeAll(async () => {
        const response = await request(app.getHttpServer())
            .post('/api/v1/sessions')
            .set('Authorization', validToken)
            .send({
                start: '2020-12-24T10:00:00.000Z',
                participants: [
                    { id: 'participant1', shares: 1 },
                    { id: 'participant2', shares: 1 },
                ],
            });

        session = response.body;

        clientToken = sign(
            { sub: 'valid-user-id', exp, sess: session.id, ptc: 'participant1' },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );
    });

    afterAll(async () => {
        client.close();
        unauthenticatedClient.close();
    });

    it('should not be able to connect with an invalid authorization header', () =>
        new Promise((resolve, reject) => {
            unauthenticatedClient = connect(socketUrl);

            unauthenticatedClient.on('disconnect', (reason: string) => {
                expect(reason).toBe('io server disconnect');
                resolve(reason);
            });

            unauthenticatedClient.on('error', reject);
            unauthenticatedClient.on('exception', reject);
        }));

    it('should be able to connect with a valid authorization header', () =>
        new Promise((resolve, reject) => {
            client = connect(socketUrl, {
                transportOptions: { polling: { extraHeaders: { authorization: `Bearer ${clientToken}` } } },
            });

            client.on('connect', () => {
                client.disconnect();
            });

            client.on('disconnect', (reason: string) => {
                expect(reason).toBe('io client disconnect');
                resolve(reason);
            });
            client.on('error', reject);
            client.on('exception', reject);
        }));
});

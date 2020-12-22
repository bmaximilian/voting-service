import { createMock } from '@golevelup/nestjs-testing';
import { CreateSessionRequestResponseFactory } from '../factory/CreateSessionRequestResponseFactory';
import { Session, SessionService } from '../../../../../../domain';
import { ApiRequest } from '../../../../../../infrastructure/security/jwt/ApiRequest';
import { CreateSessionRequest } from '../request/CreateSessionRequest';
import { SessionController } from './SessionController';

describe('SessionController', () => {
    const request = createMock<ApiRequest>({ authorizationToken: { sub: 'clientId' } });
    let controller: SessionController;
    let service: SessionService;

    beforeEach(async () => {
        service = createMock<SessionService>();
        controller = new SessionController(new CreateSessionRequestResponseFactory(), service);
    });

    describe('session', () => {
        it('should return a created session', async () => {
            jest.spyOn(service, 'create').mockImplementation((sess: Session) => Promise.resolve(sess.setId('foo')));

            const createSessionRequest: CreateSessionRequest = {
                start: new Date(),
            };

            const response = await controller.create(request, createSessionRequest);

            expect(service.create).toHaveBeenCalledTimes(1);

            expect(response.start).toEqual(createSessionRequest.start);
            expect(response.end).toBeUndefined();
            expect(response.topics).toBeArrayOfSize(0);
            expect(response.participants).toBeArrayOfSize(0);
            expect(response.id).toEqual('foo');
        });
    });
});

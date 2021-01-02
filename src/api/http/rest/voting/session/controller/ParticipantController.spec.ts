import { createMock } from '@golevelup/nestjs-testing';
import { Mandate, Participant, SessionService } from '../../../../../../domain';
import { ApiRequest } from '../../../../../../infrastructure/security/jwt/ApiRequest';
import { ExternalIdComposer } from '../factory/ExternalIdComposer';
import { CreateParticipantRequestResponseFactory } from '../factory/CreateParticipantRequestResponseFactory';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { ParticipantController } from './ParticipantController';

describe('ParticipantController', () => {
    const request = createMock<ApiRequest>({ authorizationToken: { sub: 'clientId' } });
    let controller: ParticipantController;
    let service: SessionService;

    beforeEach(async () => {
        service = createMock<SessionService>();
        const externalIdComposer = new ExternalIdComposer();
        const participantFactory = new CreateParticipantRequestResponseFactory(externalIdComposer);
        controller = new ParticipantController(participantFactory, service);
    });

    describe('create participant', () => {
        it('should return a created participant', async () => {
            jest.spyOn(service, 'addParticipant').mockImplementation((sessId: string, p: Participant) =>
                Promise.resolve(
                    p
                        .setId(`${sessId}_foo`)
                        .setMandates([new Mandate(new Participant('clientId__other-participant', 1))]),
                ),
            );

            const requestBody: CreateSessionParticipant = {
                id: 'externalId',
                shares: 1,
                mandates: ['other-participant'],
            };

            const response = await controller.create(request, 'sessionId', requestBody);

            expect(service.addParticipant).toHaveBeenCalledTimes(1);

            expect(response.id).toEqual('externalId');
            expect(response.shares).toEqual(1);
            expect(response.mandates).toBeArrayOfSize(1);
            expect(response.mandates).toContain('other-participant');
        });
    });
});

import { Mandate, Participant } from '../../../../../../domain';
import { CreateSessionParticipant } from '../request/CreateSessionParticipant';
import { ExternalIdComposer } from './ExternalIdComposer';
import { CreateParticipantRequestResponseFactory } from './CreateParticipantRequestResponseFactory';

describe('CreateParticipantRequestResponseFactory', () => {
    let factory: CreateParticipantRequestResponseFactory;

    beforeEach(() => {
        const externalIdComposer = new ExternalIdComposer();
        factory = new CreateParticipantRequestResponseFactory(externalIdComposer);
    });

    describe('fromRequest', () => {
        it('should be able to create a participant from the request', () => {
            const request: CreateSessionParticipant = {
                id: 'external-participant-id',
                shares: 1,
            };

            const participant = factory.fromRequest(request, 'the-client');

            expect(participant.getExternalId()).toEqual(`the-client__${request.id}`);
            expect(participant.getShares()).toEqual(1);
            expect(participant.getMandates()).toBeArrayOfSize(0);
        });

        it('should be able to create a participant with mandates from the request', () => {
            const request: CreateSessionParticipant = {
                id: 'external-participant-id',
                shares: 1,
                mandates: ['external-participant-id-2'],
            };

            const participant = factory.fromRequest(request, 'the-client');

            expect(participant.getExternalId()).toEqual(`the-client__${request.id}`);
            expect(participant.getShares()).toEqual(1);
            expect(participant.getMandates()).toBeArrayOfSize(1);
            expect(participant.getMandates()[0].getParticipant().getExternalId()).toEqual(
                'the-client__external-participant-id-2',
            );
            expect(participant.getMandates()[0].getId()).toBeUndefined();
        });

        it('should ignore doubled mandates', () => {
            const request: CreateSessionParticipant = {
                id: 'external-participant-id',
                shares: 1,
                mandates: ['external-participant-id-2', 'external-participant-id-2'],
            };

            const participant = factory.fromRequest(request, 'the-client');

            expect(participant.getExternalId()).toEqual(`the-client__${request.id}`);
            expect(participant.getShares()).toEqual(1);
            expect(participant.getMandates()).toBeArrayOfSize(1);
            expect(participant.getMandates()[0].getParticipant().getExternalId()).toEqual(
                'the-client__external-participant-id-2',
            );
            expect(participant.getMandates()[0].getId()).toBeUndefined();
        });
    });

    describe('toResponse', () => {
        it('should create a response from the participant', () => {
            const participant = new Participant('clientId__externalParticipantId', 1, 'participantId');

            const response = factory.toResponse(participant, 'clientId');

            expect(response.id).toEqual('externalParticipantId');
            expect(response.shares).toEqual(1);
            expect(response.mandates).toBeUndefined();
        });

        it('should create a response from the participant with mandates', () => {
            const participant = new Participant('clientId__externalParticipantId', 1, 'participantId', [
                new Mandate(new Participant('clientId__externalParticipantId1', 1, 'participantId1')),
                new Mandate(
                    new Participant('clientId__externalParticipantId2', 1, 'participantId2', [
                        new Mandate(new Participant('clientId__externalParticipantId1', 1, 'participantId1')),
                    ]),
                ),
            ]);

            const response = factory.toResponse(participant, 'clientId');

            expect(response.id).toEqual('externalParticipantId');
            expect(response.shares).toEqual(1);
            expect(response.mandates).toBeArrayOfSize(2);
            expect(response.mandates).toContain('externalParticipantId1');
            expect(response.mandates).toContain('externalParticipantId2');
        });
    });
});

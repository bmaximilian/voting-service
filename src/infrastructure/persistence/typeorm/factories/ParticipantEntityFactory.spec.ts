import { createMock } from '@golevelup/nestjs-testing';
import { Participant } from '../../../../domain';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { MandateEntity } from '../entities/MandateEntity';
import { ParticipantEntityFactory } from './ParticipantEntityFactory';

describe('ParticipantEntityFactory', () => {
    let factory: ParticipantEntityFactory;

    beforeEach(() => {
        factory = new ParticipantEntityFactory();
    });

    it('should convert a participant to entity', () => {
        const participant = new Participant('externalId', 20, 'participantId');

        const entity = factory.toEntity(participant);

        expect(entity.externalId).toEqual('externalId');
        expect(entity.shares).toEqual(20);
        expect(entity.session).toBeUndefined();
        expect(entity.mandates).toBeUndefined();
        expect(entity.id).toEqual('participantId');
    });

    it('should convert a participant to entity with mandates', () => {
        const mandatedParticipant = new ParticipantEntity();
        mandatedParticipant.externalId = 'mandated1ExternalId';
        mandatedParticipant.shares = 15;
        mandatedParticipant.id = 'mandated1InternalId';
        mandatedParticipant.createdAt = new Date();
        mandatedParticipant.updatedAt = new Date();

        const mandate = createMock<MandateEntity>({
            id: 'nestedMandateId',
            createdAt: new Date(),
            updatedAt: new Date(),
            participant: mandatedParticipant,
        });

        const participant = new Participant('externalId', 20, 'participantId');

        const entity = factory.toEntity(participant, [mandate]);

        expect(entity.externalId).toEqual('externalId');
        expect(entity.shares).toEqual(20);
        expect(entity.session).toBeUndefined();
        expect(entity.id).toEqual('participantId');
        expect(entity.mandates).toBeArrayOfSize(1);
        expect(entity.mandates).toContain(mandate);
    });

    it('should convert a entity without mandates to a participant', () => {
        const entity = new ParticipantEntity();
        entity.externalId = 'externalId';
        entity.shares = 20;
        entity.id = 'internalId';
        entity.createdAt = new Date();
        entity.updatedAt = new Date();

        const participant = factory.fromEntity(entity);

        expect(participant.getMandates()).toBeArrayOfSize(0);
        expect(participant.getExternalId()).toEqual('externalId');
        expect(participant.getShares()).toEqual(20);
        expect(participant.getId()).toEqual('internalId');
    });

    it('should convert a entity with mandates to a participant', () => {
        const nestedMandatedParticipant = new ParticipantEntity();
        nestedMandatedParticipant.externalId = 'nestedMandated1ExternalId';
        nestedMandatedParticipant.shares = 15;
        nestedMandatedParticipant.id = 'nestedMandated1InternalId';
        nestedMandatedParticipant.createdAt = new Date();
        nestedMandatedParticipant.updatedAt = new Date();

        const mandatedParticipant = new ParticipantEntity();
        mandatedParticipant.externalId = 'mandated1ExternalId';
        mandatedParticipant.shares = 10;
        mandatedParticipant.id = 'mandated1InternalId';
        mandatedParticipant.createdAt = new Date();
        mandatedParticipant.updatedAt = new Date();
        mandatedParticipant.mandates = [
            createMock<MandateEntity>({
                id: 'nestedMandateId',
                createdAt: new Date(),
                updatedAt: new Date(),
                participant: nestedMandatedParticipant,
                mandatedBy: mandatedParticipant,
            }),
        ];

        const entity = new ParticipantEntity();
        entity.externalId = 'externalId';
        entity.shares = 20;
        entity.id = 'internalId';
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.mandates = [
            createMock<MandateEntity>({
                id: 'mandateId',
                createdAt: new Date(),
                updatedAt: new Date(),
                participant: mandatedParticipant,
                mandatedBy: entity,
            }),
        ];

        const participant = factory.fromEntity(entity);

        expect(participant.getExternalId()).toEqual('externalId');
        expect(participant.getShares()).toEqual(20);
        expect(participant.getId()).toEqual('internalId');
        expect(participant.getMandates()).toBeArrayOfSize(1);
        expect(participant.getMandates()[0].getId()).toEqual('mandateId');
        expect(participant.getMandates()[0].getParticipant().getId()).toEqual('mandated1InternalId');
        expect(participant.getMandates()[0].getParticipant().getExternalId()).toEqual('mandated1ExternalId');
        expect(participant.getMandates()[0].getParticipant().getShares()).toEqual(10);
        expect(participant.getMandates()[0].getParticipant().getMandates()).toBeArrayOfSize(1);
        expect(participant.getMandates()[0].getParticipant().getMandates()[0].getId()).toEqual('nestedMandateId');
        expect(participant.getMandates()[0].getParticipant().getMandates()[0].getParticipant().getId()).toEqual(
            'nestedMandated1InternalId',
        );
        expect(participant.getMandates()[0].getParticipant().getMandates()[0].getParticipant().getExternalId()).toEqual(
            'nestedMandated1ExternalId',
        );
        expect(participant.getMandates()[0].getParticipant().getMandates()[0].getParticipant().getShares()).toEqual(15);
        expect(
            participant.getMandates()[0].getParticipant().getMandates()[0].getParticipant().getMandates(),
        ).toBeArrayOfSize(0);
    });
});

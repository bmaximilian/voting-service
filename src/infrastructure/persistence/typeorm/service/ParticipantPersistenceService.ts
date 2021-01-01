import { Injectable } from '@nestjs/common';
import { Participant } from '../../../../domain';
import { MandateEntity } from '../entities/MandateEntity';
import { MandateRepository } from '../repositories/MandateRepository';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { ParticipantRepository } from '../repositories/ParticipantRepository';
import { ParticipantEntityFactory } from '../factories/ParticipantEntityFactory';
import { SessionEntity } from '../entities/SessionEntity';

@Injectable()
export class ParticipantPersistenceService {
    public constructor(
        private participantRepository: ParticipantRepository,
        private participantFactory: ParticipantEntityFactory,
        private mandateRepository: MandateRepository,
    ) {}

    public async create(participant: Participant, sessionEntity: SessionEntity): Promise<Participant> {
        const entity = this.participantFactory.toEntity(participant);
        entity.session = sessionEntity;

        const savedParticipant = await this.participantRepository.save(entity);

        return this.participantFactory.fromEntity(savedParticipant);
    }

    public async saveMandates(participants: Participant[], participantEntities: ParticipantEntity[]): Promise<any> {
        const savePromises = participants.map(
            (participant): Promise<void[]> => {
                if (participant.getMandates().length === 0) return Promise.resolve([]);

                const mandatePromises = participant.getMandates().map(async (mandate) => {
                    const mandateEntity = new MandateEntity();

                    mandateEntity.participant = this.findParticipantInEntityArrayByExternalId(
                        mandate.getParticipant().getExternalId(),
                        participantEntities,
                    );
                    mandateEntity.mandatedBy = this.findParticipantInEntityArrayByExternalId(
                        participant.getExternalId(),
                        participantEntities,
                    );

                    const savedMandate = await this.mandateRepository.save(mandateEntity);

                    mandate.setId(savedMandate.id);
                });

                return Promise.all(mandatePromises);
            },
        );

        return Promise.all(savePromises);
    }

    private findParticipantInEntityArrayByExternalId(
        externalId: string,
        entities: ParticipantEntity[],
    ): ParticipantEntity {
        return entities.find((participant) => externalId === participant.externalId);
    }
}

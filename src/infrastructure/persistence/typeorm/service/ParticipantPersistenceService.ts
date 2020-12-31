import { Injectable } from '@nestjs/common';
import { Participant } from '../../../../domain';
import { MandateEntity } from '../entities/MandateEntity';
import { MandateRepository } from '../repositories/MandateRepository';
import { ParticipantEntity } from '../entities/ParticipantEntity';

@Injectable()
export class ParticipantPersistenceService {
    public constructor(private mandateRepository: MandateRepository) {}

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

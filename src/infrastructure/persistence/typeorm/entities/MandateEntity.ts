import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ParticipantEntity } from './ParticipantEntity';

@Entity('mandate')
export class MandateEntity extends BaseEntity {
    @OneToOne(() => ParticipantEntity, { eager: true })
    @JoinColumn({ name: 'mandated_participant_id' })
    public participant: ParticipantEntity;

    @ManyToOne(() => ParticipantEntity, (participant) => participant.mandates, { eager: true })
    @JoinColumn({ name: 'mandated_by_participant_id' })
    public mandatedBy: ParticipantEntity;
}

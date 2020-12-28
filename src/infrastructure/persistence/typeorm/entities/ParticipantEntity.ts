import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { MandateEntity } from './MandateEntity';
import { SessionEntity } from './SessionEntity';

@Entity('participant')
export class ParticipantEntity extends BaseEntity {
    @Column({ name: 'external_id' })
    public externalId: string;

    @Column()
    public shares: number;

    @OneToMany(() => MandateEntity, (mandate) => mandate.mandatedBy, { eager: true, cascade: true })
    public mandates?: MandateEntity[];

    @ManyToOne(() => SessionEntity, (session) => session.participants)
    @JoinColumn({ name: 'voting_session_id' })
    public session: SessionEntity;
}

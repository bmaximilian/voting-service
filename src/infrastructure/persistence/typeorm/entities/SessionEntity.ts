import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ParticipantEntity } from './ParticipantEntity';
import { TopicEntity } from './TopicEntity';

@Entity('voting_session')
export class SessionEntity extends BaseEntity {
    @Column({ name: 'client_id' })
    public clientId: string;

    @Column()
    public start: Date;

    @Column()
    public end?: Date;

    @OneToMany(() => ParticipantEntity, (participant) => participant.session, { eager: true, cascade: true })
    public participants: ParticipantEntity[];

    @OneToMany(() => TopicEntity, (topic) => topic.session, { eager: true, cascade: true })
    public topics: TopicEntity[];
}

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { MandateEntity } from './MandateEntity';
import { ParticipantEntity } from './ParticipantEntity';
import { TopicEntity } from './TopicEntity';

@Entity('voting_ballot')
export class BallotEntity extends BaseEntity {
    @OneToOne(() => ParticipantEntity, { eager: true })
    @JoinColumn({ name: 'participant_id' })
    public participant: ParticipantEntity;

    @Column({ name: 'answer_option' })
    public answerOption: string;

    @OneToOne(() => MandateEntity, { eager: true })
    @JoinColumn({ name: 'mandate_id' })
    public mandate?: MandateEntity;

    @ManyToOne(() => TopicEntity, (topic) => topic.ballots)
    @JoinColumn({ name: 'topic_id' })
    public topic: TopicEntity;
}

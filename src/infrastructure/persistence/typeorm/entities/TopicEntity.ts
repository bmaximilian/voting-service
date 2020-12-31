import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MajorityType } from '../../../../domain';
import { BaseEntity } from './BaseEntity';
import { SessionEntity } from './SessionEntity';
import { BallotEntity } from './BallotEntity';

@Entity('voting_topic')
export class TopicEntity extends BaseEntity {
    @Column({ name: 'external_id' })
    public externalId: string;

    @Column({ name: 'answer_options' })
    public answerOptions: string;

    @Column({ name: 'abstention_answer_option' })
    public abstentionAnswerOption?: string;

    @Column({ name: 'majority_type' })
    public majorityType: MajorityType;

    @Column({ name: 'majority_quorum_in_percent' })
    public majorityQuorumInPercent: number;

    @Column({ name: 'required_number_of_shares_for_quorum' })
    public requiredNumberOfSharesForQuorum: number;

    @Column({ name: 'completed_at' })
    public completedAt: Date;

    @OneToMany(() => BallotEntity, (ballot) => ballot.topic, { eager: true })
    public ballots: BallotEntity[];

    @ManyToOne(() => SessionEntity, (session) => session.topics)
    @JoinColumn({ name: 'voting_session_id' })
    public session: SessionEntity;

    public getAnswerOptions(): string[] {
        try {
            return JSON.parse(this.answerOptions);
        } catch (e) {
            return this.answerOptions as any;
        }
    }

    public setAnswerOptions(answerOptions: string[]): this {
        this.answerOptions = JSON.stringify(answerOptions);

        return this;
    }
}

import { Ballot } from './Ballot';
import { Majority } from './Majority';

export class Topic {
    private id?: string;

    private readonly externalId: string;

    private ballots: Ballot[] = [];

    private readonly answerOptions: string[];

    private readonly abstentionAnswerOption?: string;

    private readonly majority: Majority;

    private readonly requiredNumberOfShares: number;

    private completed: boolean;

    public constructor(
        externalId: string,
        majority: Majority,
        requiredNumberOfShares: number,
        answerOptions: string[],
        abstentionAnswerOption?: string,
        completed = false,
        id?: string,
        ballots: Ballot[] = [],
    ) {
        this.id = id;
        this.externalId = externalId;
        this.ballots = ballots;
        this.answerOptions = answerOptions;
        this.abstentionAnswerOption = abstentionAnswerOption || undefined;
        this.majority = majority;
        this.requiredNumberOfShares = requiredNumberOfShares;
        this.completed = completed;
    }

    public getId(): string | undefined {
        return this.id;
    }

    public setId(id: string): this {
        this.id = id;

        return this;
    }

    public getExternalId(): string {
        return this.externalId;
    }

    public getBallots(): Ballot[] {
        return this.ballots;
    }

    public setBallots(value: Ballot[]): this {
        this.ballots = value;

        return this;
    }

    public getAnswerOptions(): string[] {
        return this.answerOptions;
    }

    public getAbstentionAnswerOption(): string | undefined {
        return this.abstentionAnswerOption;
    }

    public getMajority(): Majority {
        return this.majority;
    }

    public getRequiredNumberOfShares(): number {
        return this.requiredNumberOfShares;
    }

    public setCompleted(isCompleted: boolean): this {
        this.completed = isCompleted;

        return this;
    }

    public isCompleted(): boolean {
        return this.completed;
    }
}

import { Participant } from './Participant';
import { Mandate } from './Mandate';

export class Ballot {
    private id?: string;

    private readonly participant: Participant;

    private readonly answerOption: string;

    private readonly mandate?: Mandate;

    public constructor(participant: Participant, answerOption: string, mandate?: Mandate, id?: string) {
        this.id = id;
        this.participant = participant;
        this.answerOption = answerOption;
        this.mandate = mandate;
    }

    public getId(): string | undefined {
        return this.id;
    }

    public setId(id: string): this {
        this.id = id;

        return this;
    }

    public getParticipant(): Participant {
        return this.participant;
    }

    public getAnswerOption(): string {
        return this.answerOption;
    }

    public getMandate(): Mandate {
        return this.mandate;
    }
}

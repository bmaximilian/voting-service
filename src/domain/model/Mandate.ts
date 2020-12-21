import { Participant } from './Participant'; // eslint-disable-line import/no-cycle

export class Mandate {
    private id?: string;

    private participant: Participant;

    public constructor(participant: Participant, id?: string) {
        this.participant = participant;
        this.id = id;
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

    public setParticipant(participant: Participant): this {
        this.participant = participant;

        return this;
    }
}

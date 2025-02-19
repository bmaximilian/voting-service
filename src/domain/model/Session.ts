import { Participant } from './Participant';
import { Topic } from './Topic';

export class Session {
    private readonly clientId: string;

    private id?: string;

    private start: Date;

    private end?: Date;

    private participants: Participant[] = [];

    private topics: Topic[] = [];

    public constructor(
        clientId: string,
        start: Date,
        end?: Date,
        id?: string,
        participants: Participant[] = [],
        topics: Topic[] = [],
    ) {
        this.clientId = clientId;
        this.start = start;
        this.end = end || undefined;
        this.id = id || undefined;
        this.participants = participants;
        this.topics = topics;
    }

    public getClientId(): string {
        return this.clientId;
    }

    public getId(): string | undefined {
        return this.id;
    }

    public setId(id: string): this {
        this.id = id;

        return this;
    }

    public getStart(): Date {
        return this.start;
    }

    public setStart(start: Date): this {
        this.start = start;

        return this;
    }

    public getEnd(): Date | undefined {
        return this.end;
    }

    public setEnd(end: Date): this {
        this.end = end;

        return this;
    }

    public getParticipants(): Participant[] {
        return this.participants;
    }

    public setParticipants(participants: Participant[]): this {
        this.participants = participants;

        return this;
    }

    public addParticipant(participant: Participant): this {
        this.participants.push(participant);

        return this;
    }

    public getTopics(): Topic[] {
        return this.topics;
    }

    public setTopics(topics: Topic[]): this {
        this.topics = topics;

        return this;
    }

    public addTopic(topic: Topic): this {
        this.topics.push(topic);

        return this;
    }
}

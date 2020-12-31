import { Mandate } from './Mandate'; // eslint-disable-line import/no-cycle

export class Participant {
    private id?: string;

    private readonly externalId: string;

    private mandates: Mandate[] = [];

    private shares: number;

    public constructor(externalId: string, shares: number, id?: string, mandates: Mandate[] = []) {
        this.id = id;
        this.mandates = mandates;
        this.shares = shares;
        this.externalId = externalId;
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

    public getMandates(): Mandate[] {
        return this.mandates;
    }

    public setMandates(mandates: Mandate[]): this {
        this.mandates = mandates;

        return this;
    }

    public getShares(): number {
        return this.shares;
    }

    public setShares(shares: number): this {
        this.shares = shares;

        return this;
    }
}

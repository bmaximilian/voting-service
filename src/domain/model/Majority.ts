export enum MajorityType { // eslint-disable-line no-shadow
    relative = 'relative',
    single = 'single',
    absolute = 'absolute',
    qualified = 'qualified',
}

export class Majority {
    private type: MajorityType;

    private quorumInPercent: number;

    public constructor(type: MajorityType, quorumInPercent = 0) {
        this.type = type;
        this.quorumInPercent = quorumInPercent;
    }

    public getType(): MajorityType {
        return this.type;
    }

    public setType(type: MajorityType): this {
        this.type = type;

        return this;
    }

    public getQuorumInPercent(): number {
        return this.quorumInPercent;
    }

    public setQuorumInPercent(value: number): this {
        this.quorumInPercent = value;

        return this;
    }
}

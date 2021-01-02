export class TopicDuplicatedException extends Error {
    public constructor(public readonly id: string, public readonly clientId: string) {
        super(`Topic with id ${id} occurs multiple times`);
    }
}

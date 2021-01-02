export class ParticipantAlreadyExistsException extends Error {
    public constructor(public readonly id: string, public readonly clientId: string) {
        super(`Participant with id ${id} already exists`);
    }
}
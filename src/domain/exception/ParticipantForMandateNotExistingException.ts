export class ParticipantForMandateNotExistingException extends Error {
    public constructor(public readonly id: string, public readonly clientId: string) {
        super(`Cannot create mandate for participant with id ${id}. Participant does not exist`);
    }
}

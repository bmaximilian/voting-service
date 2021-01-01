export class SessionNotFoundException extends Error {
    public constructor(id: string) {
        super(`Session with the id ${id} not found`);
    }
}

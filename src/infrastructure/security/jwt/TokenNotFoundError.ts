export class TokenNotFoundError extends Error {
    public constructor() {
        super('Token not found');
    }
}

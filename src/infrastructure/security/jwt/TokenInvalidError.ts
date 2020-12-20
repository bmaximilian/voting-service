export class TokenInvalidError extends Error {
    public constructor(errorMessage: string) {
        super(`Token is invalid: ${errorMessage}`);
    }
}

import { sign } from 'jsonwebtoken';
import { TokenInvalidError } from '../jwt/TokenInvalidError';
import { decodeClientPayload } from './decodeClientPayload';

describe('decodeClientPayload', () => {
    it('should throw if the token is undefined', () => {
        expect(() => decodeClientPayload(undefined)).toThrow(TokenInvalidError);
    });

    it('should throw if a token is not encoded with the valid secret', () => {
        const token = sign(
            {
                sub: 'clientId',
                exp: new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime(),
                sess: 'sessionId',
                ptc: 'participantId',
            },
            'invalidSecret',
        );

        expect(() => decodeClientPayload(token)).toThrow(TokenInvalidError);
    });

    it('should throw if the token is expired', () => {
        const token = sign(
            {
                sub: 'clientId',
                exp: new Date(new Date().getTime() - new Date('1970-01-02').getTime()).getTime(),
                sess: 'sessionId',
                ptc: 'participantId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        expect(() => decodeClientPayload(token)).toThrow(TokenInvalidError);
    });

    it('should throw if the token has no sub', () => {
        const token = sign(
            {
                exp: new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime(),
                sess: 'sessionId',
                ptc: 'participantId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        expect(() => decodeClientPayload(token)).toThrow(TokenInvalidError);
    });

    it('should throw if the token has no expiry', () => {
        const token = sign(
            {
                sub: 'clientId',
                sess: 'sessionId',
                ptc: 'participantId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        expect(() => decodeClientPayload(token)).toThrow(TokenInvalidError);
    });

    it('should throw if the token has no session id', () => {
        const token = sign(
            {
                sub: 'clientId',
                exp: new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime(),
                ptc: 'participantId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        expect(() => decodeClientPayload(token)).toThrow(TokenInvalidError);
    });

    it('should throw if the token has no participant id', () => {
        const token = sign(
            {
                sub: 'clientId',
                exp: new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime(),
                sess: 'sessionId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        expect(() => decodeClientPayload(token)).toThrow(TokenInvalidError);
    });

    it('should return the decoded token', () => {
        const exp = new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime();
        const token = sign(
            {
                sub: 'clientId',
                exp,
                sess: 'sessionId',
                ptc: 'participantId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        const decoded = decodeClientPayload(token);

        expect(decoded.sub).toEqual('clientId');
        expect(decoded.exp).toEqual(exp);
        expect(decoded.sess).toEqual('sessionId');
        expect(decoded.ptc).toEqual('participantId');
    });

    it('should support a bearer prefix', () => {
        const exp = new Date(new Date().getTime() + new Date('1970-01-02').getTime()).getTime();
        const token = sign(
            {
                sub: 'clientId',
                exp,
                sess: 'sessionId',
                ptc: 'participantId',
            },
            process.env.JWT_CLIENT_TOKEN_SECRET,
        );

        const decoded = decodeClientPayload(`Bearer ${token}`);

        expect(decoded.sub).toEqual('clientId');
        expect(decoded.exp).toEqual(exp);
        expect(decoded.sess).toEqual('sessionId');
        expect(decoded.ptc).toEqual('participantId');
    });
});

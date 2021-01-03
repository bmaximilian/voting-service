import { createMock } from '@golevelup/nestjs-testing';
import { Handshake } from 'socket.io';
import { decodeClientPayload } from '../../../../../infrastructure/security/clientToken/decodeClientPayload';
import { Participant, Session, SessionService } from '../../../../../domain';
import { TokenInvalidError } from '../../../../../infrastructure/security/jwt/TokenInvalidError';
import { AuthorizedSocket } from '../../AuthorizedSocket';
import { ParticipantNotAuthorizedForSessionException } from '../../exception/ParticipantNotAuthorizedForSessionException';
import { ClientNotAuthorizedForSessionException } from '../../exception/ClientNotAuthorizedForSessionException';
import { VotingGateway } from './VotingGateway';

jest.mock('../../../../../infrastructure/security/clientToken/decodeClientPayload', () => ({
    decodeClientPayload: jest.fn().mockReturnValue({
        sub: 'clientId',
        exp: new Date(new Date().getDate() + 1).toISOString(),
        sess: 'sessionId',
        ptc: 'participantId',
    }),
}));

describe('VotingGateway', () => {
    let gateway: VotingGateway;
    let sessionService: SessionService;
    let socket: AuthorizedSocket;

    beforeEach(() => {
        (decodeClientPayload as jest.Mock).mockClear();
        socket = createMock<AuthorizedSocket>({
            handshake: createMock<Handshake>({
                headers: {
                    authorization: 'auth-token',
                },
            }),
        });
        sessionService = createMock<SessionService>();
        gateway = new VotingGateway(sessionService);
    });

    it('should be instantiable', () => {
        expect(gateway).toBeInstanceOf(VotingGateway);
    });

    it('should handle a undefined headers object', async () => {
        (decodeClientPayload as jest.Mock).mockImplementationOnce(() => {
            throw new TokenInvalidError('error');
        });

        const socketWithoutHeaders = createMock<AuthorizedSocket>({
            handshake: ({} as unknown) as Handshake,
        });

        await expect(gateway.handleConnection(socketWithoutHeaders)).rejects.toThrow(TokenInvalidError);
        expect(decodeClientPayload).toHaveBeenCalledWith(undefined);
    });

    it('should disconnect if the authorization token is invalid', async () => {
        (decodeClientPayload as jest.Mock).mockImplementationOnce(() => {
            throw new TokenInvalidError('error');
        });

        await expect(gateway.handleConnection(socket)).rejects.toThrow(TokenInvalidError);

        expect(decodeClientPayload).toHaveBeenCalledWith('auth-token');

        expect(socket.disconnect).toHaveBeenCalledTimes(1);
        expect(socket.disconnect).toHaveBeenCalledWith(true);

        expect(socket.join).not.toHaveBeenCalled();
    });

    it('should throw and disconnect if the session does not include the participant', async () => {
        const session = new Session('clientId', new Date());
        jest.spyOn(session, 'hasParticipant').mockReturnValue(false);
        jest.spyOn(sessionService, 'findById').mockResolvedValue(session);

        await expect(gateway.handleConnection(socket)).rejects.toThrow(ParticipantNotAuthorizedForSessionException);

        expect(socket.disconnect).toHaveBeenCalledTimes(1);
        expect(socket.disconnect).toHaveBeenCalledWith(true);

        expect(socket.join).not.toHaveBeenCalled();
    });

    it('should throw and disconnect if the session does not belong to the client', async () => {
        const session = new Session('otherClientId', new Date(), undefined, 'sessionId', [
            new Participant('externalParticipantId', 1, 'participantId'),
        ]);
        jest.spyOn(sessionService, 'findById').mockResolvedValue(session);

        await expect(gateway.handleConnection(socket)).rejects.toThrow(ClientNotAuthorizedForSessionException);

        expect(socket.disconnect).toHaveBeenCalledTimes(1);
        expect(socket.disconnect).toHaveBeenCalledWith(true);

        expect(socket.join).not.toHaveBeenCalled();
    });

    it('should connect to the session channel', async () => {
        const session = new Session('clientId', new Date(), undefined, 'sessionId', [
            new Participant('externalParticipantId', 1, 'participantId'),
        ]);
        jest.spyOn(sessionService, 'findById').mockResolvedValue(session);

        await gateway.handleConnection(socket);

        expect(socket.disconnect).not.toHaveBeenCalled();
        expect(socket.join).toHaveBeenCalledWith('sessionId');
    });
});

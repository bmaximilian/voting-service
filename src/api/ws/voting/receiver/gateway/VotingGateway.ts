import { IncomingMessage, ServerResponse } from 'http';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { AuthorizedSocket } from '../../AuthorizedSocket';
import { decodeClientPayload } from '../../../../../infrastructure/security/clientToken/decodeClientPayload';
import { SessionService } from '../../../../../domain';
import { ParticipantNotAuthorizedForSessionException } from '../../exception/ParticipantNotAuthorizedForSessionException';
import { ClientNotAuthorizedForSessionException } from '../../exception/ClientNotAuthorizedForSessionException';
import { ClientTokenPayload } from '../../../../../infrastructure/security/clientToken/ClientTokenPayload';

@WebSocketGateway({
    /* istanbul ignore next */
    handlePreflightRequest(req: IncomingMessage, res: ServerResponse) {
        /* eslint-disable @typescript-eslint/naming-convention */
        const headers = {
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Credentials': 'true',
        };
        /* eslint-enable @typescript-eslint/naming-convention */
        res.writeHead(200, headers);
        res.end();
    },
})
export class VotingGateway {
    private readonly logger = new Logger(VotingGateway.name);

    public constructor(private readonly sessionService: SessionService) {}

    public async handleConnection(@ConnectedSocket() connectedSocket: AuthorizedSocket): Promise<void> {
        try {
            const token = this.decodeToken(connectedSocket);
            await this.connectToSessionChannel(connectedSocket, token);

            this.logger.debug(`Socket client connected. Id: ${connectedSocket.id}`);
        } catch (e) {
            this.logger.debug(e.message);

            connectedSocket.disconnect(true);
        }
    }

    private decodeToken(connectedSocket: AuthorizedSocket): ClientTokenPayload {
        const authorizationHeader = connectedSocket.handshake.headers?.authorization;
        const decodedToken = decodeClientPayload(authorizationHeader);

        // eslint-disable-next-line no-param-reassign
        connectedSocket.token = decodedToken;

        return decodedToken;
    }

    private async connectToSessionChannel(connectedSocket: AuthorizedSocket, token: ClientTokenPayload): Promise<void> {
        const session = await this.sessionService.findById(token.sess);
        if (!session.hasParticipant(token.ptc)) {
            throw new ParticipantNotAuthorizedForSessionException();
        }
        if (session.getClientId() !== token.sub) {
            throw new ClientNotAuthorizedForSessionException();
        }

        connectedSocket.join(session.getId());
    }
}

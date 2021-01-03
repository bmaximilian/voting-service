import { WebSocketGateway } from '@nestjs/websockets';
import { AbstractSessionMessagingGateway } from '../../../../../domain';

@WebSocketGateway()
export class SessionGateway extends AbstractSessionMessagingGateway {
    // @WebSocketServer()
    // private readonly server: Server;
}

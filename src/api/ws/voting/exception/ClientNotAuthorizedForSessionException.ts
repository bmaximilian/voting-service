import { WsException } from '@nestjs/websockets';

export class ClientNotAuthorizedForSessionException extends WsException {
    public constructor() {
        super('Client is not authorized to connect to requested session');
    }
}

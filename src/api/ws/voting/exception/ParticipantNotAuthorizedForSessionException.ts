import { WsException } from '@nestjs/websockets';

export class ParticipantNotAuthorizedForSessionException extends WsException {
    public constructor() {
        super('Participant is not authorized to connect to requested session');
    }
}

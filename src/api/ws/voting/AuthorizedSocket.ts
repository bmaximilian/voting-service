import { Socket } from 'socket.io';
import { ClientTokenPayload } from '../../../infrastructure/security/clientToken/ClientTokenPayload';

export interface AuthorizedSocket extends Socket {
    token: ClientTokenPayload;
}

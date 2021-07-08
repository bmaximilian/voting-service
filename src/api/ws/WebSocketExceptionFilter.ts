import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
    /**
     * Catches and processes the exception
     *
     * @param exception - Thrown error
     * @param host - Argument host
     */
    public catch(exception: Error, host: ArgumentsHost): void {
        super.catch(new WsException(exception.message), host);
    }
}

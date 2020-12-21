import { Injectable } from '@nestjs/common';
import { AbstractSessionPersistenceService, Session } from '../../../../domain';

@Injectable()
export class SessionPersistenceService extends AbstractSessionPersistenceService {
    public async create(session: Session): Promise<Session> {
        session.setId('1234');

        return session;
    }
}

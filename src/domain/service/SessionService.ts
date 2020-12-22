import { Injectable } from '@nestjs/common';
import { Session } from '../model/Session';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';

@Injectable()
export class SessionService {
    public constructor(private sessionPersistenceService: AbstractSessionPersistenceService) {}

    public async create(session: Session): Promise<Session> {
        return this.sessionPersistenceService.create(session);
    }
}

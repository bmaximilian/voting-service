import { Session } from '../model/Session';
import { Participant } from '../model/Participant';
import { Topic } from '../model/Topic';
import { AbstractSessionPersistenceService } from '../persistence/AbstractSessionPersistenceService';

export class SessionService {
    public constructor(private sessionPersistenceService: AbstractSessionPersistenceService) {}

    public async create(start: Date, participants: Participant[], topics: Topic[]): Promise<Session> {
        const session = new Session(start, undefined, undefined, participants, topics);

        return this.sessionPersistenceService.create(session);
    }
}

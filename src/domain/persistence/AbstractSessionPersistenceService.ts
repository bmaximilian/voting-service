import { Session } from '../model/Session';

export abstract class AbstractSessionPersistenceService {
    public abstract create(session: Session): Promise<Session>;
}

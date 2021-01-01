import { Session } from '../model/Session';

export abstract class AbstractSessionPersistenceService {
    public abstract create(session: Session): Promise<Session>;

    public abstract findById(id: string): Promise<Session>;

    public abstract save(session: Session): Promise<Session>;
}

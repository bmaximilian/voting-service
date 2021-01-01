import { Session } from '../model/Session';

export abstract class AbstractSessionPersistenceService {
    public abstract create(session: Session): Promise<Session>;

    /**
     * @throws {SessionNotFoundException} - When the session is not found
     */
    public abstract findById(id: string): Promise<Session>;

    public abstract save(session: Session): Promise<Session>;
}

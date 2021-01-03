import { SessionGateway } from './SessionGateway';

describe('SessionGateway', () => {
    let gateway: SessionGateway;

    beforeEach(() => {
        gateway = new SessionGateway();
    });

    it('should be instantiable', () => {
        expect(gateway).toBeInstanceOf(SessionGateway);
    });
});

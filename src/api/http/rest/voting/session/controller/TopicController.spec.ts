import { createMock } from '@golevelup/nestjs-testing';
import { MajorityType, SessionService, Topic } from '../../../../../../domain';
import { ApiRequest } from '../../../../../../infrastructure/security/jwt/ApiRequest';
import { CreateSessionTopic } from '../request/CreateSessionTopic';
import { ExternalIdComposer } from '../factory/ExternalIdComposer';
import { CreateTopicRequestResponseFactory } from '../factory/CreateTopicRequestResponseFactory';
import { TopicController } from './TopicController';

describe('TopicController', () => {
    const request = createMock<ApiRequest>({ authorizationToken: { sub: 'clientId' } });
    let controller: TopicController;
    let service: SessionService;

    beforeEach(async () => {
        service = createMock<SessionService>();
        const externalIdComposer = new ExternalIdComposer();
        const topicFactory = new CreateTopicRequestResponseFactory(externalIdComposer);
        controller = new TopicController(topicFactory, service);
    });

    describe('create topic', () => {
        it('should return a created topic', async () => {
            jest.spyOn(service, 'addTopic').mockImplementation((sessId: string, t: Topic) =>
                Promise.resolve(t.setId(`${sessId}_foo`)),
            );

            const requestBody: CreateSessionTopic = {
                id: 'externalId',
                answerOptions: ['yes', 'no', 'abstention'],
                abstentionAnswerOption: 'abstention',
                requiredNumberOfShares: 70,
                majority: {
                    type: MajorityType.relative,
                },
            };

            const response = await controller.create(request, 'sessionId', requestBody);

            expect(service.addTopic).toHaveBeenCalledTimes(1);

            expect(response.id).toEqual('externalId');
            expect(response.answerOptions).toEqual(['yes', 'no', 'abstention']);
            expect(response.abstentionAnswerOption).toEqual('abstention');
            expect(response.requiredNumberOfShares).toEqual(70);
            expect(response.majority).toEqual({
                type: MajorityType.relative,
            });
        });
    });
});

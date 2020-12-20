import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './HealthCheckController';

describe('HealthCheckController', () => {
    let appController: HealthCheckController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [HealthCheckController],
        }).compile();

        appController = app.get<HealthCheckController>(HealthCheckController);
    });

    describe('health-check', () => {
        it('should be available', () => {
            expect(appController.getHealthCheck()).toBeUndefined();
        });
    });
});

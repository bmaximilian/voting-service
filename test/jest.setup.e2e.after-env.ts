import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { ApplicationModule } from '../src/ApplicationModule';

(global as any).app = undefined;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [ApplicationModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    (global as any).app = app;
});

afterAll(async () => {
    await (global as any).app.close();
});

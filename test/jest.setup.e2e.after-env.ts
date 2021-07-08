import { Test, TestingModule } from '@nestjs/testing';
import { Logger, ValidationPipe } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ApplicationModule } from '../src/ApplicationModule';

(global as any).app = undefined;
(global as any).validToken = undefined;
(global as any).socketPort = 3002;
(global as any).socketUrl = `ws://localhost:${(global as any).socketPort}`;

beforeAll(async () => {
    Logger.overrideLogger([]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [ApplicationModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    await app.listen((global as any).socketPort);
    (global as any).app = app;

    (global as any).validToken = sign({ sub: 'valid-user-id' }, 'internal-secret');
});

afterAll(async () => {
    await (global as any).app.close();
});

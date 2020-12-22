import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationModule } from './ApplicationModule';

export async function bootstrap(port: number | string): Promise<INestApplication> {
    const logger = new Logger();
    const app = await NestFactory.create(ApplicationModule, { logger: process.env.NODE_ENV !== 'test' });
    app.enableCors({
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: [],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        origin: '*',
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const options = new DocumentBuilder()
        .setTitle('Voting Service')
        .setDescription('An API empowering tools to add online voting functionality')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);

    logger.log({ message: 'server started 🚀', port, url: `http://localhost:${port}/api` });

    return app;
}

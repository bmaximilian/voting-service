import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../ormconfig';
import { JwtDecodeMiddleware } from './infrastructure/security/jwt/JwtDecodeMiddleware';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory() {
                return {
                    ...typeOrmConfig,
                };
            },
        }),
    ],
})
export class ApplicationModule {
    /**
     * Configure the module
     *
     * @param consumer - The middleware consumer
     */
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(JwtDecodeMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

import { RedisModuleAsyncOptions } from "@liaoliaots/nestjs-redis";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const redis_patients_config: RedisModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        config: {
            namespace: configService.get('REDIS_NAMESPACE'),
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
        },
    }),
};

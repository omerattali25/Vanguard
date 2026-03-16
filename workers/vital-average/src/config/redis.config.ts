import { RedisModuleAsyncOptions } from "@liaoliaots/nestjs-redis";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const redis_vital_average_config: RedisModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        config: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
        },
    }),
};

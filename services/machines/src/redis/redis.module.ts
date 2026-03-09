import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(`redis://${process.env.REDIS_CLIENT_HOST}:${process.env.REDIS_CLIENT_PORT}`);
      },
    },
    {
      provide: 'REDLOCK',
      inject: ['REDIS_CLIENT'],
      useFactory: (client: Redis) => {
        return new Redlock([client as any], {
          retryCount: 5,
          retryDelay: 200,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT', 'REDLOCK'],
})
export class RedisModule {}

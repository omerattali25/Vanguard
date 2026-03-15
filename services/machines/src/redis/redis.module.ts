import { Module } from '@nestjs/common';
import Redis from 'ioredis';
const Redlock = require('redlock');

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(
          `redis://${process.env.REDIS_CLIENT_HOST}:${process.env.REDIS_CLIENT_PORT}`,
        );
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}

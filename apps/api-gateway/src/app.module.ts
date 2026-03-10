import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VitalsModule } from './modules/vitals/vitals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VitalsModule,
  ],
})
export class AppModule {}

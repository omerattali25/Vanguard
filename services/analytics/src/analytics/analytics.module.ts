import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineAction } from '@vanguard/types'
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
    imports: [TypeOrmModule.forFeature([MachineAction])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService]
})

export class AnalyticsModule { }

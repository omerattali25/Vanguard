import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VitalsController } from './vitals.controller';
import { VitalsService } from './vitals.service';

@Module({
  imports: [HttpModule],
  controllers: [VitalsController],
  providers: [VitalsService],
})
export class VitalsModule {}

import { Module } from '@nestjs/common';
import { PagesStateService } from './pages-state.service';

@Module({
  providers: [PagesStateService],
  exports: [PagesStateService]
})
export class PagesStateModule {}

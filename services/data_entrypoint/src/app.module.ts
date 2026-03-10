import { Module } from '@nestjs/common';
import { TransformerModule } from './modules/transformer/transformer.module';

@Module({
  imports: [TransformerModule],
  controllers: [],
})  
export class DataEntrypointModule {}

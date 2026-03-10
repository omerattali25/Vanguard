import { Controller, Get } from '@nestjs/common';

@Controller()
export class DataEntrypointController {
  constructor() {}

  @Get()
  healthCheck(): string {
    return 'Data Entrypoint is running!';
  }
}

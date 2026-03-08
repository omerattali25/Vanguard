import { Controller } from '@nestjs/common';
@Controller()
export class AppController {
  healthCheck(): string {
    return 'OK';
  }
}

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';


@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @Inject('VITALS_SERVICE') private readonly vitalsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.vitalsClient.getService<any>('VITALS_SERVICE');
  }
}

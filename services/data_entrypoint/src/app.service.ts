import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  handleMessage(message:string){
    console.log(message)
  }
}

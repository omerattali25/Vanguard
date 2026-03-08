import { Test, TestingModule } from '@nestjs/testing';
import { EntryPointController } from './entrypoint.controller';
import { EntryPointService } from './entrypoint.service';

describe('AppController', () => {
  let appController: EntryPointController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EntryPointController],
      providers: [EntryPointService],
    }).compile();

    appController = app.get<EntryPointController>(EntryPointController);
  });

  describe('root', () => {

  });
});

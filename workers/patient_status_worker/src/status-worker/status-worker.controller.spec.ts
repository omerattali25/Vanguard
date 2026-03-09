import { Test, TestingModule } from '@nestjs/testing';
import { StatusWorkerController } from './status-worker.controller';

describe('StatusWorkerController', () => {
  let controller: StatusWorkerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusWorkerController],
    }).compile();

    controller = module.get<StatusWorkerController>(StatusWorkerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

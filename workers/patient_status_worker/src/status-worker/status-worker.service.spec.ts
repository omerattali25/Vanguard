import { Test, TestingModule } from '@nestjs/testing';
import { StatusWorkerService } from './status-worker.service';

describe('StatusWorkerService', () => {
  let service: StatusWorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusWorkerService],
    }).compile();

    service = module.get<StatusWorkerService>(StatusWorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

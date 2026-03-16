import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine } from '@vanguard/types';

describe('MachinesController', () => {
  let controller: MachinesController;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        MachinesService,
        {
          provide: getRepositoryToken(Machine),
          useValue: mockRepo,
        },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { Repository } from 'typeorm';
import { Machine } from './entity/machine.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
const Redlock = require('redlock');

describe('MachinesService', () => {
  let service: MachinesService;
  let machineRepo: Repository<Machine>;
  let redlock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: 'REDLOCK',
          useValue: {
            lock: jest.fn(),
            unlock: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Machine),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    machineRepo = module.get<jest.Mocked<Repository<Machine>>>(
      getRepositoryToken(Machine),
    );
    redlock = module.get<any>('REDLOCK');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all machines', async () => {
    const machines = [{ id: '1' }, { id: '2' }];
    (machineRepo.find as jest.Mock).mockResolvedValue(machines);

    const result = await service.getMachines();

    expect(result).toEqual(machines);
    expect(machineRepo.find).toHaveBeenCalled();
  });

  it('should return all machines', async () => {
    const machines = [{ id: '1' }, { id: '2' }];
    (machineRepo.find as jest.Mock).mockResolvedValue(machines);

    const result = await service.getMachines();

    expect(result).toEqual(machines);
    expect(machineRepo.find).toHaveBeenCalled();
  });

  it('should create and save a machine', async () => {
    const dto = { name: 'X', location: 'Y' };
    const entity = { id: '1', ...dto };

    (machineRepo.create as jest.Mock).mockReturnValue(entity);
    (machineRepo.save as jest.Mock).mockResolvedValue(entity);

    const result = await service.saveMachine(dto);

    expect(machineRepo.create).toHaveBeenCalledWith(dto);
    expect(machineRepo.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  const mockLock = {
    unlock: jest.fn(),
  };

  it('should lock, update machine, and release lock', async () => {
    const id = '123';
    const patient = 'John';
    const machine = { id, assigned: null };

    (redlock.lock as jest.Mock).mockResolvedValue(mockLock);
    (machineRepo.findOne as jest.Mock).mockResolvedValue(machine);
    (machineRepo.save as jest.Mock).mockResolvedValue({
      ...machine,
      assigned: patient,
    });

    await service.changePatient(id, patient);

    expect(redlock.lock).toHaveBeenCalledWith(`lock:resource:${id}`, 15000);
    expect(machineRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(machineRepo.save).toHaveBeenCalledWith({
      ...machine,
      assigned: patient,
    });
    expect(mockLock.unlock).toHaveBeenCalled();
  });

  it('should throw if machine not found', async () => {
    (redlock.lock as jest.Mock).mockResolvedValue(mockLock);
    (machineRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.changePatient('1', 'John')).rejects.toThrow(
      'Machine with id 1 not found',
    );
  });

  it('should throw if lock cannot be acquired', async () => {
    (redlock.lock as jest.Mock).mockRejectedValue(new Error('Lock failed'));

    await expect(service.changePatient('1', 'John')).rejects.toThrow(
      'Lock failed',
    );
  });
});

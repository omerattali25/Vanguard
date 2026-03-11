import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine, MachineStatus } from './entity/machine.entity';
import { Repository } from 'typeorm';

let repo: Repository<Machine>;
let redisClient: any;
let service: MachinesService;

beforeEach(async () => {
  redisClient = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const module = await Test.createTestingModule({
    providers: [
      MachinesService,
      {
        provide: getRepositoryToken(Machine),
         useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
      },             
      {           
        provide: 'REDIS_CLIENT',
        useValue: redisClient,
      },
    ],
  }).compile();

  service = module.get<MachinesService>(MachinesService);
   repo = module.get<jest.Mock<Repository<Machine>>>(getRepositoryToken(Machine));
});


  // ---------------------------------------------------------
  // getMachines
  // ---------------------------------------------------------
  it('should return all machines', async () => {
    repo.find!.mockResolvedValue([
      {
        id: '1',
        name: 'A',
        location: 'חדר מכונות',
        status: MachineStatus.AVALIBLE,
        assigned: '',
      },
    ]);

    const result = await service.getMachines();

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('A');
  });

  // ---------------------------------------------------------
  // saveMachine
  // ---------------------------------------------------------
  it('should save a new machine', async () => {
    const dto = { name: 'A' };

    repo.create!.mockReturnValue({
      name: 'A',
      location: 'חדר מכונות',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    });

    repo.save!.mockResolvedValue({
      id: '1',
      name: 'A',
      location: 'חדר מכונות',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    });

    const result = await service.saveMachine(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe('1');
  });

  // ---------------------------------------------------------
  // updateMachine
  // ---------------------------------------------------------
  it('should update a machine', async () => {
    repo.findOne!.mockResolvedValue({ id: '1' });

    await service.updateMachine({
      id: '1',
      name: 'New',
      location: 'Loc',
      status: MachineStatus.USED,
    });

    expect(repo.update).toHaveBeenCalled();
  });

  it('should return error if machine not found', async () => {
    repo.findOne!.mockResolvedValue(null);

    const result = await service.updateMachine({
      id: '1',
      name: 'New',
      location: 'Loc',
      status: MachineStatus.USED,
    });

    expect(result).toBe('משתמש לא נמצא');
  });

  // ---------------------------------------------------------
  // startChangePatient (lock acquire)
  // ---------------------------------------------------------
  it('should acquire lock and return lockId + expiration', async () => {
    redisClient.set.mockResolvedValue('OK');

    const result = await service.startChangePatient('123');

    expect(redisClient.set).toHaveBeenCalled();
    expect(result.lockId).toBeDefined();
    expect(result.expiration).toBeDefined();
  });

  it('should throw if lock already exists', async () => {
    redisClient.set.mockResolvedValue(null);

    await expect(service.startChangePatient('123')).rejects.toThrow(
      'Resource is already locked'
    );
  });

  // ---------------------------------------------------------
  // changePatient (lock validation + update)
  // ---------------------------------------------------------
  it('should update machine when lock is valid', async () => {
    redisClient.get.mockResolvedValue('token123');

    repo.findOne!.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'חדר מכונות',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    });

    repo.save!.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'חדר מכונות',
      status: MachineStatus.AVALIBLE,
      assigned: 'John',
    });

    const result = await service.changePatient('123', 'John', 'token123');

    expect(redisClient.get).toHaveBeenCalledWith('locks:machine:123');
    expect(repo.save).toHaveBeenCalled();
    expect(redisClient.del).toHaveBeenCalledWith('locks:machine:123');
    expect(result.assigned).toBe('John');
  });

  it('should throw if lock not found', async () => {
    redisClient.get.mockResolvedValue(null);

    await expect(
      service.changePatient('123', 'John', 'token123')
    ).rejects.toThrow('Lock not found or expired');
  });

  it('should throw if lock token is invalid', async () => {
    redisClient.get.mockResolvedValue('wrongToken');

    await expect(
      service.changePatient('123', 'John', 'token123')
    ).rejects.toThrow('Invalid lock token');
  });

  it('should delete lock and throw if machine not found', async () => {
    redisClient.get.mockResolvedValue('token123');
    repo.findOne!.mockResolvedValue(null);

    await expect(
      service.changePatient('123', 'John', 'token123')
    ).rejects.toThrow('Machine not found');

    expect(redisClient.del).toHaveBeenCalledWith('locks:machine:123');
  });

  // ---------------------------------------------------------
  // CONCURRENT ACCESS TESTS
  // ---------------------------------------------------------
  it('should allow only one concurrent lock', async () => {
    redisClient.set
      .mockResolvedValueOnce('OK') // first request acquires lock
      .mockResolvedValueOnce(null); // second request denied

    const first = service.startChangePatient('123');
    const second = service.startChangePatient('123');

    const results = await Promise.allSettled([first, second]);

    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
  });

  it('should allow only the correct token to update concurrently', async () => {
    redisClient.get
      .mockResolvedValueOnce('tokenA')
      .mockResolvedValueOnce('tokenA');

    repo.findOne!.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'חדר מכונות',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    });

    repo.save!.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'חדר מכונות',
      status: MachineStatus.AVALIBLE,
      assigned: 'John',
    });

    const first = service.changePatient('123', 'John', 'tokenA');
    const second = service.changePatient('123', 'John', 'tokenB');

    const results = await Promise.allSettled([first, second]);

    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
  });
});

import { Test } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine, MachineStatus } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineAction } from './entity/machine.action.entity';
import {Patient} from '@vanguard/types';
import {PatientStatus} from '@vanguard/types'

let repo: jest.Mocked<Repository<Machine>>;
let actionsRepo: jest.Mocked<Repository<MachineAction>>;
let patientsRepo: jest.Mocked<Repository<Patient>>;
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
        provide: getRepositoryToken(MachineAction),
        useValue: {
          create: jest.fn(),
          save: jest.fn(),
          find: jest.fn(),
        },
      },
       {
        provide: getRepositoryToken(Patient),
        useValue: {
          create: jest.fn(),
          save: jest.fn(),
          find: jest.fn(),
          findOne: jest.fn(),
        },
      },
      {
        provide: 'REDIS_CLIENT',
        useValue: redisClient,
      },
    ],
  }).compile();

  service = module.get<MachinesService>(MachinesService);
  repo = module.get(getRepositoryToken(Machine)) as jest.Mocked<
    Repository<Machine>
  >;
  actionsRepo = module.get(getRepositoryToken(MachineAction)) as jest.Mocked<
    Repository<MachineAction>
  >;
  patientsRepo = module.get(getRepositoryToken(Patient)) as jest.Mocked<
    Repository<Patient>
  >;
});

it('should be defined', () => {
  expect(service).toBeDefined();
});

it('should create a new machine', async () => {
  const dto = { name: 'Machine X', location: 'storage', status: MachineStatus.AVALIBLE };

  repo.create!.mockReturnValue({
    id: 'm123',
    name: 'Machine X',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
    assigned: '',
  });

  repo.save!.mockResolvedValue({
    id: 'm123',
    name: 'Machine X',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
    assigned: '',
  });

  const result = await service.saveMachine(dto);

  expect(repo.create).toHaveBeenCalledWith(dto);
  expect(repo.save).toHaveBeenCalled();
  expect(result.id).toBe('m123');
  expect(result.name).toBe('Machine X');
});

it('should get all machines', async () => {
  repo.find!.mockResolvedValue([
    {
      id: '1',
      name: 'A',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    },
    {
      id: '2',
      name: 'B',
      location: 'room 2',
      status: MachineStatus.USED,
      assigned: 'John',
    },
  ]);

  const result = await service.getMachines();

  expect(repo.find).toHaveBeenCalled();
  expect(result.length).toBe(2);
  expect(result[0].name).toBe('A');
  expect(result[1].assigned).toBe('John');
});


it('should update a machine', async () => {
  repo.findOne!.mockResolvedValue({
    id: '1',
    name: 'A',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
    assigned: '',
  });

  await service.updateMachine({ id: '1', name: 'New1' });

  expect(repo.update).toHaveBeenCalled();
});

it('should return error if machine not found', async () => {
  repo.findOne!.mockResolvedValue(null);

  const result = await service.updateMachine({
    id: '2',
    name: 'New',
    location: 'Loc',
  });

  expect(result).toBe('machine with this id not found');
});

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
    'Resource is already locked',
  );
});

it('should update machine when lock is valid', async () => {
  redisClient.get.mockResolvedValue('token123');
  patientsRepo.findOne!.mockResolvedValue({ id: 'John', name: 'John Doe',status:PatientStatus.Stable,city:"New York",registered_at:"12.1.2023"});

  repo.findOne!.mockResolvedValue({
    id: '123',
    name: 'A',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
    assigned: '',
  });

  repo.save!.mockResolvedValue({
    id: '123',
    name: 'A',
    location: 'storage',
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
    service.changePatient('123', 'John', 'token123'),
  ).rejects.toThrow('Lock not found or expired');
});

it('should throw if lock token is invalid', async () => {
  redisClient.get.mockResolvedValue('wrongToken');

  await expect(
    service.changePatient('123', 'John', 'token123'),
  ).rejects.toThrow('Invalid lock token');
});

it('should delete lock and throw if machine not found', async () => {
  redisClient.get.mockResolvedValue('token123');
  patientsRepo.findOne!.mockResolvedValue({ id: 'John', name: 'John Doe',status:PatientStatus.Stable,city:"New York",registered_at:"12.1.2023" });
  repo.findOne!.mockResolvedValue(null);

  await expect(
    service.changePatient('123', 'John', 'token123'),
  ).rejects.toThrow('Machine not found');

  expect(redisClient.del).toHaveBeenCalledWith('locks:machine:123');
});

it('should allow only one concurrent lock', async () => {
  redisClient.set.mockResolvedValueOnce('OK').mockResolvedValueOnce(null);

  const first = service.startChangePatient('123');
  const second = service.startChangePatient('123');

  const results = await Promise.allSettled([first, second]);

  expect(results[0].status).toBe('fulfilled');
  expect(results[1].status).toBe('rejected');
});

it('should allow only the correct token to update concurrently', async () => {
  redisClient.get.mockResolvedValueOnce('tokenA').mockResolvedValueOnce('tokenA');
  patientsRepo.findOne!.mockResolvedValue({ id: 'John', name: 'John Doe',status:PatientStatus.Stable,city:"New York",registered_at:"12.1.2023"});

  repo.findOne!.mockResolvedValue({
    id: '123',
    name: 'A',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
    assigned: '',
  });


  repo.save!.mockResolvedValue({
    id: '123',
    name: 'A',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
    assigned: 'John',
  });

  const first = service.changePatient('123', 'John', 'tokenA');
  const second = service.changePatient('123', 'John', 'tokenB');

  const results = await Promise.allSettled([first, second]);

  expect(results[0].status).toBe('fulfilled');
  expect(results[1].status).toBe('rejected');
});

it('should write a MachineAction when connecting a new patient', async () => {
  redisClient.get.mockResolvedValue('token123');
  patientsRepo.findOne!.mockResolvedValue({ id: 'John', name: 'John Doe',status:PatientStatus.Stable,city:"New York",registered_at:"12.1.2023"});

  repo.findOne!.mockResolvedValue({
    id: '123',
    name: 'Machine A',
    assigned: '',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
  });

  repo.save!.mockResolvedValue({
    id: '123',
    name: 'Machine A',
    assigned: 'John',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
  });

  actionsRepo.create!.mockReturnValue({id:'actionId', machine_id: '123', patient_id: 'John', description: 'connected patient John to machine Machine A', trigerd_at: new Date() });
  actionsRepo.save!.mockResolvedValue({id:'actionId', machine_id: '123', patient_id: 'John', description: 'connected patient John to machine Machine A', trigerd_at: new Date() });

  await service.changePatient('123', 'John', 'token123');

  expect(actionsRepo.create).toHaveBeenCalledWith(
    expect.objectContaining({
      machine_id: '123',
      patient_id: 'John',
      description: expect.stringContaining('connected patient John'),
    }),
  );

  expect(actionsRepo.save).toHaveBeenCalledTimes(1);
});

it('should write two MachineActions when replacing an existing patient', async () => {
  redisClient.get.mockResolvedValue('token123');
  patientsRepo.findOne!.mockResolvedValue({ id: 'NewPatient', name: 'New Patient',status:PatientStatus.Stable,city:"New York",registered_at:"12.1.2023" });

  repo.findOne!.mockResolvedValue({
    id: '123',
    name: 'Machine A',
    assigned: 'OldPatient',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
  });

  repo.save!.mockResolvedValue({
    id: '123',
    name: 'Machine A',
    assigned: 'NewPatient',
    location: 'storage',
    status: MachineStatus.AVALIBLE,
  });

  actionsRepo.create!.mockReturnValue({id:'actionId', machine_id: '123', patient_id: 'NewPatient', description: 'connected patient NewPatient to machine Machine A', trigerd_at: new Date() });
  actionsRepo.save!.mockResolvedValue({id:'actionId', machine_id: '123', patient_id: 'NewPatient', description: 'connected patient NewPatient to machine Machine A', trigerd_at: new Date() });

  await service.changePatient('123', 'NewPatient', 'token123');

  expect(actionsRepo.save).toHaveBeenCalledTimes(2);

  expect(actionsRepo.create).toHaveBeenCalledWith(
    expect.objectContaining({
      patient_id: 'NewPatient',
      description: expect.stringContaining('connected patient NewPatient'),
    }),
  );

  expect(actionsRepo.create).toHaveBeenCalledWith(
    expect.objectContaining({
      patient_id: 'OldPatient',
      description: expect.stringContaining('disconnected patient OldPatient'),
    }),
  );
});

it('should NOT write MachineActions if patient not found', async () => {
  redisClient.get.mockResolvedValue('token123');
  patientsRepo.findOne!.mockResolvedValue(null);

  await expect(
    service.changePatient('123', 'John', 'token123'),
  ).rejects.toThrow('Patient not found');

  expect(actionsRepo.save).not.toHaveBeenCalled();
});

it('should NOT write MachineActions if machine not found', async () => {
  redisClient.get.mockResolvedValue('token123');
  patientsRepo.findOne!.mockResolvedValue({ id: 'John', name: 'John Doe',status:PatientStatus.Stable,city:"New York",registered_at:"12.1.2023" });
  repo.findOne!.mockResolvedValue(null);

  await expect(
    service.changePatient('123', 'John', 'token123'),
  ).rejects.toThrow('Machine not found');

  expect(actionsRepo.save).not.toHaveBeenCalled();
});



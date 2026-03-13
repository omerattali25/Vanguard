import { Test } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine, MachineStatus } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineAction, MachineActionType } from './entity/machine.action.entity';
import {Patient} from '@vanguard/types';
import {PatientStatus} from '@vanguard/types'

let machineRepo: jest.Mocked<Repository<Machine>>;
let actionsRepo: jest.Mocked<Repository<MachineAction>>;
let patientsRepo: jest.Mocked<Repository<Patient>>;
let redisClient: any;
let service: MachinesService;

beforeEach(async () => {
  redisClient = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    publish:jest.fn()
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
  machineRepo = module.get(getRepositoryToken(Machine)) as jest.Mocked<
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


  it('returns all machines with patient names converted', async () => {
    machineRepo.find.mockResolvedValue([
      { id: 'm1', name: 'fnvfp', location: 'storage', status: MachineStatus.AVALIBLE, assigned: 'p1' } as any,
    ]);

    patientsRepo.findOne.mockResolvedValue({ id: 'p1', name: 'John Doe' } as any);

    const result = await service.getMachines();

    expect(result[0].assigned).toBe('John Doe');
  });

  it('saves a new machine and publishes it', async () => {
    const dto = { name: 'Machine X', location: 'storage' } as any;

    machineRepo.create.mockReturnValue(dto);
    machineRepo.save.mockResolvedValue({
      id: 'm1',
      name: 'Machine X',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    patientsRepo.findOne.mockResolvedValue(null);

    const result = await service.saveMachine(dto);

    expect(machineRepo.save).toHaveBeenCalled();
    expect(redisClient.publish).toHaveBeenCalled();
    expect(result.id).toBe('m1');
  });

  it('updates a machine', async () => {
    machineRepo.findOne.mockResolvedValue({
      id: '1',
      name: 'Old',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    await service.updateMachine('1', { name: 'NewName' });

    expect(machineRepo.save).toHaveBeenCalled();
  });

  it('returns error string if machine not found', async () => {
    machineRepo.findOne.mockResolvedValue(null);

    const result = await service.updateMachine('2', { name: 'X' });

    expect(result).toBe('machine with this id not found');
  });

  it('acquires lock and returns lockId + expiration', async () => {
    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    redisClient.set.mockResolvedValue('OK');

    const result = await service.startChangePatient('123');

    expect(result.lockId).toBeDefined();
    expect(result.expiration).toBeDefined();
  });

  it('throws if lock already exists', async () => {
    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    redisClient.set.mockResolvedValue(null);

    await expect(service.startChangePatient('123')).rejects.toThrow(
      'Resource is already locked',
    );
  });

  it('allows only one concurrent lock', async () => {
    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    redisClient.set
      .mockResolvedValueOnce('OK')
      .mockResolvedValueOnce(null);

    const first = service.startChangePatient('123');
    const second = service.startChangePatient('123');

    const results = await Promise.allSettled([first, second]);

    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
  });

  it('updates machine when lock is valid', async () => {
    redisClient.get.mockResolvedValue('token123');

    patientsRepo.findOne.mockResolvedValue({ id: 'p1', name: 'John Doe' } as any);

    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    machineRepo.save.mockResolvedValue({
      id: '123',
      name: 'A',
      location: 'storage',
      status: MachineStatus.USED,
      assigned: 'p1',
    } as any);

    actionsRepo.create.mockReturnValue({
      id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED
    });
    actionsRepo.save.mockResolvedValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});

    const result = await service.changePatient('123', 'p1', 'token123');

    expect(result.assigned).toBe('John Doe');
  });

  it('converts patient ID to patient name after changePatient', async () => {
    redisClient.get.mockResolvedValue('token123');

    patientsRepo.findOne.mockResolvedValue({ id: 'p1', name: 'John Doe' } as any);

    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'Machine A',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
      assigned: '',
    } as any);

    machineRepo.save.mockResolvedValue({
      id: '123',
      name: 'Machine A',
      location: 'storage',
      status: MachineStatus.USED,
      assigned: 'p1',
    } as any);

    actionsRepo.create.mockReturnValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});
    actionsRepo.save.mockResolvedValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});

    const result = await service.changePatient('123', 'p1', 'token123');

    expect(result.assigned).toBe('John Doe');
  });

  it('throws if lock not found', async () => {
    redisClient.get.mockResolvedValue(null);

    await expect(
      service.changePatient('123', 'p1', 'token123'),
    ).rejects.toThrow('Lock not found or expired');
  });

  it('throws if lock token is invalid', async () => {
    redisClient.get.mockResolvedValue('wrong');

    await expect(
      service.changePatient('123', 'p1', 'token123'),
    ).rejects.toThrow('Invalid lockId');
  });

  it('throws if patient not found', async () => {
    redisClient.get.mockResolvedValue('token123');
    patientsRepo.findOne.mockResolvedValue(null);

    await expect(
      service.changePatient('123', 'p1', 'token123'),
    ).rejects.toThrow('Patient not found');
  });

  it('throws if machine not found', async () => {
    redisClient.get.mockResolvedValue('token123');
    patientsRepo.findOne.mockResolvedValue({ id: 'p1', name: 'John' } as any);
    machineRepo.findOne.mockResolvedValue(null);

    await expect(
      service.changePatient('123', 'p1', 'token123'),
    ).rejects.toThrow('Machine not found');

    expect(redisClient.del).toHaveBeenCalledWith('locks:machine:123');
  });

  it('writes two MachineActions when replacing an existing patient', async () => {
    redisClient.get.mockResolvedValue('token123');

    patientsRepo.findOne.mockResolvedValue({ id: 'new', name: 'New Patient' } as any);

    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'Machine A',
      assigned: 'old',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
    } as any);

    machineRepo.save.mockResolvedValue({
      id: '123',
      name: 'Machine A',
      assigned: 'new',
      location: 'storage',
      status: MachineStatus.USED,
    } as any);

    actionsRepo.create.mockReturnValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});
    actionsRepo.save.mockResolvedValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});

    await service.changePatient('123', 'new', 'token123');

    expect(actionsRepo.save).toHaveBeenCalledTimes(2);
  });

  it('writes only one MachineAction when there is no previous patient', async () => {
    redisClient.get.mockResolvedValue('token123');

    patientsRepo.findOne.mockResolvedValue({ id: 'new', name: 'New Patient' } as any);

    machineRepo.findOne.mockResolvedValue({
      id: '123',
      name: 'Machine A',
      assigned: '',
      location: 'storage',
      status: MachineStatus.AVALIBLE,
    } as any);

    machineRepo.save.mockResolvedValue({
      id: '123',
      name: 'Machine A',
      assigned: 'new',
      location: 'storage',
      status: MachineStatus.USED,
    } as any);

    actionsRepo.create.mockReturnValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});
    actionsRepo.save.mockResolvedValue({id: '1234',
      machine_id: '12345',
      patient_id: '123',
      description: 'vdfjkdnfkbngb',
      trigerd_at: new Date(),
      action_type: MachineActionType.CONNECTED});

    await service.changePatient('123', 'new', 'token123');

    expect(actionsRepo.save).toHaveBeenCalledTimes(1);
  });
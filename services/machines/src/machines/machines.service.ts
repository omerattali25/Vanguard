import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine, MachineStatus } from './entity/machine.entity';
import { Repository } from 'typeorm';
import { MachineInputDto } from './dto/machine.input.dto';
import { MachineUpdateDto } from './dto/machine.update.dto';
import { randomUUID } from 'crypto';
import { MachineAction, MachineActionType } from './entity/machine.action.entity';
import { MachineActionDto } from './dto/machine.action.dto';
import { Patient } from '@vanguard/types';
import { log } from 'console';
import { MachineOutputDto } from './dto/machine.output.dto';
import { threadId } from 'worker_threads';
import { machine } from 'os';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
    @InjectRepository(MachineAction)
    private readonly machineActionRepo: Repository<MachineAction>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {}

  private logger = new Logger(MachinesService.name);

  async getMachines(): Promise<MachineOutputDto[]> {
    try{
    const machines=await this.machineRepo.find();
    this.logger.log(`got all the machines from db`)
    let outputMachines:MachineOutputDto[]=[]
    for(const machine of machines){
      outputMachines.push(await this.convertPatientIdToName(machine));
    }
    this.logger.log(`converted all the patient ids to names`)
   return outputMachines;
    }
    catch(err)
    {
      throw err;
    }
  }
  async saveMachine(machineInput: MachineInputDto): Promise<Machine> {
    try{
    const newMachine = this.machineRepo.create(machineInput);
    const savedMachine = await this.machineRepo.save(newMachine);
    this.logger.log(`saved the machine ${savedMachine} to the db`)
    const outputMachine=await this.convertPatientIdToName(savedMachine)
    this.logger.log(`converted patient id to name`)
    this.redisClient.publish('machines', JSON.stringify(outputMachine));
    this.logger.log(`published ${savedMachine}`)
    return savedMachine;
    }
    catch(err){
      throw err
    }
  }
  async updateMachine(id: string, machineUpdateDto: MachineUpdateDto) {
    try{
    const machine = await this.machineRepo.findOne({
      where: { id:id },
    });
    if (!machine){ 
      this.logger.error(`machine ${machine} wasent found`)
      return 'machine with this id not found';
    }
    machine.name = machineUpdateDto.name || machine.name;
    machine.location = machineUpdateDto.location || machine.location;
    await this.machineRepo.save(machine);
    this.logger.log(`upadeted machine ${machine}`)
    this.redisClient.publish('machines', JSON.stringify(machine));
    this.logger.log(`published ${machine}`)
  }
  catch(err)
  {
    throw err
  }
  }

  async startChangePatient(machineId: string) {
    try{
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });
    if (!machine) {
      this.logger.error(`machine ${machine} wasent found`)
      throw new NotFoundException('Machine not found');
    }
    const ttl = parseInt(process.env.LOCK_TTL || '180000');
    const resource = `locks:machine:${machineId}`;
    const lockId = randomUUID();
    const lockAcquired = await this.redisClient.set(
      resource,
      lockId,
      'NX',
      'PX',
      ttl,
    );
    if (!lockAcquired) {
      this.logger.error(`Resource is already locked: ${resource}`)
      throw new InternalServerErrorException(
        `Resource is already locked: ${resource}`,
      );
    }
    this.logger.log(`lock machine ${machineId}`)
    machine.status = MachineStatus.IN_TRANSFER;
    await this.machineRepo.save(machine);
    this.logger.log(`changed machine status to in trasport in machine ${machineId}`)
    const outputMachine=await this.convertPatientIdToName(machine)
    this.logger.log(`converted patient id to name`)
    this.redisClient.publish('machines', JSON.stringify(outputMachine));
    this.logger.log(`published machine ${outputMachine}`)
    return {
      lockId: lockId,
      expiration: ttl,
    };
  }
  catch(err){
    throw err
  }
  }

  async changePatient(machineId: string, patient: string, lockId: string) {
    const lock = await this.redisClient.get(`locks:machine:${machineId}`);
    if (!lock) {
      this.logger.error(`{the lock ${lock} wasent found`)
      throw new InternalServerErrorException('Lock not found or expired');
    }
    if (lock !== lockId) {
      this.logger.error(`the recived lockId:${lockId} was not correct`)
      throw new InternalServerErrorException('Invalid lockId');
    }
    try {
      const patientRecord = await this.patientRepo.findOne({
        where: { id: patient },
      });
      if (!patientRecord) {
        this.logger.error(`the recived patient:${patient} wasnt found`)
        throw new NotFoundException('Patient not found');
      }
      const machine = await this.machineRepo.findOne({
        where: { id: machineId },
      });
      if (!machine) {
        this.logger.error(`the recived machine:${machineId} wasent found`)
        this.redisClient.del(`locks:machine:${machineId}`);
        throw new NotFoundException('Machine not found');
      }
      const ogPatient = machine.assigned;
      machine.assigned = patient;
      machine.status = MachineStatus.USED;
      await this.machineRepo.save(machine);
      this.logger.log(`updated machine ${machine}`)
      const outputMachine=await this.convertPatientIdToName(machine)
      this.logger.log(`converted patient id to name: ${outputMachine.assigned}`)
      this.redisClient.publish('machines', JSON.stringify(outputMachine));
      this.logger.log(`published machine ${outputMachine}`)
      let machineActionDTO = new MachineActionDto(
        machineId,
        patient,
        `connected patient ${patient} to machine ${machine.name}`,
        MachineActionType.CONNECTED
      );
      let machineAction = this.machineActionRepo.create(machineActionDTO);
      this.logger.log(`saved machineAction:${machineAction} to db`)
      await this.machineActionRepo.save(machineAction);
      if (ogPatient !== '') {
        machineActionDTO = new MachineActionDto(
          machineId,
          ogPatient,
          `disconnected patient ${ogPatient} from machine ${machine.name}`,
          MachineActionType.DISSCONNECET
        );
        machineAction = this.machineActionRepo.create(machineActionDTO);
        await this.machineActionRepo.save(machineAction);
        this.logger.log(`saved machineAction:${machineAction} to db`)
      }
      await this.redisClient.del(`locks:machine:${machineId}`);
      this.logger.log(`released locks:machine:${machineId}`)
      return outputMachine;
    } catch (err) {
      await this.redisClient.del(`locks:machine:${machineId}`);
      this.logger.log(`released locks:machine:${machineId}`)
      throw err;
    }
  }
  async convertPatientIdToName(machine:Machine):Promise<MachineOutputDto>{
    if(machine.assigned!=''){
    const patient=await this.patientRepo.findOne({where:{id:machine.assigned}})
    if(patient){
      return new MachineOutputDto(machine.name,machine.id,machine.location,machine.status,patient.name)
    }
    this.logger.log(`patient:${machine.assigned} wasnt found`)
    throw new NotFoundException(`patient:${machine.assigned} wasnt found`)
  
  }
  return machine;
}
}

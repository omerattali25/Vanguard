import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { Repository } from 'typeorm';
import { Machine, MachineStatus } from '../src/machines/entity/machine.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Machines E2E (real Redis + real Postgres)', () => {
  let app: INestApplication;
  let repo: Repository<Machine>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repo = moduleFixture.get(getRepositoryToken(Machine));

    await app.init();
  });

  it('/machines (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/machines').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /machines/change-patient — should update patient when lock is acquired', async () => {
    const machine = await repo.save({
      name: 'Dialysis 1',
      location: 'Room A',
      status: MachineStatus.AVALIBLE,
    });

    await request(app.getHttpServer())
      .put('/machines/change-patient')
      .send({
        id: machine.id,
        patient: 'John Doe',
      })
      .expect(200);

    const updated = await repo.findOne({ where: { id: machine.id } });
    expect(updated).not.toBeNull();
    expect(updated!.assigned).toBe('John Doe');
  });

  it('PUT /machines/change-patient — should return 404 if machine does not exist', async () => {
    await request(app.getHttpServer())
      .put('/machines/change-patient')
      .send({
        id: '00000000-0000-0000-0000-000000000000',
        patient: 'John Doe',
      })
      .expect(404);
  });

  it('PUT /machines/change-patient — should fail when lock is already acquired', async () => {
    const machine = await repo.save({
      name: 'Dialysis 2',
      location: 'Room B',
      status: MachineStatus.AVALIBLE,
    });

    const first = request(app.getHttpServer())
      .put('/machines/change-patient')
      .send({
        id: machine.id,
        patient: 'Alice',
      });

    const second = request(app.getHttpServer())
      .put('/machines/change-patient')
      .send({
        id: machine.id,
        patient: 'Bob',
      });

    const [res1, res2] = await Promise.allSettled([first, second]);

    expect(res1.status === 'fulfilled' || res2.status === 'fulfilled').toBe(
      true,
    );

    const rejected = res1.status === 'rejected' ? res1 : res2;

    expect((rejected as PromiseRejectedResult).reason.status).toBe(400);
  });

  it('/machines (POST) — should create a machine', async () => {
    const res = await request(app.getHttpServer())
      .post('/machines')
      .send({
        name: 'New Dialysis Machine',
        location: 'Room C',
        status: MachineStatus.AVALIBLE,
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('New Dialysis Machine');
    expect(res.body.location).toBe('Room C');
    expect(res.body.status).toBe(MachineStatus.AVALIBLE);

    const saved = await repo.findOne({ where: { id: res.body.id } });
    expect(saved).toBeDefined();
    expect(saved!.name).toBe('New Dialysis Machine');
  });

  afterAll(async () => {
    await app.close();
  });
});

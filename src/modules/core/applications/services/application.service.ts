import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';
import { Application, Job, Worker } from '../../../../entities';
import { UserRole } from '../../users/dto/user.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Worker)
    private workersRepository: Repository<Worker>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({ relations: ['worker', 'job'] });
  }

  findOne(id: number): Promise<Application> {
    return this.applicationsRepository.findOne(id, { relations: ['worker', 'job'] });
  }

  findFromCurrentUser(username: string, role: UserRole): Promise<Application[]> {
    if (role === UserRole.WORKER) {
      return this.applicationsRepository.find({
        where: {
          worker: {
            user: {
              username: username,
            },
          },
        },
        relations: ['worker', 'job'],
      });
    } else if (role === UserRole.COMPANY) {
      return this.applicationsRepository.find({
        where: {
          job: {
            company: {
              user: {
                username: username,
              },
            },
          },
        },
        relations: ['worker', 'job'],
      });
    }
    throw new UnauthorizedException('not logging in');
  }

  async createApplication(data: CreateApplicationDto): Promise<Application> {
    const { workerId, jobId, ...rest } = data;
    const foundWorker: Worker = await this.workersRepository.findOne(workerId);
    const foundJob: Job = await this.jobsRepository.findOne(jobId);
    if (foundWorker && foundJob) {
      const applicationSchema = this.applicationsRepository.create({
        ...rest,
      });
      applicationSchema.worker = foundWorker;
      applicationSchema.job = foundJob;
      return this.applicationsRepository.save(applicationSchema);
    }

    throw new BadRequestException();
  }

  async updateApplication(data: UpdateApplicationDto): Promise<Application> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { workerId, jobId, id, ...rest } = data;
    const promise = Promise.all([
      this.applicationsRepository
        .createQueryBuilder('application')
        .update(Application)
        .set({
          ...rest,
        })
        .where('application.id = :id', { id: id })
        .execute(),
    ]);
    return promise.then(async (result) => {
      return await this.findOne(id);
    });
  }

  async remove(id: number): Promise<boolean> {
    const foundApplication = await this.findOne(id);
    if (foundApplication) {
      const promise = Promise.all([this.applicationsRepository.softDelete(id)]).then((result) =>
        result.every((record) => record.raw.affectedRows === 1),
      );
      return promise;
    }
    throw new NotFoundException();
  }
}

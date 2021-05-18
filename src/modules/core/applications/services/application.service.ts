import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';
import { Application, Job, User, Worker } from '../../../../entities';
import { UserRole } from '../../users/dto/user.dto';
import { FilesService } from '../../../shared/uploadfiles/services/files.service';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Worker)
    private workersRepository: Repository<Worker>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @Inject('FilesService')
    private filesService: FilesService,
    @Inject('UserService')
    private userService: UserService,
  ) {}

  findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({ relations: ['worker', 'job'] });
  }

  findOne(id: number): Promise<Application> {
    return this.applicationsRepository.findOne(id, { relations: ['worker', 'job'] });
  }

  async findFromCurrentUser(username: string, role: UserRole): Promise<Application[] | Job[]> {
    const foundUser: User = await this.userService.findByUsername(username);
    if (role === UserRole.WORKER) {
      return this.applicationsRepository.find({
        where: {
          worker: foundUser.worker,
        },
        relations: ['job', 'job.company', 'job.company.user'],
      });
    } else if (role === UserRole.COMPANY) {
      return this.jobsRepository.find({
        where: {
          company: foundUser.company,
        },
        relations: ['applications', 'applications.worker', 'applications.worker.user', 'company'],
      });
    }
    throw new UnauthorizedException('not logging in');
  }

  async createApplication(
    data: CreateApplicationDto,
    resumeFile: Express.Multer.File,
  ): Promise<Application> {
    const { workerId, jobId, ...rest } = data;
    const foundWorker: Worker = await this.workersRepository.findOne(workerId);
    const foundJob: Job = await this.jobsRepository.findOne(jobId);
    if (foundWorker && foundJob) {
      const newCreateApplicationDto = rest;
      if (resumeFile) {
        const resume = await this.filesService.uploadFile({
          file: resumeFile,
          storagePath: `resumes`,
        });
        newCreateApplicationDto.resume = resume;
      }

      const applicationSchema: Application = this.applicationsRepository.create({
        ...newCreateApplicationDto,
      });
      applicationSchema.worker = foundWorker;
      applicationSchema.job = foundJob;
      return this.applicationsRepository.save(applicationSchema);
    }

    throw new BadRequestException();
  }

  async updateApplication(
    data: UpdateApplicationDto,
    resumeFile: Express.Multer.File,
  ): Promise<Application> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { workerId, jobId, id, ...rest } = data;
    const newUpdateApplicationDto = rest;
    if (resumeFile) {
      const resume = await this.filesService.uploadFile({
        file: resumeFile,
        storagePath: `resumes`,
      });
      newUpdateApplicationDto.resume = resume;
    }

    const promise = Promise.all([
      this.applicationsRepository
        .createQueryBuilder('application')
        .update(Application)
        .set({
          ...newUpdateApplicationDto,
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

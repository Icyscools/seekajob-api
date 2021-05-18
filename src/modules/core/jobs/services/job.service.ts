import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from '../dto/job.dto';
import { Company, Job, User } from '../../../../entities';
import { UserRole } from '../../users/dto/user.dto';
import { UserService } from '../../users/services/user.service';
@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @Inject('UserService')
    private userService: UserService,
  ) {}

  findAll(): Promise<Job[]> {
    return this.jobsRepository.find({ relations: ['company'] });
  }

  findOne(id: number): Promise<Job> {
    return this.jobsRepository.findOne(id, { relations: ['company'] });
  }

  async findFromCurrentUser(username: string, role: UserRole): Promise<Job[]> {
    const foundCompany: User = await this.userService.findByUsername(username);
    if (role === UserRole.COMPANY) {
      return this.jobsRepository.find({
        where: {
          company: foundCompany.company,
        },
        relations: ['company', 'applications'],
      });
    }
    throw new UnauthorizedException('not logging in');
  }

  async createJob(data: CreateJobDto): Promise<Job> {
    const { companyId, ...rest } = data;
    const foundCompany: Company = await this.companiesRepository.findOne(companyId);
    if (foundCompany) {
      const jobSchema = this.jobsRepository.create({
        ...rest,
      });

      jobSchema.company = foundCompany;
      return this.jobsRepository.save(jobSchema);
    }
    throw new BadRequestException();
  }

  async updateJob(data: UpdateJobDto): Promise<Job> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { companyId, id, ...rest } = data;
    const promise = Promise.all([
      this.jobsRepository
        .createQueryBuilder('job')
        .update(Job)
        .set({
          ...rest,
        })
        .where('job.id = :id', { id: id })
        .execute(),
    ]);
    return promise.then(async (result) => {
      return await this.findOne(id);
    });
  }

  async remove(id: number): Promise<boolean> {
    const foundJob = await this.findOne(id);
    if (foundJob) {
      const promise = Promise.all([this.jobsRepository.softDelete(id)]).then((result) =>
        result.every((record) => record.raw.affectedRows === 1),
      );
      return promise;
    }
    throw new NotFoundException();
  }
}

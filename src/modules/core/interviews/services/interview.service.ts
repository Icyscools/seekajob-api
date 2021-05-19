import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, Interview } from '../../../../entities';
import { UserRole } from '../../users/dto/user.dto';
import { UserService } from '../../users/services/user.service';
import { CreateInterviewDto, UpdateInterviewDto } from '../dto/interview.dto';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewsRepository: Repository<Interview>,
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @Inject('UserService')
    private userService: UserService,
  ) {}

  findAll(): Promise<Interview[]> {
    return this.interviewsRepository.find({ relations: ['application'] });
  }

  findOne(id: number): Promise<Interview> {
    return this.interviewsRepository.findOne(id, { relations: ['application'] });
  }

  findFromCurrentUser(username: string, role: UserRole): Promise<Interview[]> {
    if (role === UserRole.WORKER) {
      return this.interviewsRepository.find({
        where: {
          application: {
            worker: {
              user: {
                username: username,
              },
            },
          },
        },
        relations: ['application'],
      });
    } else if (role === UserRole.COMPANY) {
      return this.interviewsRepository.find({
        where: {
          application: {
            job: {
              company: {
                user: {
                  username: username,
                },
              },
            },
          },
        },
        relations: ['application'],
      });
    }
    throw new UnauthorizedException('not logging in');
  }

  async createInterview(data: CreateInterviewDto): Promise<Interview> {
    const { applicationId, ...rest } = data;
    const foundApplication: Application = await this.applicationsRepository.findOne(applicationId);
    if (foundApplication) {
      const interviewSchema = this.interviewsRepository.create({
        ...rest,
      });
      interviewSchema.application = foundApplication;
      return this.interviewsRepository.save(interviewSchema);
    }
    throw new BadRequestException();
  }

  async updateInterview(data: UpdateInterviewDto): Promise<Interview> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { applicationId, id, ...rest } = data;
    const promise = Promise.all([
      this.interviewsRepository
        .createQueryBuilder('interview')
        .update(Interview)
        .set({
          ...rest,
        })
        .where('interview.id = :id', { id: id })
        .execute(),
    ]);
    return promise.then(async (result) => {
      return await this.findOne(id);
    });
  }

  async remove(id: number): Promise<boolean> {
    const foundInterview = await this.findOne(id);
    if (foundInterview) {
      const promise = Promise.all([this.interviewsRepository.softDelete(id)]).then((result) =>
        result.every((record) => record.raw.affectedRows === 1),
      );
      return promise;
    }
    throw new NotFoundException();
  }
}

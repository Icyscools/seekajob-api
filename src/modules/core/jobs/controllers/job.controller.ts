import { JobService } from '../services/job.service';
import { CreateJobDto, UpdateJobDto } from '../dto/job.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { Job } from '../../../../entities';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  getJobs(): Promise<Job[]> {
    return this.jobService.findAll();
  }

  @Get('/:id')
  getJobById(@Param('id', ParseIntPipe) id: number): Promise<Job> {
    return this.jobService.findOne(id);
  }

  @Post()
  @Header('Cache-Control', 'none')
  createJob(@Body() dto: CreateJobDto): Promise<Job> {
    const promise = new Promise<Job>((resolve, reject) => {
      try {
        const job = this.jobService
          .createJob(dto)
          .then((job) => job)
          .catch((err) => {
            throw err;
          });
        resolve(job);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((job) => job);
  }

  @Patch()
  @Header('Cache-Control', 'none')
  updateJob(@Body() dto: UpdateJobDto): Promise<Job> {
    const promise = new Promise<Job>((resolve, reject) => {
      try {
        const job = this.jobService
          .updateJob(dto)
          .then((job) => job)
          .catch((err) => {
            throw err;
          });
        resolve(job);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((job) => job);
  }

  @Delete('/:id')
  removeJobById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.jobService.remove(id);
  }
}

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
  UseGuards,
  Req,
} from '@nestjs/common';
import { Job } from '../../../../entities';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/shared/roles/guards/role.guard';
import { Roles } from 'src/modules/shared/roles/decorators/role.decorator';
import { UserRole } from '../../users/dto/user.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  getJobs(): Promise<Job[]> {
    return this.jobService.findAll();
  }

  @Get('/me')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.COMPANY)
  getJobByCompany(@Req() req): Promise<Job[]> {
    const { username, role } = req.user;
    return this.jobService.findFromCurrentUser(username, role);
  }

  @Get('/:id')
  getJobById(@Param('id', ParseIntPipe) id: number): Promise<Job> {
    return this.jobService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.COMPANY)
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
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.COMPANY)
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
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.COMPANY)
  removeJobById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.jobService.remove(id);
  }
}

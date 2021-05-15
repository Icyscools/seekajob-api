import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './controllers/job.controller';
import { Job } from './entities/job.entity';
import { JobService } from './services/job.service';
import { Company } from '../users/entities/company.entity';

const entities = [Job, Company];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}

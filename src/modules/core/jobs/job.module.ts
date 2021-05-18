import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job, Company } from '../../../entities';
import { JobController } from './controllers/job.controller';
import { JobService } from './services/job.service';
import { UserModule } from '../users/user.module';

const entities = [Job, Company];

@Module({
  imports: [TypeOrmModule.forFeature(entities), UserModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}

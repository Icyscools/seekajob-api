import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application, Job, Worker } from '../../../entities';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationService } from './services/application.service';
import { FilesModule } from '../../shared/uploadfiles/files.module';

const entities = [Application, Worker, Job];

@Module({
  imports: [TypeOrmModule.forFeature(entities), FilesModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}

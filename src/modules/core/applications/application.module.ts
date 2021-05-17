import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application, Job, Worker } from '../../../entities';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationService } from './services/application.service';
// import { RolesModule } from '../../shared/roles/role.module';
// import { AuthModule } from '../auths/auth.module';

const entities = [Application, Worker, Job];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}

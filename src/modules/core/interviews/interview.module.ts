import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview, Application } from '../../../entities';
import { InterviewController } from './controllers/interview.controller';
import { InterviewService } from './services/interview.service';
import { UserModule } from '../users/user.module';

const entities = [Interview, Application];

@Module({
  imports: [TypeOrmModule.forFeature(entities), UserModule],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}

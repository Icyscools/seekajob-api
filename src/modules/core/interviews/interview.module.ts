import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview, Application } from '../../../entities';
import { InterviewController } from './controllers/interview.controller';
import { InterviewService } from './services/interview.service';

const entities = [Interview, Application];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}

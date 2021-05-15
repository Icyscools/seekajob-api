import { Module } from '@nestjs/common';
import { JobModule } from './jobs/job.module';
import { UserModule } from './users/user.module';
import { ApplicationModule } from './applications/application.module';
import { InterviewModule } from './interviews/interview.module';

const modules = [UserModule, JobModule, ApplicationModule, InterviewModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

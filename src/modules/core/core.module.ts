import { Module } from '@nestjs/common';
import { AuthModule } from './auths/auth.module';
import { UserModule } from './users/user.module';
import { JobModule } from './jobs/job.module';
import { ApplicationModule } from './applications/application.module';
import { InterviewModule } from './interviews/interview.module';

const modules = [AuthModule, UserModule, JobModule, ApplicationModule, InterviewModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

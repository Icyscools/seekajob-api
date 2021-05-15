import { Module } from '@nestjs/common';
import { JobModule } from './jobs/job.module';
import { UserModule } from './users/user.module';
import { ApplicationModule } from './applications/application.module';

const modules = [UserModule, JobModule, ApplicationModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

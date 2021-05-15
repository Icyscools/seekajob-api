import { Module } from '@nestjs/common';
import { JobModule } from './jobs/job.module';
import { UserModule } from './users/user.module';

const modules = [UserModule, JobModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

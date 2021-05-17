import { Module } from '@nestjs/common';
import { AuthModule } from '../../core/auths/auth.module';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports: [AuthModule],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RolesModule {}

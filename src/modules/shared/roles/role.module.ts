import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/role.guard';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RolesModule {}

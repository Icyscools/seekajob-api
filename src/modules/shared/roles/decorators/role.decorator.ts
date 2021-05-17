import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../core/users/dto/user.dto';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

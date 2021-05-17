import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/core/users/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user.role;

    if (userRole && this.matchRoles(roles, userRole)) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  matchRoles(roles: UserRole[], currentRole: UserRole): boolean {
    return roles?.includes(currentRole) ?? true;
  }
}

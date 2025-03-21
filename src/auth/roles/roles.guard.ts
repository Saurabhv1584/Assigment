import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/entities/user.entity';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, no access
    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // user {
    //   id: '268947a8-029d-484e-88e3-74bf04d8561c',
    //   email: 'te35as43a5s@gmail.com',
    //   role: [ 'viewer' ],
    //   iat: 1742466366,
    //   exp: 1742469966
    // }

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const hasRole = user.roles.some((role: UserRole) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

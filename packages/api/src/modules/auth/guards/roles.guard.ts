import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { UserRole } from '../types/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    console.log('Required roles:', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Guard user:', user, 'Full request:', request.headers);

    if (!user || !user.role) {
      console.log('No user or role found');
      return false;
    }

    const hasRole = requiredRoles.some((role) => role === user.role);
    console.log(
      'Has role:',
      hasRole,
      'User role:',
      user.role,
      'Required roles:',
      requiredRoles,
    );

    return hasRole;
  }
}

// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorators';
import { UserRole } from '../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read the roles attached by @Roles() decorator on the route or controller
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() decorator is present, allow through
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // req.user is set by JwtAuthGuard (JwtStrategy.validate) before this runs
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.includes(user?.role);
  }
}
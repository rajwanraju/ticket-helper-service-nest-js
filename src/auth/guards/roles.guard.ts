import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  
  import { Reflector } from '@nestjs/core';
  
  import { ROLES_KEY } from '../decorators/roles.decorator.js';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
    ) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean {
      // Read roles required by the endpoint
      const requiredRoles =
        this.reflector.getAllAndOverride<string[]>(
          ROLES_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );
  
      // Endpoint does not require a specific role
      if (!requiredRoles?.length) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
  
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException(
          'User information not available',
        );
      }
  
      const hasRole = requiredRoles.includes(
        user.role,
      );
  
      if (!hasRole) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
  
      return true;
    }
  }
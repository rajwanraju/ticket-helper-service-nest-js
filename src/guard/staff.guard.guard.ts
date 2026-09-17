import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StaffGuardGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): any {
    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-staff-token'];
    console.log('StaffGuardGuard: Checking x-staff-token header:', header);

    if ( header != 'staff-secret-token') {
      throw new ForbiddenException('You are not authorized to access this resource.');
    }
    return true;
  }
}

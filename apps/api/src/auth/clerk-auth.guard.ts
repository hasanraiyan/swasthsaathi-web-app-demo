import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { getAuth } from '@clerk/express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth = getAuth(request);

    if (!auth || !auth.userId) {
      throw new UnauthorizedException('Unauthorized: No valid session or token found');
    }

    request['user'] = {
      clerkId: auth.userId,
      sessionId: auth.sessionId,
      claims: auth.sessionClaims,
    };

    return true;
  }
}

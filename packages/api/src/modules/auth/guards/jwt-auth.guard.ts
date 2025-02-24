import { type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '@prisma/client';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const result = super.canActivate(context);

    if (result instanceof Promise) {
      return result.then((value) => {
        const request = context.switchToHttp().getRequest();

        return value;
      });
    }

    if (result instanceof Observable) {
      return result.pipe(
        tap(() => {
          const request = context.switchToHttp().getRequest();

        }),
      );
    }

    const request = context.switchToHttp().getRequest();

    return result;
  }

  handleRequest<TUser = User>(err: Error | null, user: TUser | false): TUser {

    if (err || !user) {
      throw err;
    }
    return user;
  }
}

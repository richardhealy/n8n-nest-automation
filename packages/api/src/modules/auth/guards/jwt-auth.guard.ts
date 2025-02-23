import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		console.log('JwtAuthGuard executing');
		const result = super.canActivate(context);

		if (result instanceof Promise) {
			return result.then((value) => {
				const request = context.switchToHttp().getRequest();
				console.log('JwtAuthGuard request.user:', request.user);
				return value;
			});
		}

		if (result instanceof Observable) {
			return result.pipe(
				tap(() => {
					const request = context.switchToHttp().getRequest();
					console.log('JwtAuthGuard request.user:', request.user);
				}),
			);
		}

		const request = context.switchToHttp().getRequest();
		console.log('JwtAuthGuard request.user:', request.user);
		return result;
	}

	handleRequest(err: any, user: any) {
		console.log('JwtAuthGuard handleRequest user:', user);
		if (err || !user) {
			throw err;
		}
		return user;
	}
}

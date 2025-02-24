import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // Handle both shapes of user object
    return {
      ...user,
      userId: user.userId || user.id,  // Support both properties
    };
  },
);

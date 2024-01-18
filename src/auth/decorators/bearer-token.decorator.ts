import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
/**
 * extract token from header
 */
export const BearerToken = createParamDecorator(
  (_params: any, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const token: string = ctx.getContext().req.token;
    return token;
  },
);

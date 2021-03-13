import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * Decorator that is used to get from the request the user data
 */
export const User = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
  }
)

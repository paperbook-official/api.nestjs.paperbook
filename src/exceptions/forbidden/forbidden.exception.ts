import { HttpException, HttpStatus } from '@nestjs/common'

/**
 * Instantiate a ForbiddenException Exception.
 *
 * @example
 * ```typescript
 * throw new ForbiddenException()
 * ```
 */
export class ForbiddenException extends HttpException {
  constructor() {
    super(
      'You have no permission to access those sources',
      HttpStatus.FORBIDDEN
    )
  }
}

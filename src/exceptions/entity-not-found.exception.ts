import { HttpException, HttpStatus, Type } from '@nestjs/common'

/**
 * *
 * Instantiate a EntityNotFoundException Exception.
 *
 * @example
 * `throw new NotFoundException()`
 *
 * @param identifier stores the entity id or unique identifier value
 * @param type stores the entity type
 */
export class EntityNotFoundException extends HttpException {
  public constructor(identifier: number | string, type?: Type) {
    super(
      `The entity identified by "${identifier}"${
        type ? ` of type "${type.name}"` : ''
      } does not exists or is disabled`,
      HttpStatus.NOT_FOUND
    )
  }
}

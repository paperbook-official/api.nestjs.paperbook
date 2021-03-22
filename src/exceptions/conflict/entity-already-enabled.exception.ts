import { HttpException, HttpStatus, Type } from '@nestjs/common'

import { BaseEntity } from 'src/common/base.entity'

/**
 * *
 * Instantiate a EntityAlreadyEnabledException Exception.
 *
 * @example
 * `throw new EntityAlreadyEnabledException()`
 *
 * @param identifier stores the entity id or unique identifier value
 * @param type stores the entity type
 */
export class EntityAlreadyEnabledException extends HttpException {
  public constructor(identifier: number | string, type?: Type<BaseEntity>) {
    super(
      `The entity identified by "${identifier}"${
        type ? ` of type "${type.name}"` : ''
      } is already enabled`,
      HttpStatus.CONFLICT
    )
  }
}

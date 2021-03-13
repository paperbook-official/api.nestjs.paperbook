import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

/**
 * The app's main user proxy class
 *
 * Class that deals with the user return data
 */
export class UserProxy {
  @ApiProperty()
  public name: string

  @ApiProperty()
  public email: string

  public constructor(userEntity: UserEntity) {
    this.name = userEntity.name
    this.email = userEntity.email
  }
}

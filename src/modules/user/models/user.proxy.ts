import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

import { BaseProxy } from 'src/common/base.proxy'
import { AddressProxy } from 'src/modules/address/models/address.proxy'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main user proxy class
 *
 * Class that deals with the user return data
 */
export class UserProxy extends BaseProxy {
  @ApiProperty()
  public name: string

  @ApiProperty()
  public lastName: string

  @ApiProperty()
  public email: string

  @ApiPropertyOptional()
  public cpf?: string

  @ApiProperty()
  public permissions: RolesEnum

  @ApiPropertyOptional()
  public phone?: string

  @ApiPropertyOptional({ type: () => AddressProxy, isArray: true })
  public addresses?: AddressProxy[]

  public constructor(entity: UserEntity) {
    super(entity)

    this.name = entity.name
    this.lastName = entity.lastName
    this.email = entity.email
    this.cpf = entity.cpf
    this.permissions = entity.roles
    this.phone = entity.phone

    this.addresses = entity.addresses?.map(address => address.toProxy())
  }
}

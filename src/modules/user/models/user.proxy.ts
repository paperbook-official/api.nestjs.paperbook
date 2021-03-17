import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main user proxy class
 *
 * Class that deals with the user return data
 */
export class UserProxy {
  @ApiProperty()
  public id: number

  @ApiProperty()
  public createdAt: Date

  @ApiProperty()
  public updatedAt: Date

  @ApiProperty()
  public isActive: boolean

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

  public constructor(userEntity: UserEntity) {
    this.id = +userEntity.id
    this.createdAt = userEntity.createdAt
    this.updatedAt = userEntity.updatedAt
    this.isActive = userEntity.isActive
    this.name = userEntity.name
    this.lastName = userEntity.lastName
    this.email = userEntity.email
    this.cpf = userEntity.cpf
    this.permissions = userEntity.roles
    this.phone = userEntity.phone
  }
}

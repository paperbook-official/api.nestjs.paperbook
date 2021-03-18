import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AddressEntity } from '../entities/address.entity'

import { UserProxy } from 'src/modules/user/models/user.proxy'

/**
 * The app's main address proxy class
 *
 * Class that deals with the address return data
 */
export class AddressProxy {
  @ApiProperty()
  public id: number

  @ApiProperty()
  public createdAt: Date

  @ApiProperty()
  public updatedAt: Date

  @ApiProperty()
  public isActive: boolean

  @ApiProperty()
  public cep: string

  @ApiProperty()
  public street: string

  @ApiProperty()
  public houseNumber: number

  @ApiProperty()
  public complement: string

  @ApiProperty()
  public district: string

  @ApiProperty()
  public city: string

  @ApiProperty()
  public state: string

  @ApiProperty()
  public userId: number

  @ApiPropertyOptional({ type: () => UserProxy })
  public user?: UserProxy

  public constructor(addressEntity: AddressEntity) {
    this.id = +addressEntity.id
    this.createdAt = addressEntity.createdAt
    this.updatedAt = addressEntity.updatedAt
    this.isActive = addressEntity.isActive
    this.cep = addressEntity.cep
    this.street = addressEntity.street
    this.houseNumber = addressEntity.houseNumber
    this.complement = addressEntity.complement
    this.district = addressEntity.district
    this.city = addressEntity.city
    this.state = addressEntity.state
    this.userId = addressEntity.userId

    this.user = addressEntity.user?.toProxy()
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AddressEntity } from '../entities/address.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

/**
 * The app's main address dto class
 *
 * Class that deals with the address return data
 */
export class AddressDto extends BaseResponseDto {
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

  @ApiPropertyOptional({ type: () => UserDto })
  public user?: UserDto

  public constructor(addressEntity: AddressEntity) {
    super(addressEntity)

    this.id = addressEntity.id
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

    // relations
    this.user = addressEntity.user?.toDto()
  }
}

/**
 * The app's main get many address dto response
 *
 * Class that deals with the address return data with pagination
 */
export class GetManyAddressDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: AddressDto, isArray: true })
  public data: AddressDto[]
}

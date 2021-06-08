import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'
import { AddressDto } from 'src/modules/address/models/address.dto'
import { OrderDto } from 'src/modules/order/models/order.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'
import { RatingDto } from 'src/modules/rating/models/rating.dto'
import { ShoppingCartDto } from 'src/modules/shopping-cart/models/shopping-cart.dto'

/**
 * The app's main user dto class
 *
 * Class that deals with the user return data
 */
export class UserDto extends BaseResponseDto {
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

  //#region Relations

  @ApiPropertyOptional({
    type: () => ShoppingCartDto,
  })
  public shoppingCart?: ShoppingCartDto

  @ApiPropertyOptional({
    type: () => AddressDto,
    isArray: true,
  })
  public addresses?: AddressDto[]

  @ApiPropertyOptional({
    type: () => ProductDto,
    isArray: true,
  })
  public products?: ProductDto[]

  @ApiPropertyOptional({
    type: () => OrderDto,
    isArray: true,
  })
  public orders?: OrderDto[]

  @ApiPropertyOptional({
    type: () => RatingDto,
    isArray: true,
  })
  public ratings?: RatingDto[]

  //#endregion

  public constructor(entity: UserEntity) {
    super(entity)

    this.name = entity.name
    this.lastName = entity.lastName
    this.email = entity.email
    this.cpf = entity.cpf
    this.permissions = entity.roles
    this.phone = entity.phone

    // relations
    this.shoppingCart = entity.shoppingCart?.toDto()
    this.addresses = entity.addresses?.map(address => address.toDto())
    this.products = entity.products?.map(product => product.toDto())
    this.orders = entity.orders?.map(order => order.toDto())
    this.ratings = entity.ratings?.map(rating => rating.toDto())
  }
}

/**
 * The app's main get many user dto response
 *
 * Class that deals with the user return data with pagination
 */
export class GetManyUserDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: UserDto, isArray: true })
  data: UserDto[]
}

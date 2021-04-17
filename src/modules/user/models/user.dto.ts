import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

import { BaseResponseDto } from 'src/common/base-response.dto'
import { AddressDto } from 'src/modules/address/models/address.dto'
import { OrderDto } from 'src/modules/order/models/order.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'
import { RatingDto } from 'src/modules/rating/models/rating.dto'
import { ShoppingCartDto } from 'src/modules/shopping-cart/models/shopping-cart.dto'

import { RolesEnum } from 'src/models/enums/roles.enum'

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

  @ApiPropertyOptional({
    type: () => AddressDto,
    isArray: true
  })
  public addresses?: AddressDto[]

  @ApiPropertyOptional({
    type: () => ProductDto,
    isArray: true
  })
  public products?: ProductDto[]

  @ApiPropertyOptional({
    type: () => OrderDto,
    isArray: true
  })
  public orders?: OrderDto[]

  @ApiPropertyOptional({
    type: () => ShoppingCartDto,
    isArray: true
  })
  public shoppingCarts?: ShoppingCartDto[]

  @ApiPropertyOptional({
    type: () => RatingDto,
    isArray: true
  })
  public ratings?: RatingDto[]

  public constructor(entity: UserEntity) {
    super(entity)

    this.name = entity.name
    this.lastName = entity.lastName
    this.email = entity.email
    this.cpf = entity.cpf
    this.permissions = entity.roles
    this.phone = entity.phone

    // relations
    this.addresses = entity.addresses?.map(address => address.toDto())
    this.products = entity.products?.map(product => product.toDto())
    this.orders = entity.orders?.map(order => order.toDto())
    this.shoppingCarts = entity.shoppingCarts?.map(shoppingCart =>
      shoppingCart.toDto()
    )
    this.ratings = entity.ratings?.map(rating => rating.toDto())
  }
}

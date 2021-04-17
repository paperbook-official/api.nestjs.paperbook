import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

/**
 * The app's main shopping cart dto class
 *
 * Class that deals with the shopping cart returndata
 */
export class ShoppingCartDto extends BaseResponseDto {
  @ApiProperty()
  public productId: number

  @ApiProperty()
  public userId: number

  @ApiPropertyOptional({
    type: () => ProductDto
  })
  public product?: ProductDto

  @ApiPropertyOptional({
    type: () => UserDto
  })
  public user?: UserDto

  public constructor(entity: ShoppingCartEntity) {
    super(entity)

    this.productId = entity.productId
    this.userId = entity.userId

    // relations
    this.product = entity.product?.toDto()
    this.user = entity.user?.toDto()
  }
}

/**
 * The app's main get many shopping cart dto response
 *
 * Class that deals with the shopping cart return data with pagination
 */
export class GetManyShoppingCartDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: ShoppingCartDto, isArray: true })
  data: ShoppingCartDto[]
}

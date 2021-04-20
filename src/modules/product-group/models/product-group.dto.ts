import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductGroupEntity } from '../entities/product-group.entity'

import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'
import { ShoppingCartDto } from 'src/modules/shopping-cart/models/shopping-cart.dto'

/**
 * The app's main product group dto class
 *
 * Class that deals with the product group return data
 */
export class ProductGroupDto extends BaseResponseDto {
  @ApiProperty()
  public amount: number

  @ApiProperty()
  public shoppingCartId: number

  @ApiProperty()
  public productId: number

  //#region Relations

  @ApiPropertyOptional({
    type: () => ProductDto,
    isArray: true
  })
  public product?: ProductDto

  @ApiPropertyOptional({
    type: () => ShoppingCartDto,
    isArray: true
  })
  public shoppingCart?: ShoppingCartDto

  //#endregion

  public constructor(entity: ProductGroupEntity) {
    super(entity)

    this.amount = entity.amount
    this.productId = entity.productId
    this.shoppingCartId = entity.shoppingCartId

    // relations
    this.product = entity.product?.toDto()
    this.shoppingCart = entity.shoppingCart?.toDto()
  }
}

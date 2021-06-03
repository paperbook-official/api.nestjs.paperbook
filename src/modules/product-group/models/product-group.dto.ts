import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductGroupEntity } from '../entities/product-group.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { OrderDto } from 'src/modules/order/models/order.dto'
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
  public productId: number

  @ApiPropertyOptional()
  public shoppingCartId?: number

  @ApiPropertyOptional()
  public orderId?: number

  //#region Relations

  @ApiPropertyOptional({
    type: () => ProductDto,
    isArray: true,
  })
  public product?: ProductDto

  @ApiPropertyOptional({ type: () => ShoppingCartDto })
  public shoppingCart?: ShoppingCartDto

  @ApiPropertyOptional({ type: () => OrderDto })
  public order?: OrderDto

  //#endregion

  public constructor(entity: ProductGroupEntity) {
    super(entity)

    this.amount = entity.amount
    this.productId = entity.productId
    this.orderId = entity?.orderId
    this.shoppingCartId = entity?.shoppingCartId
    this.orderId = entity?.orderId

    // relations
    this.product = entity.product?.toDto()
    this.shoppingCart = entity.shoppingCart?.toDto()
    this.order = entity.order?.toDto()
  }
}

/**
 * The app's main get many product dto response
 *
 * Class that deals with the products return data with pagination
 */
export class GetManyProductGroupDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: ProductGroupDto, isArray: true })
  data: ProductGroupDto[]
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'

import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'
import { BaseProxy } from 'src/common/base.proxy'
import { ProductProxy } from 'src/modules/product/models/product.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

/**
 * The app's main shopping cart proxy class
 *
 * Class that deals with the shopping cart returndata
 */
export class ShoppingCartProxy extends BaseProxy {
  @ApiProperty()
  public productId: number

  @ApiProperty()
  public userId: number

  @ApiPropertyOptional({
    type: () => ProductProxy
  })
  public product?: ProductProxy

  @ApiPropertyOptional({
    type: () => UserProxy
  })
  public user?: UserProxy

  public constructor(entity: ShoppingCartEntity) {
    super(entity)

    this.productId = entity.productId
    this.userId = entity.userId

    // relations
    this.product = entity.product?.toProxy()
    this.user = entity.user?.toProxy()
  }
}

/**
 * The app's main get many shopping cart proxy response
 *
 * Class that deals with the shopping cart return data with pagination
 */
export class GetManyShoppingCartProxyResponse extends BaseGetManyDefaultResponse {
  @ApiProperty({ type: ShoppingCartProxy, isArray: true })
  data: ShoppingCartProxy[]
}

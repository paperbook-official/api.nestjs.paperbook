import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { OrderEntity } from '../entities/order.entity'

import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'
import { BaseProxy } from 'src/common/base.proxy'
import { ProductProxy } from 'src/modules/product/models/product.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main order proxy class
 *
 * Class that deals with the ordder return data
 */
export class OrderProxy extends BaseProxy {
  @ApiProperty()
  public status: OrderStatus

  @ApiProperty()
  public trackingCode: string

  @ApiProperty()
  public userId: number

  @ApiProperty()
  public productId: number

  @ApiPropertyOptional({ type: () => UserProxy })
  public user?: UserProxy

  @ApiPropertyOptional({ type: () => ProductProxy })
  public product?: ProductProxy

  public constructor(entity: OrderEntity) {
    super(entity)

    this.status = entity.status
    this.trackingCode = entity.trackingCode
    this.userId = entity.userId
    this.productId = entity.productId

    this.user = entity.user?.toProxy()
    this.product = entity.product?.toProxy()
  }
}

/**
 * The app's main get many order proxy response
 *
 * Class that deals with the order return data with pagination
 */
export class GetManyOrderProxyResponse extends BaseGetManyDefaultResponse {
  @ApiProperty({ type: OrderProxy, isArray: true })
  public data: OrderProxy[]
}

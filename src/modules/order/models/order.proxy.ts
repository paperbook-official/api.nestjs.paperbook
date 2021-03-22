import { ApiProperty } from '@nestjs/swagger'

import { OrderEntity } from '../entities/order.entity'

import { BaseProxy } from 'src/common/base.proxy'

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

  public constructor(entity: OrderEntity) {
    super(entity)

    this.status = entity.status
    this.trackingCode = entity.trackingCode
    this.userId = entity.userId
    this.productId = entity.productId
  }
}

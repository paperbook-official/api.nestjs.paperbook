import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductEntity } from '../entities/product.entity'

import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'
import { BaseProxy } from 'src/common/base.proxy'
import { OrderProxy } from 'src/modules/order/models/order.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

/**
 * The app's main product proxy class
 *
 * Class that deals with the product return data
 */
export class ProductProxy extends BaseProxy {
  @ApiProperty()
  public imageUrl: string

  @ApiProperty()
  public name: string

  @ApiProperty()
  public description: string

  @ApiProperty()
  public price: number

  @ApiProperty()
  public installmentPrice: number

  @ApiProperty()
  public installmentAmount: number

  @ApiProperty()
  public discount: number

  @ApiProperty()
  public stockAmount: number

  @ApiProperty()
  public userId: number

  @ApiPropertyOptional({ type: () => UserProxy })
  public user?: UserProxy

  @ApiPropertyOptional({ type: () => OrderProxy, isArray: true })
  public orders?: OrderProxy[]

  public constructor(entity: ProductEntity) {
    super(entity)

    this.imageUrl = entity.imageUrl
    this.name = entity.name
    this.description = entity.description
    this.price = entity.price
    this.installmentPrice = entity.installmentPrice
    this.installmentAmount = entity.installmentAmount
    this.discount = entity.discount
    this.stockAmount = entity.stockAmount
    this.userId = entity.userId

    this.user = entity.user?.toProxy()
    this.orders = entity.orders?.map(order => order.toProxy())
  }
}

/**
 * The app's main get many product proxy response
 *
 * Class that deals with the products return data with pagination
 */
export class GetManyProductProxyResponse extends BaseGetManyDefaultResponse {
  @ApiProperty({ type: ProductProxy, isArray: true })
  data: ProductProxy[]
}

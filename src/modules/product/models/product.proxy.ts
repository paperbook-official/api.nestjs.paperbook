import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductEntity } from '../entities/product.entity'

import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'
import { BaseProxy } from 'src/common/base.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

/**
 * The app's main product proxy class
 *
 * Class that deals with the product return data
 */
export class ProductProxy extends BaseProxy {
  @ApiProperty()
  public name: string

  @ApiProperty()
  public description: string

  @ApiProperty()
  public fullPrice: number

  @ApiProperty()
  public installmentPrice: number

  @ApiProperty()
  public installmentAmount: number

  @ApiProperty()
  public discountAmount: number

  @ApiProperty()
  public stockAmount: number

  @ApiProperty()
  public userId: number

  @ApiPropertyOptional()
  public user?: UserProxy

  public constructor(productEntity: ProductEntity) {
    super(productEntity)

    this.name = productEntity.name
    this.description = productEntity.description
    this.fullPrice = productEntity.fullPrice
    this.installmentPrice = productEntity.installmentPrice
    this.installmentAmount = productEntity.installmentAmount
    this.discountAmount = productEntity.discountAmount
    this.stockAmount = productEntity.stockAmount
    this.userId = productEntity.userId

    this.user = productEntity.user?.toProxy()
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

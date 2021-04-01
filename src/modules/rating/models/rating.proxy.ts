import { ApiPropertyOptional } from '@nestjs/swagger'

import { RatingEntity } from '../entities/rating.entity'

import { BaseProxy } from 'src/common/base.proxy'
import { ProductProxy } from 'src/modules/product/models/product.proxy'

/**
 * The app's main rating proxy class
 *
 * Class that deals with the rating return data
 */
export class RatingProxy extends BaseProxy {
  @ApiPropertyOptional()
  public five?: number

  @ApiPropertyOptional()
  public four?: number

  @ApiPropertyOptional()
  public three?: number

  @ApiPropertyOptional()
  public two?: number

  @ApiPropertyOptional()
  public one?: number

  @ApiPropertyOptional()
  public zero?: number

  @ApiPropertyOptional()
  public productId?: number

  @ApiPropertyOptional({ type: () => ProductProxy })
  public product?: ProductProxy

  public constructor(entity: RatingEntity) {
    super(entity)

    this.five = entity.five
    this.four = entity.four
    this.three = entity.three
    this.two = entity.two
    this.one = entity.one
    this.zero = entity.zero
    this.productId = entity.productId

    // relations
    this.product = entity.product?.toProxy()
  }
}

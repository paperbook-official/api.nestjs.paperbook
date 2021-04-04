import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { RatingEntity } from '../entities/rating.entity'

import { BaseProxy } from 'src/common/base.proxy'
import { ProductProxy } from 'src/modules/product/models/product.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

/**
 * The app's main rating proxy class
 *
 * Class that deals with the rating return data
 */
export class RatingProxy extends BaseProxy {
  @ApiPropertyOptional()
  public stars?: number

  @ApiPropertyOptional()
  public text?: string

  @ApiProperty()
  public userId: number

  @ApiProperty()
  public productId: number

  @ApiPropertyOptional({ type: () => UserProxy })
  public user?: UserProxy

  @ApiPropertyOptional({ type: () => ProductProxy })
  public product?: ProductProxy

  public constructor(entity: RatingEntity) {
    super(entity)

    this.stars = entity.stars
    this.text = entity.text

    // relations
    this.user = entity.user?.toProxy()
    this.product = entity.product?.toProxy()
  }
}

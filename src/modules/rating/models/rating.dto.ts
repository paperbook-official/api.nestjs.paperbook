import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { RatingEntity } from '../entities/rating.entity'

import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

/**
 * The app's main rating dto class
 *
 * Class that deals with the rating return data
 */
export class RatingDto extends BaseResponseDto {
  @ApiPropertyOptional()
  public stars?: number

  @ApiPropertyOptional()
  public text?: string

  @ApiProperty()
  public userId: number

  @ApiProperty()
  public productId: number

  @ApiPropertyOptional({ type: () => UserDto })
  public user?: UserDto

  @ApiPropertyOptional({ type: () => ProductDto })
  public product?: ProductDto

  public constructor(entity: RatingEntity) {
    super(entity)

    this.stars = entity.stars
    this.text = entity.text

    // relations
    this.user = entity.user?.toDto()
    this.product = entity.product?.toDto()
  }
}

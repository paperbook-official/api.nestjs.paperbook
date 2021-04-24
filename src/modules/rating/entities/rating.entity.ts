import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { RatingDto } from '../models/rating.dto'
import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { ToDto } from 'src/common/to-dto.interface'

/**
 * The app's main rating entity class
 *
 * Class that represents the entity that deals with rating
 */
@Entity('rating')
export class RatingEntity extends BaseEntity implements ToDto<RatingDto> {
  // #region

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  public stars?: number

  @ApiPropertyOptional()
  @Column({
    type: 'text',
    nullable: true
  })
  public text?: string

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public userId: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public productId: number

  //#region Relations

  @ApiPropertyOptional({ type: () => UserEntity })
  @ManyToOne(
    () => UserEntity,
    user => user.ratings,
    { onDelete: 'CASCADE' }
  )
  public user?: UserEntity

  @ApiPropertyOptional({ type: () => ProductEntity })
  @ManyToOne(
    () => ProductEntity,
    product => product.ratings,
    { onDelete: 'CASCADE' }
  )
  public product?: ProductEntity

  //#endregion

  // #endregion

  public constructor(partial: Partial<RatingEntity>) {
    super()
    Object.assign(this, partial)
  }

  /**
   * Method that converts the entity to your dto
   * @returns the dto data
   */
  public toDto(): RatingDto {
    return new RatingDto(this)
  }
}

/**
 * The app's main get many rating dto response
 *
 * Class that deals with the ratings return data with pagination
 */
export class GetManyRatingDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: RatingDto, isArray: true })
  data: RatingDto[]
}

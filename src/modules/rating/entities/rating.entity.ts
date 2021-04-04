import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { RatingProxy } from '../models/rating.proxy'
import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

/**
 * The app's main rating entity class
 *
 * Class that represents the entity that deals with rating
 */
@Entity('rating')
export class RatingEntity extends BaseEntity implements ToProxy<RatingProxy> {
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

  @ManyToOne(
    () => UserEntity,
    user => user.ratings,
    { onDelete: 'CASCADE' }
  )
  public user?: UserEntity

  @ApiPropertyOptional({
    type: () => ProductEntity
  })
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
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): RatingProxy {
    return new RatingProxy(this)
  }
}

/**
 * The app's main get many rating proxy response
 *
 * Class that deals with the ratings return data with pagination
 */
export class GetManyRatingProxyResponse extends BaseGetManyDefaultResponse {
  @ApiProperty({ type: RatingProxy, isArray: true })
  data: RatingProxy[]
}

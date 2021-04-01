import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'

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
  public five?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  public four?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  public three?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  public two?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  public one?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  public zero?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public productId: number

  //#region Relations

  @ApiPropertyOptional({ type: () => ProductEntity })
  @ManyToOne(
    () => ProductEntity,
    user => user.ratings
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

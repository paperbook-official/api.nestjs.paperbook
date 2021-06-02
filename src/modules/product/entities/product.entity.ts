import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { CategoryEntity } from 'src/modules/category/entities/category.entity'
import { ProductGroupEntity } from 'src/modules/product-group/entities/product-group.entity'
import { RatingEntity } from 'src/modules/rating/entities/rating.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { ProductDto } from '../models/product.dto'
import { ToDto } from 'src/common/to-dto.interface'

/**
 * The app's main product entity class
 *
 * Class that represents the entity that deals with products
 */
@Entity('product')
export class ProductEntity extends BaseEntity implements ToDto<ProductDto> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  public imageUrl: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  public name: string

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false,
  })
  public description: string

  @ApiProperty()
  @Column({
    type: 'float',
    nullable: false,
  })
  public price: number

  @ApiPropertyOptional()
  @Column({
    type: 'float',
    nullable: true,
  })
  public installmentPrice?: number

  @ApiPropertyOptional()
  @Column({
    type: 'int',
    nullable: false,
    default: 1,
  })
  public installmentAmount?: number

  @ApiPropertyOptional()
  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  public discount?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false,
  })
  public stockAmount: number

  @ApiPropertyOptional()
  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  public ordersAmount?: number

  @ApiProperty()
  @Column({
    type: 'integer',
    nullable: false,
  })
  public userId: number

  //#region Relations

  @ApiPropertyOptional({
    type: () => UserEntity,
  })
  @ManyToOne(
    () => UserEntity,
    user => user.products,
    { onDelete: 'CASCADE' },
  )
  public user?: UserEntity

  @ApiPropertyOptional({
    type: () => CategoryEntity,
    isArray: true,
  })
  @ManyToMany(
    () => CategoryEntity,
    category => category.products,
  )
  public categories?: CategoryEntity[]

  @ApiPropertyOptional({
    type: () => ProductGroupEntity,
    isArray: true,
  })
  @OneToMany(
    () => ProductGroupEntity,
    productGroup => productGroup.product,
  )
  public productGroups?: ProductGroupEntity[]

  @ApiPropertyOptional({
    type: () => RatingEntity,
    isArray: true,
  })
  @OneToMany(
    () => RatingEntity,
    rating => rating.product,
  )
  public ratings?: RatingEntity[]

  //#endregion

  //#endregion

  public constructor(partial: Partial<ProductEntity>) {
    super()
    Object.assign(this, partial)
  }

  /**
   * Method that converts the entity to your dto
   *
   * @returns the dto data
   */
  public toDto(): ProductDto {
    return new ProductDto(this)
  }
}

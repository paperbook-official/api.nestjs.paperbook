import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { CategoryEntity } from 'src/modules/category/entities/category.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'

import { ProductCategoryDto } from '../models/product-category.dto'
import { ToDto } from 'src/common/to-dto.interface'

/**
 * The app's main product category entity class
 *
 * Class that represents the entity that deals with the product category
 * relation
 */
@Entity('product-category')
export class ProductCategoryEntity extends BaseEntity
  implements ToDto<ProductCategoryDto> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'integer',
    nullable: false
  })
  public productId: number

  @ApiProperty()
  @Column({
    type: 'integer',
    nullable: false
  })
  public categoryId: number

  //#region Relations

  @ApiPropertyOptional({ type: () => ProductEntity })
  @ManyToOne(
    () => ProductEntity,
    product => product.productsCategories,
    { onDelete: 'CASCADE' }
  )
  public product?: ProductEntity

  @ApiPropertyOptional({ type: () => CategoryEntity })
  @ManyToOne(
    () => CategoryEntity,
    category => category.productsCategories,
    { onDelete: 'CASCADE' }
  )
  public category?: CategoryEntity

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<ProductCategoryEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to your dto
   * @returns the dto data
   */
  public toDto(): ProductCategoryDto {
    return new ProductCategoryDto(this)
  }
}

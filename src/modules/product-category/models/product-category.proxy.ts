import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductCategoryEntity } from '../entities/product-category.entity'

import { BaseProxy } from 'src/common/base.proxy'
import { CategoryProxy } from 'src/modules/category/models/category.proxy'
import { ProductProxy } from 'src/modules/product/models/product.proxy'

/**
 * The app's main product category proxy clas
 *
 * Class that deals with the product category return data
 */
export class ProductCategoryProxy extends BaseProxy {
  @ApiProperty()
  public productId: number

  @ApiProperty()
  public categoryId: number

  @ApiPropertyOptional({ type: () => ProductProxy })
  public product?: ProductProxy

  @ApiPropertyOptional({ type: () => CategoryProxy })
  public category?: CategoryProxy

  public constructor(entity: ProductCategoryEntity) {
    super(entity)

    this.productId = entity.productId
    this.categoryId = entity.productId

    // relations
    this.product = entity.product?.toProxy()
    this.category = entity.category?.toProxy()
  }
}

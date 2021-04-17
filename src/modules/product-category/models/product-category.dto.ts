import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProductCategoryEntity } from '../entities/product-category.entity'

import { BaseResponseDto } from 'src/common/base-response.dto'
import { CategoryDto } from 'src/modules/category/models/category.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'

/**
 * The app's main product category dto clas
 *
 * Class that deals with the product category return data
 */
export class ProductCategoryDto extends BaseResponseDto {
  @ApiProperty()
  public productId: number

  @ApiProperty()
  public categoryId: number

  @ApiPropertyOptional({ type: () => ProductDto })
  public product?: ProductDto

  @ApiPropertyOptional({ type: () => CategoryDto })
  public category?: CategoryDto

  public constructor(entity: ProductCategoryEntity) {
    super(entity)

    this.productId = entity.productId
    this.categoryId = entity.categoryId

    // relations
    this.product = entity.product?.toDto()
    this.category = entity.category?.toDto()
  }
}

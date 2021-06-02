import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CategoryEntity } from '../entities/category.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductDto } from 'src/modules/product/models/product.dto'

/**
 * The app's main category dto class
 *
 * Class that deals with the category return data
 */
export class CategoryDto extends BaseResponseDto {
  @ApiProperty()
  public name: string

  @ApiPropertyOptional({ type: () => ProductDto, isArray: true })
  public products?: ProductDto[]

  public constructor(entity: CategoryEntity) {
    super(entity)

    this.id = entity.id
    this.createdAt = entity.createdAt
    this.updatedAt = entity.updatedAt
    this.name = entity.name

    // relations
    this.products = entity.products?.map(productCategory =>
      productCategory.toDto(),
    )
  }
}

/**
 * The app's main get many category dto response
 *
 * Class that deals with category return data with pagination
 */
export class GetManyCategoryDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: CategoryDto, isArray: true })
  public data: CategoryDto[]
}

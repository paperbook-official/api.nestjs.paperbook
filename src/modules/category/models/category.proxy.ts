import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CategoryEntity } from '../entities/category.entity'

import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'
import { ProductCategoryProxy } from 'src/modules/product-category/models/product-category.proxy'

/**
 * The app's main category proxy class
 *
 * Class that deals with the category return data
 */
export class CategoryProxy {
  @ApiProperty()
  public id: number

  @ApiProperty()
  public createdAt: Date

  @ApiProperty()
  public updatedAt: Date

  @ApiProperty()
  public name: string

  @ApiPropertyOptional({ type: () => ProductCategoryProxy, isArray: true })
  public productsCategories?: ProductCategoryProxy[]

  public constructor(entity: CategoryEntity) {
    this.id = entity.id
    this.createdAt = entity.createdAt
    this.updatedAt = entity.updatedAt
    this.name = entity.name

    // relations
    this.productsCategories = entity.productsCategories?.map(productCategory =>
      productCategory.toProxy()
    )
  }
}

/**
 * The app's main get many category proxy response
 *
 * Class that deals with category return data with pagination
 */
export class GetManyCategoryProxyResponse extends BaseGetManyDefaultResponse {
  @ApiProperty({ type: CategoryProxy, isArray: true })
  public data: CategoryProxy[]
}

import { ApiProperty } from '@nestjs/swagger'

import { CategoryEntity } from '../entities/category.entity'

import { BaseGetManyDefaultResponse } from 'src/common/base-get-many-default-response.proxy'

/**
 * The app's main category proxy class
 *
 * Class that deals with the cateogyr return data
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

  public constructor(categoryEntity: CategoryEntity) {
    this.id = categoryEntity.id
    this.createdAt = categoryEntity.createdAt
    this.updatedAt = categoryEntity.updatedAt
    this.name = categoryEntity.name
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

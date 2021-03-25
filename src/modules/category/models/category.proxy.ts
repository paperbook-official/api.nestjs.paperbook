import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CategoryEntity } from '../entities/category.entity'


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
    this.id = +categoryEntity.id
    this.createdAt = categoryEntity.createdAt
    this.updatedAt = categoryEntity.updatedAt
    this.name = categoryEntity.name
  }
}

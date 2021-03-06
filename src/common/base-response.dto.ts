import { ApiProperty } from '@nestjs/swagger'

import { BaseEntity } from './base.entity'

/**
 * The app's main base dto class
 *
 * Class that deals with the entity return data
 */
export abstract class BaseResponseDto {
  @ApiProperty()
  public id: number

  @ApiProperty()
  public createdAt: Date

  @ApiProperty()
  public updatedAt: Date

  @ApiProperty()
  public isActive: boolean

  protected constructor(entity: BaseEntity) {
    this.id = entity.id
    this.createdAt = entity.createdAt
    this.updatedAt = entity.updatedAt
    this.isActive = entity.isActive
  }
}

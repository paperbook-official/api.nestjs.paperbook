import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'

import { CategoryDto } from '../models/category.dto'
import { ToDto } from 'src/common/to-dto.interface'

/**
 * The app's main category entity class
 *
 * Class that represents the entity that deals with rating
 */
@Entity('category')
export class CategoryEntity extends BaseEntity implements ToDto<CategoryDto> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public name: string

  //#region

  @ApiPropertyOptional({ type: () => ProductEntity, isArray: true })
  @JoinTable()
  @ManyToMany(
    () => ProductEntity,
    product => product.categories
  )
  public products?: ProductEntity[]

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<CategoryEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to your dto
   * @returns the dto data
   */
  public toDto(): CategoryDto {
    return new CategoryDto(this)
  }
}

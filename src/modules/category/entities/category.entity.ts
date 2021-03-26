import { ApiProperty } from '@nestjs/swagger'
import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'

import { CategoryProxy } from '../models/category.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

/**
 * The app's main Category entity class
 *
 * Class that represents the entity that deals with Category
 */
@Entity('category')
export class CategoryEntity extends BaseEntity
  implements ToProxy<CategoryProxy> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public name: string

  //#endregion

  public constructor(partialEntity: Partial<CategoryEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to you proxy
   * @returns the proxy data
   */
  public toProxy(): CategoryProxy {
    return new CategoryProxy(this)
  }
}

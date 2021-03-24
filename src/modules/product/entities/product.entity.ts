import { ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { ProductProxy } from '../models/product.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

@Entity('products')
export class ProductEntity extends BaseEntity implements ToProxy<ProductProxy> {
  //#region Columns

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true
  })
  public name: string

  @Column({
    type: 'text',
    nullable: false
  })
  public description: string

  @Column({
    type: 'float',
    nullable: false
  })
  public fullPrice: number

  @Column({
    type: 'float',
    nullable: true
  })
  public installmentPrice?: number

  @Column({
    type: 'int',
    nullable: true,
    default: 1
  })
  public installmentAmount?: number

  @Column({
    type: 'float',
    nullable: true,
    default: 0
  })
  public discountAmount?: number

  @Column({
    type: 'int',
    nullable: false
  })
  public stockAmount: number

  @Column({
    type: 'integer',
    nullable: false
  })
  public userId: number

  //#region Relations

  @ApiPropertyOptional({ type: () => UserEntity })
  @ManyToOne(
    () => UserEntity,
    user => user.products
  )
  public user?: UserEntity

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<ProductEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to you proxy
   * @returns the proxy data
   */
  public toProxy(): ProductProxy {
    return new ProductProxy(this)
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { OrderEntity } from 'src/modules/order/entities/order.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { ProductProxy } from '../models/product.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

/**
 * The app's main product entity class
 *
 * Class that represents the entity that deals with products
 */
@Entity('product')
export class ProductEntity extends BaseEntity implements ToProxy<ProductProxy> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  public imageUrl: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true
  })
  public name: string

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false
  })
  public description: string

  @ApiProperty()
  @Column({
    type: 'float',
    nullable: false
  })
  public price: number

  @ApiPropertyOptional()
  @Column({
    type: 'float',
    nullable: true
  })
  public installmentPrice?: number

  @ApiPropertyOptional()
  @Column({
    type: 'int',
    nullable: true,
    default: 1
  })
  public installmentAmount?: number

  @ApiPropertyOptional()
  @Column({
    type: 'float',
    nullable: true,
    default: 0
  })
  public discount?: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public stockAmount: number

  @ApiProperty()
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

  @ApiPropertyOptional({ type: OrderEntity, isArray: true })
  @OneToMany(
    () => OrderEntity,
    order => order.product
  )
  public orders?: OrderEntity[]

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<ProductEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): ProductProxy {
    return new ProductProxy(this)
  }
}

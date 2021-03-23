import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { OrderProxy } from '../models/order.proxy'
import { ToProxy } from 'src/common/to-proxy.interface'

import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main order entity class
 *
 * Class that represents the entity that deals with orders
 */
@Entity('order')
export class OrderEntity extends BaseEntity implements ToProxy<OrderProxy> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public status: OrderStatus

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true
  })
  public trackingCode: string

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public userId: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public productId: number

  //#region Relations

  @ApiPropertyOptional()
  @ManyToOne(
    () => UserEntity,
    user => user.orders
  )
  public user?: UserEntity

  @ApiPropertyOptional()
  @ManyToOne(
    () => ProductEntity,
    product => product.orders
  )
  public product?: ProductEntity

  //#endregion

  //#endregion

  public constructor(entity: Partial<OrderEntity>) {
    super()
    Object.assign(this, entity)
  }

  /**
   * Method that converts the entity to your proxy
   * @returns the proxy data
   */
  public toProxy(): OrderProxy {
    return new OrderProxy(this)
  }
}

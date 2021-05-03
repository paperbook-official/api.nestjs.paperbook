import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductGroupEntity } from 'src/modules/product-group/entities/product-group.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { OrderDto } from '../models/order.dto'
import { ToDto } from 'src/common/to-dto.interface'

import { OrderStatus } from 'src/models/enums/order-status.enum'

/**
 * The app's main order entity class
 *
 * Class that represents the entity that deals with orders
 */
@Entity('order')
export class OrderEntity extends BaseEntity implements ToDto<OrderDto> {
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

  @ApiPropertyOptional({ type: () => UserEntity })
  @ManyToOne(
    () => UserEntity,
    user => user.orders,
    { onDelete: 'CASCADE' }
  )
  public user?: UserEntity

  @ApiPropertyOptional({
    type: () => ProductGroupEntity,
    isArray: true
  })
  @OneToMany(
    () => ProductGroupEntity,
    productGroup => productGroup.order
  )
  public productGroups?: ProductGroupEntity[]

  //#endregion

  //#endregion

  public constructor(entity: Partial<OrderEntity>) {
    super()
    Object.assign(this, entity)
  }

  /**
   * Method that converts the entity to your dto
   *
   * @returns the dto data
   */
  public toDto(): OrderDto {
    return new OrderDto(this)
  }
}

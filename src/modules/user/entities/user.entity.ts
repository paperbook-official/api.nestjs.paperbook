import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { AddressEntity } from 'src/modules/address/entities/address.entity'
import { OrderEntity } from 'src/modules/order/entities/order.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { RatingEntity } from 'src/modules/rating/entities/rating.entity'
import { ShoppingCartEntity } from 'src/modules/shopping-cart/entities/shopping-cart.entity'

import { UserDto } from '../models/user.dto'
import { ToDto } from 'src/common/to-dto.interface'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main user entity class
 *
 * Class that represents the entity that deals with users
 */
@Entity('user')
export class UserEntity extends BaseEntity implements ToDto<UserDto> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public name: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false
  })
  public lastName: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true
  })
  public email: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  public password: string

  @ApiPropertyOptional()
  @Column({
    type: 'varchar',
    length: 11,
    nullable: true
  })
  public cpf?: string

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 12,
    nullable: false
  })
  public roles: RolesEnum

  @ApiPropertyOptional()
  @Column({
    type: 'varchar',
    length: 11,
    nullable: true
  })
  public phone?: string

  @ApiPropertyOptional()
  @Column({
    type: 'int',
    nullable: true
  })
  public shoppingCartId?: number

  //#region Relations

  @ApiPropertyOptional({ type: () => ShoppingCartEntity })
  @OneToOne(
    () => ShoppingCartEntity,
    shoppingCart => shoppingCart.user
  )
  public shoppingCart?: ShoppingCartEntity

  @ApiPropertyOptional({
    type: () => AddressEntity,
    isArray: true
  })
  @OneToMany(
    () => AddressEntity,
    address => address.user
  )
  public addresses?: AddressEntity[]

  @ApiPropertyOptional({
    type: () => ProductEntity,
    isArray: true
  })
  @OneToMany(
    () => ProductEntity,
    product => product.user
  )
  public products?: ProductEntity[]

  @ApiPropertyOptional({
    type: () => OrderEntity,
    isArray: true
  })
  @OneToMany(
    () => OrderEntity,
    order => order.user
  )
  public orders?: OrderEntity[]

  @ApiPropertyOptional({
    type: () => RatingEntity,
    isArray: true
  })
  @OneToMany(
    () => RatingEntity,
    rating => rating.user
  )
  public ratings?: RatingEntity[]

  //#endregion

  //#endregion

  public constructor(partialEntity: Partial<UserEntity>) {
    super()
    Object.assign(this, partialEntity)
  }

  /**
   * Method that converts the entity to your dto
   * @returns the dto data
   */
  public toDto(): UserDto {
    return new UserDto(this)
  }
}

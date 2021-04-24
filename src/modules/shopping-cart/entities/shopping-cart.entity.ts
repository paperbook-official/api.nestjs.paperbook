import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductGroupEntity } from 'src/modules/product-group/entities/product-group.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'

import { ShoppingCartDto } from '../models/shopping-cart.dto'
import { ToDto } from 'src/common/to-dto.interface'

/**
 * The app's main shopping cart entity class
 *
 * Class that represents the entity that deals with shopping cart
 */
@Entity('shopping-cart')
export class ShoppingCartEntity extends BaseEntity
  implements ToDto<ShoppingCartDto> {
  //#region Columns

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  public userId: number

  //#region Relations

  @ApiPropertyOptional({
    type: () => UserEntity
  })
  @JoinColumn()
  @OneToOne(
    () => UserEntity,
    user => user.shoppingCart,
    { onDelete: 'CASCADE' }
  )
  public user?: UserEntity

  @ApiPropertyOptional({
    type: () => ProductGroupEntity,
    isArray: true
  })
  @OneToMany(
    () => ProductGroupEntity,
    productGroup => productGroup.shoppingCart
  )
  public productGroups?: ProductGroupEntity[]

  //#endregion

  //#endregion

  public constructor(partial: Partial<ShoppingCartEntity>) {
    super()
    Object.assign(this, partial)
  }

  /**
   * Method that converts the shopping cart entity to your dto
   * @returns the dto data
   */
  public toDto(): ShoppingCartDto {
    return new ShoppingCartDto(this)
  }
}

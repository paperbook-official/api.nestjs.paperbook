import { ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
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

  @Column({
    type: 'int',
    nullable: false
  })
  public productId: number

  @Column({
    type: 'int',
    nullable: false
  })
  public userId: number

  //#region Relations

  @ApiPropertyOptional({
    type: () => ProductEntity
  })
  @ManyToOne(
    () => ProductEntity,
    product => product.shoppingCarts,
    { onDelete: 'CASCADE' }
  )
  public product?: ProductEntity

  @ApiPropertyOptional({
    type: () => UserEntity
  })
  @ManyToOne(
    () => UserEntity,
    user => user.shoppingCarts,
    { onDelete: 'CASCADE' }
  )
  public user?: UserEntity

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

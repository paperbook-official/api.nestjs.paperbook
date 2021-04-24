import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ShoppingCartEntity } from '../entities/shopping-cart.entity'

import { BaseGetManyDefaultResponseDto } from 'src/common/base-get-many-default-response.dto'
import { BaseResponseDto } from 'src/common/base-response.dto'
import { ProductGroupDto } from 'src/modules/product-group/models/product-group.dto'
import { UserDto } from 'src/modules/user/models/user.dto'

/**
 * The app's main shopping cart dto class
 *
 * Class that deals with the shopping cart return data
 */
export class ShoppingCartDto extends BaseResponseDto {
  @ApiProperty()
  public userId: number

  //#region Relations

  @ApiPropertyOptional({ type: () => UserDto })
  public user?: UserDto

  @ApiPropertyOptional({
    type: () => ProductGroupDto,
    isArray: true
  })
  public productGroups?: ProductGroupDto[]

  //#endregion

  public constructor(entity: ShoppingCartEntity) {
    super(entity)

    this.userId = entity.userId

    // relations
    this.user = entity.user?.toDto()
    this.productGroups = entity.productGroups?.map(productGroup =>
      productGroup.toDto()
    )
  }
}

/**
 * The app's main get many shopping cart dto response
 *
 * Class that deals with the shopping cart return data with pagination
 */
export class GetManyShoppingCartDtoResponse extends BaseGetManyDefaultResponseDto {
  @ApiProperty({ type: ShoppingCartDto, isArray: true })
  data: ShoppingCartDto[]
}

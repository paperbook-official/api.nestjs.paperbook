import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud } from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateProductGroupDto } from '../models/create-product-group.dto'
import { ProductGroupDto } from '../models/product-group.dto'

import { ProductGroupService } from '../services/product-group.service'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main product group controller class
 *
 * Class that deals with the product group routes
 */
@Crud({
  model: {
    type: ProductGroupDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      shoppingCart: {}
    }
  }
})
@ApiTags('product-groups')
@Controller('product-groups')
export class ProductGroupController {
  public constructor(
    private readonly productGroupService: ProductGroupService
  ) {}

  /**
   * Method that is called when the user access the "/product-groups" with
   * the "POST" method
   * @param requestUser stores the logged user data
   * @param createProductGroupPayload stores the new product group data
   * @returns the created product group entity dto
   */
  @ApiOperation({ summary: 'Creates a new product group' })
  @ApiCreatedResponse({
    description: 'Gets the created product group',
    type: ProductGroupDto
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createProductGroupPayload: CreateProductGroupDto
  ): Promise<ProductGroupDto> {
    const entity = await this.productGroupService.create(
      requestUser,
      createProductGroupPayload
    )
    return entity.toDto()
  }
}

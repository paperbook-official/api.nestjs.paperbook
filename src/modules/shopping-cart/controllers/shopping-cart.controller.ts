import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { CreateShoppingCartPayload } from '../models/create-shopping-cart.payload'
import { ShoppingCartProxy } from '../models/shopping-cart.proxy'

import { ShoppingCartService } from '../services/shopping-cart.service'

import { RequestUser } from 'src/utils/type.shared'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main shopping cart controller class
 *
 * Class that deals with the shopping cart routes
 */
@Crud({
  model: {
    type: ShoppingCartProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      user: {}
    }
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase'
    ]
  }
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('shopping-carts')
@Controller('shopping-carts')
export class ShoppingCartController {
  public constructor(
    private readonly shoppingCartService: ShoppingCartService
  ) {}

  /**
   * Method that is called when the user acces the "/shopping-cart"
   * route with the "POST" method
   * @param requestUser stores the logged user data
   * @param createShoppingCartPayload stores the new shopping
   * cart entity data
   * @returns the created shopping cart entity proxy
   */
  @ApiOperation({ summary: 'Creates a new shopping cart entity' })
  @ApiCreatedResponse({
    description: 'Gets the created shopping cart entity data',
    type: ShoppingCartProxy
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post()
  public async create(
    @User() requestUser: RequestUser,
    @Body() createShoppingCartPayload: CreateShoppingCartPayload
  ): Promise<ShoppingCartProxy> {
    const entity = await this.shoppingCartService.create(
      requestUser,
      createShoppingCartPayload
    )
    return entity.toProxy()
  }
}

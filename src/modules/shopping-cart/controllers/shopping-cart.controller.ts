import { Controller, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { ShoppingCartProxy } from '../models/shopping-cart.proxy'

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
export class ShoppingCartController {}

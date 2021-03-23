import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { CreateOrderPayload } from '../models/create-order.payload'
import { OrderProxy } from '../models/order.proxy'

import { OrderService } from '../services/order.service'

import { RequestUser } from 'src/utils/type.shared'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main order controller class
 *
 * Class that deals with the order routes
 */
@Crud({
  model: {
    type: OrderProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }]
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
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  /**
   * Method that is called when the user access the "orders" route
   * with "POST" method
   * @param requestUser stores the logged user data
   * @param createOrderPayload stores the new order data
   * @returns the new order
   */
  @ApiOperation({ summary: 'Creates a new order' })
  @ApiCreatedResponse({
    description: 'Gets the created order data',
    type: OrderProxy
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post()
  public async create(
    @User() requestUser: RequestUser,
    @Body() createOrderPayload: CreateOrderPayload
  ): Promise<OrderProxy> {
    const entity = await this.orderService.create(
      requestUser,
      createOrderPayload
    )
    return entity.toProxy()
  }
}

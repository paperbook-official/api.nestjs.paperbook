import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common'
import { Get } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest
} from '@nestjsx/crud'

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

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "GET" method
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found order
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') orderId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<OrderProxy> {
    const entity = await this.orderService.get(
      orderId,
      requestUser,
      crudRequest
    )
    return entity.toProxy()
  }
}

import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common'
import { Get } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateOrderDto } from '../models/create-order.dto'
import { OrderDto } from '../models/order.dto'
import { UpdateOrderDto } from '../models/update-order.dto'

import { OrderService } from '../services/order.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main order controller class
 *
 * Class that deals with the order routes
 */
@Crud({
  model: {
    type: OrderDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
      productGroups: {},
      'productGroups.product': {},
      'productGroups.product.user': {}
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
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  /**
   * Method that is called when the user access the "orders" route
   * with "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createOrderPayload stores the new order data
   * @returns the new order
   */
  @ApiOperation({ summary: 'Creates a new order' })
  @ApiCreatedResponse({
    description: 'Gets the created order data',
    type: OrderDto
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createOrderPayload: CreateOrderDto
  ): Promise<OrderDto> {
    const entity = await this.orderService.create(
      requestUser,
      createOrderPayload
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "GET" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found order entity dto
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<OrderDto> {
    const entity = await this.orderService.get(
      orderId,
      requestUser,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "orders" route
   * with "GET" method
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found order entity dtos
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get()
  public async getMore(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderDto> | OrderDto[]> {
    const entities = await this.orderService.getMore(requestUser, crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "PATCH" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param updateOrderPayload stores the new order data
   */
  @ApiOperation({ summary: 'Updates a single product' })
  @ApiOkResponse({ description: 'Updates a single order' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updateOrderPayload: UpdateOrderDto
  ): Promise<void> {
    await this.orderService.update(orderId, requestUser, updateOrderPayload)
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "DELETE" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Delete(':id')
  public async delete(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.orderService.delete(orderId, requestUser)
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "PUT" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user
   */
  @ApiOperation({ summary: 'Disables a single order' })
  @ApiOkResponse({ description: 'Disables a single order' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.orderService.disable(orderId, requestUser)
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "PUT" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user
   */
  @ApiOperation({ summary: 'Enables a single order' })
  @ApiOkResponse({ description: 'Enables a single order' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.orderService.enable(orderId, requestUser)
  }
}

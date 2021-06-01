import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { Get } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest,
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'
import { ApiPropertyGet } from 'src/decorators/api-property-get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/request-user/request-user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateOrderDto } from '../models/create-order.dto'
import { GetManyOrderDtoResponse, OrderDto } from '../models/order.dto'
import { UpdateOrderDto } from '../models/update-order.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { OrderService } from '../services/order.service'

import { map } from 'src/utils/crud'

/**
 * The app's main order controller class
 *
 * Class that deals with the order routes
 */
@Crud({
  model: {
    type: OrderDto,
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
      productGroups: {},
      'productGroups.product': {},
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'recoverOneBase',
      'getOneBase',
      'getManyBase',
      'deleteOneBase',
    ],
  },
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
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   * @returns the new order
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Creates a new order' })
  @ApiCreatedResponse({
    description: 'Gets the created order data',
    type: OrderDto,
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createOrderPayload: CreateOrderDto,
  ): Promise<OrderDto> {
    const entity = await this.orderService.create(
      requestUser,
      createOrderPayload,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "orders" route
   * with "GET" method
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   * @returns the found order entity dtos
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves multiple OrderDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyOrderDtoResponse,
  })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get()
  public async listMany(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<OrderDto> | OrderDto[]> {
    const entities = await this.orderService.listMany(requestUser, crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "GET" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   * @returns the found order entity dto
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiPropertyGet()
  @ApiOperation({ summary: 'Retrieves a single OrderDto' })
  @ApiOkResponse({
    description: 'Retrieve a single OrderDto',
    type: OrderDto,
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get(':id')
  public async list(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<OrderDto> {
    const entity = await this.orderService.list(
      orderId,
      requestUser,
      crudRequest,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "PATCH" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @param updateOrderPayload stores the new order data
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single product' })
  @ApiOkResponse({ description: 'Updates a single order' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updateOrderPayload: UpdateOrderDto,
  ): Promise<void> {
    await this.orderService.update(orderId, requestUser, updateOrderPayload)
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "DELETE" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the logged user has no permission to access
   * those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Delete a single order' })
  @ApiOkResponse({ description: 'Delete one base response' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.orderService.delete(orderId, requestUser)
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "PUT" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the order is already disabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single order' })
  @ApiOkResponse({ description: 'Disables a single order' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The order is already disabled' })
  @Put(':id/disable')
  public async disable(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.orderService.disable(orderId, requestUser)
  }

  /**
   * Method that is called when the user access the "orders/:id"
   * route with "PUT" method
   *
   * @param orderId stores the order id
   * @param requestUser stores the logged user
   * @throws {EntityNotFoundException} if the order was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the order is already enabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single order' })
  @ApiOkResponse({ description: 'Enables a single order' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The order is already enabled' })
  @Put(':id/enable')
  public async enable(
    @Param('id') orderId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.orderService.enable(orderId, requestUser)
  }
}

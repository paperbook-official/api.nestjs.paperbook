import { UseInterceptors, Controller, Get, Param } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { UserProxy } from '../models/user.proxy'
import {
  GetManyAddressProxyResponse,
  AddressProxy
} from 'src/modules/address/models/address.proxy'
import {
  GetManyOrderProxyResponse,
  OrderProxy
} from 'src/modules/order/models/order.proxy'
import {
  GetManyProductProxyResponse,
  ProductProxy
} from 'src/modules/product/models/product.proxy'

import { UserService } from '../services/user.service'

import { map } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

import { RolesEnum } from 'src/models/enums/roles.enum'
import { RemoveIdSearchPipe } from 'src/pipes/remove-id-search/remove-id-search.pipe'

/**
 * The app's main user relation controller class
 *
 * Class that deals with the user relation routes
 */
@Crud({
  model: {
    type: UserProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      addresses: {},
      products: {},
      orders: {},
      shoppingCarts: {}
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
@ApiTags('users')
@Controller('users')
export class UserRalationsController {
  public constructor(private readonly userService: UserService) {}

  /**
   * Method that is called when the user access the "/user/me/addresses" route
   * with the "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found data
   */
  @ApiOperation({ summary: 'Retrieves all the logged user addresses' })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the logged user addresses',
    type: GetManyAddressProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/addresses')
  public async getMyAddresses(
    @User() requestUser: RequestUser,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressProxy> | AddressProxy[]> {
    const entities = await this.userService.getAddressesByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/user/me/products" route
   * with the "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found data
   */
  @ApiOperation({ summary: 'Retrieves all the logged user products' })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the logged user products',
    type: GetManyProductProxyResponse
  })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/products')
  public async getMyProducts(
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.userService.getProductsByUserId(
      requestUser.id,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "/user/me/orders" route
   * with the "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found data
   */
  @ApiOperation({ summary: 'Retrieves all the logged user orders' })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the logged user orders',
    type: GetManyOrderProxyResponse
  })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/orders')
  public async getMyOrders(
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderProxy> | OrderProxy[]> {
    const entities = await this.userService.getOrdersByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "users/:id/addresses"
   * route with "GET" method
   * @param userId stores the user id
   * @param requestUser stores the logged user id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found data
   */
  @ApiOperation({ summary: 'Retrieves all the user addresses' })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the user addresses',
    type: GetManyAddressProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/addresses')
  public async getAddressesByUserId(
    @Param('id') userId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressProxy> | AddressProxy[]> {
    const entities = await this.userService.getAddressesByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "users/:id/products"
   * route with "GET" method
   * @param userId stores the user id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found data
   */
  @ApiOperation({ summary: 'Retrieves all the user products' })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the user products',
    type: GetManyProductProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/products')
  public async getProductsByUserId(
    @Param('id') userId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.userService.getProductsByUserId(
      userId,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }

  /**
   * Method that is called when the user access the "users/:id/orders"
   * route with "GET" method
   * @param userId stores the user id
   * @param requestUser stores the logged user id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found data
   */
  @ApiOperation({ summary: 'Retrieves all the user orders' })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the user orders',
    type: GetManyOrderProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/orders')
  public async getOrdersByUserId(
    @Param('id') userId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderProxy> | OrderProxy[]> {
    const entities = await this.userService.getOrdersByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }
}

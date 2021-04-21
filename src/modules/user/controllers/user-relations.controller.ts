import {
  UseInterceptors,
  Controller,
  Get,
  Param,
  Body,
  Put
} from '@nestjs/common'
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
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from '../entities/user.entity'

import { UserDto } from '../models/user.dto'
import {
  GetManyAddressDtoResponse,
  AddressDto
} from 'src/modules/address/models/address.dto'
import {
  GetManyOrderDtoResponse,
  OrderDto
} from 'src/modules/order/models/order.dto'
import { AddProductGroupDto } from 'src/modules/product-group/models/add-product-group.dto'
import { CreateProductGroupDto } from 'src/modules/product-group/models/create-product-group.dto'
import { ProductGroupDto } from 'src/modules/product-group/models/product-group.dto'
import { RemoveProductGroupDto } from 'src/modules/product-group/models/remove-product-group.dto'
import {
  GetManyProductDtoResponse,
  ProductDto
} from 'src/modules/product/models/product.dto'
import {
  GetManyShoppingCartDtoResponse,
  ShoppingCartDto
} from 'src/modules/shopping-cart/models/shopping-cart.dto'

import { UserService } from '../services/user.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'
import { RemoveIdSearchPipe } from 'src/pipes/remove-id-search/remove-id-search.pipe'

/**
 * The app's main user relation controller class
 *
 * Class that deals with the user relation routes
 */
@Crud({
  model: {
    type: UserDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      shoppingCart: {},
      addresses: {},
      products: {},
      orders: {},
      ratings: {},
      product: {}
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
    type: GetManyAddressDtoResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/addresses')
  public async getMyAddresses(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressDto> | AddressDto[]> {
    const entities = await this.userService.getAddressesByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
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
    type: GetManyProductDtoResponse
  })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/products')
  public async getMyProducts(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.userService.getProductsByUserId(
      requestUser.id,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }

  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put('me/shopping-carts/add')
  public async add(
    @RequestUser() requestUser: UserEntity,
    @Body() addProductGroupDto: AddProductGroupDto
  ): Promise<ProductGroupDto> {
    return await this.userService.addProductInMyShoppingCart(
      requestUser.id,
      requestUser,
      addProductGroupDto
    )
  }

  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put('me/shopping-carts/remove')
  public async remove(
    @RequestUser() requestUser: UserEntity,
    @Body() removeProductGroupDto: RemoveProductGroupDto
  ): Promise<void> {
    return null
    // await this.shoppingCartService.remove(requestUser, removeProductGroupDto)
  }

  /**
   * Method that is called when the user access the "users/me/shopping-carts"
   * route with "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found shopping cart entity proxies
   */
  @ApiOperation({
    summary: 'Retrieves all the logged user shopping carts'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the logged user shopping carts',
    type: GetManyShoppingCartDtoResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/shopping-carts')
  public async getMyShoppingCarts(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ShoppingCartDto> | ShoppingCartDto[]> {
    const entities = await this.userService.getShoppingCartsByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
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
    type: GetManyOrderDtoResponse
  })
  @ProtectTo(RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/orders')
  public async getMyOrders(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderDto> | OrderDto[]> {
    const entities = await this.userService.getOrdersByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
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
    type: GetManyAddressDtoResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/addresses')
  public async getAddressesByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressDto> | AddressDto[]> {
    const entities = await this.userService.getAddressesByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
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
    type: GetManyProductDtoResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/products')
  public async getProductsByUserId(
    @Param('id') userId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.userService.getProductsByUserId(
      userId,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }

  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/shopping-carts/add')
  public async addByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() createProductGroupDto: CreateProductGroupDto
  ): Promise<ProductGroupDto> {
    return null
    // return await this.shoppingCartService.add(
    //   requestUser,
    //   createProductGroupDto
    // )
  }

  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/shopping-carts/remove')
  public async removeByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() removeProductGroupDto: RemoveProductGroupDto
  ): Promise<void> {
    return null
    // await this.shoppingCartService.remove(requestUser, removeProductGroupDto)
  }

  /**
   * Method that is called when the user access the "users/:id/shopping-carts"
   * route with "GET" method
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found shopping cart entity proxies
   */
  @ApiOperation({
    summary: 'Retrieves all the user shopping carts'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the user shopping carts',
    type: GetManyShoppingCartDtoResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/shopping-carts')
  public async getShoppingCartsByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ShoppingCartDto> | ShoppingCartDto[]> {
    const entities = await this.userService.getShoppingCartsByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
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
    type: GetManyOrderDtoResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/orders')
  public async getOrdersByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<OrderDto> | OrderDto[]> {
    const entities = await this.userService.getOrdersByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }
}

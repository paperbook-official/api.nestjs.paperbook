import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  HttpCode
} from '@nestjs/common'
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

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'
import { ApiPropertyGet } from 'src/decorators/api-property-get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from '../entities/user.entity'

import { ProductGroupDto } from '../../product-group/models/product-group.dto'
import { RemoveProductGroupDto } from '../../shopping-cart/models/remove-product-group.dto'
import { UserDto } from '../models/user.dto'
import {
  AddressDto,
  GetManyAddressDtoResponse
} from 'src/modules/address/models/address.dto'
import {
  GetManyOrderDtoResponse,
  OrderDto
} from 'src/modules/order/models/order.dto'
import {
  GetManyProductDtoResponse,
  ProductDto
} from 'src/modules/product/models/product.dto'
import { AddProductGroupDto } from 'src/modules/shopping-cart/models/add-product-group.dto'
import { FinishShoppingCartDto } from 'src/modules/shopping-cart/models/finish-shopping-cart.dto'
import { ShoppingCartDto } from 'src/modules/shopping-cart/models/shopping-cart.dto'

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
      product: {},
      productGroups: {}
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
export class UserRelationsController {
  public constructor(private readonly userService: UserService) {}

  /**
   * Method that is called when the user access the "/user/me/addresses" route
   * with the "GET" method
   *
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
   *
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

  /**
   * Method that is called when the user access the "/users/me/shopping-cart/add"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param addProductGroupDto stores the add product group dto
   */
  @ApiOperation({
    summary: 'Adds a new product group in the user shopping cart'
  })
  @ApiCreatedResponse({
    description: 'Gets the created product group entity dto',
    type: ProductGroupDto
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post('me/shopping-cart/add')
  public async addProductInMyShoppingCart(
    @RequestUser() requestUser: UserEntity,
    @Body() addProductGroupDto: AddProductGroupDto
  ): Promise<ProductGroupDto> {
    const entity = await this.userService.addProductInShoppingCartByUserId(
      requestUser.id,
      requestUser,
      addProductGroupDto
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/users/me/shopping-cart/remove"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param removeProductGroupDto stores the remove product group dto
   */
  @ApiOperation({
    summary: 'Removes some product group from the shopping cart'
  })
  @ApiOkResponse({
    description: 'Removes the product group from the shopping cart'
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post('me/shopping-cart/remove')
  @HttpCode(200)
  public async removeProductFromMyShoppingCart(
    @RequestUser() requestUser: UserEntity,
    @Body() removeProductGroupDto: RemoveProductGroupDto
  ): Promise<void> {
    await this.userService.removeProductFromShoppingCartByUserId(
      requestUser.id,
      requestUser,
      removeProductGroupDto
    )
  }

  /**
   * Method that is called when the user access the "/users/me/shopping-cart/finish"
   *
   * @param requestUser stores the logged user data
   * @returns the created order entity dto
   */
  @ApiOperation({
    description: 'Creates the order entity based on the shopping cart data'
  })
  @ApiOkResponse({
    description: 'Retrieves a the created order'
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post('me/shopping-cart/finish')
  @HttpCode(200)
  public async finishMyShoppingCart(
    @RequestUser() requestUser: UserEntity,
    @Body() finishShoppingCartDto: FinishShoppingCartDto
  ): Promise<OrderDto> {
    const entity = await this.userService.finishShoppingCartByUserId(
      requestUser.id,
      requestUser,
      finishShoppingCartDto
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "users/me/shopping-cart"
   * route with "GET" method
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found shopping cart entity dto
   */
  @ApiOperation({
    summary: 'Retrieves the logged user shopping carts'
  })
  @ApiPropertyGet()
  @ApiOkResponse({
    description: 'Gets the logged user shopping carts',
    type: ShoppingCartDto
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/shopping-cart')
  public async getMyShoppingCart(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<ShoppingCartDto> {
    const entity = await this.userService.getShoppingCartByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/user/me/orders" route
   * with the "GET" method
   *
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
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
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
   *
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
   *
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

  /**
   * Method that is called when the user access the "/users/:id/shopping-cart/add"
   * route with the "POST" method
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param addProductGroupDto stores the add product group dto
   */
  @ApiOperation({
    summary: 'Adds a new product group in the user shopping cart'
  })
  @ApiCreatedResponse({
    description: 'Gets the created product group entity dto',
    type: ProductGroupDto
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post(':id/shopping-cart/add')
  public async addProductInShoppingCartByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() addProductGroupDto: AddProductGroupDto
  ): Promise<ProductGroupDto> {
    const entity = await this.userService.addProductInShoppingCartByUserId(
      userId,
      requestUser,
      addProductGroupDto
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/users/:id/shopping-cart/remove"
   * route with the "POST" method
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param removeProductGroupDto stores the remove product group dto
   */
  @ApiOperation({
    summary: 'Removes some product group from the shopping cart'
  })
  @ApiOkResponse({
    description: 'Removes the product group from the shopping cart'
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post(':id/shopping-cart/remove')
  public async removeProductFromShoppingCartByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() removeProductGroupDto: RemoveProductGroupDto
  ): Promise<void> {
    await this.userService.removeProductFromShoppingCartByUserId(
      userId,
      requestUser,
      removeProductGroupDto
    )
  }

  /**
   * Method that is called when the user access the "/users/:id/shopping-cart/finish"
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @returns the created order entity dto
   */
  @ApiOperation({
    description: 'Creates the order entity based on the shopping cart data'
  })
  @ApiOkResponse({
    description: 'Retrieves a the created order'
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Post(':id/shopping-cart/finish')
  @HttpCode(200)
  public async finishShoppingCartByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() finishShoppingCartDto: FinishShoppingCartDto
  ): Promise<OrderDto> {
    const entity = await this.userService.finishShoppingCartByUserId(
      userId,
      requestUser,
      finishShoppingCartDto
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "users/:id/shopping-cart"
   * route with "GET" method
   *
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found shopping cart entity dtos
   */
  @ApiOperation({
    summary: 'Retrieves all the user shopping carts'
  })
  @ApiPropertyGet()
  @ApiOkResponse({
    description: 'Gets the logged user shopping carts',
    type: ShoppingCartDto
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/shopping-cart')
  public async getShoppingCartsByUserId(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<ShoppingCartDto> {
    const entity = await this.userService.getShoppingCartByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "users/:id/orders"
   * route with "GET" method
   *
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

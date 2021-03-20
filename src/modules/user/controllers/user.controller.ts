import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors
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

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/get-many/api-property-get-many.decorator'
import { ApiPropertyGet } from 'src/decorators/get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { CreateUserPayload } from '../models/create-user.payload'
import { UpdateUserPaylaod } from '../models/update-user.payload'
import { UserProxy } from '../models/user.proxy'
import {
  AddressProxy,
  GetManyAddressProxyResponse
} from 'src/modules/address/models/address.proxy'
import {
  GetManyProductProxyResponse,
  ProductProxy
} from 'src/modules/product/models/product.proxy'

import { UserService } from '../services/user.service'

import { mapCrud } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main user controller class
 *
 * Class that deals with the user routes
 */
@Crud({
  model: {
    type: UserProxy
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
@ApiTags('users')
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  /**
   * Method that is called when the user access the "/users" route with
   * the "POST" method
   * @param createdUserPayload stores the new user data
   * @returns the created user data
   */
  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'Gets the created user data',
    type: UserProxy
  })
  @Post()
  public async create(
    @Body() createdUserPayload: CreateUserPayload
  ): Promise<UserProxy> {
    const entity = await this.userService.create(createdUserPayload)
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/users/me" route
   * with "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the logged user data
   */
  @ApiPropertyGet()
  @ApiOperation({ summary: 'Gets the logged user' })
  @ApiOkResponse({ description: 'Gets the logged user data', type: UserProxy })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me')
  public async getMe(
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<UserProxy> {
    const entity = await this.userService.get(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/user/me/addresses" route
   * with the "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found data
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves all the logged user addresses' })
  @ApiOkResponse({
    description: 'Gets all the logged user addresses',
    type: GetManyAddressProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me/addresses')
  public async getMyAddresses(
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressProxy> | AddressProxy[]> {
    const entities = await this.userService.getAddressesByUserId(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "/user/me/products" route
   * with the "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filter, etc
   * @returns all the found data
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves all the logged user products' })
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
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "/users/:id"
   * route with "GET" method
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found user data
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') userId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<UserProxy> {
    const entity = await this.userService.get(userId, requestUser, crudRequest)
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "users/:id/addresses"
   * route with "GET" method
   * @param userId stores the user id
   * @param requestUser stores the logged user id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found data
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves all the user addresses' })
  @ApiOkResponse({
    description: 'Gets all the user addresses',
    type: GetManyAddressProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/addresses')
  public async getAddressesByUserId(
    @Param('id') userId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressProxy> | AddressProxy[]> {
    const entities = await this.userService.getAddressesByUserId(
      userId,
      requestUser,
      crudRequest
    )
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "users/:id/products"
   * route with "GET" method
   * @param userId stores the user id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found data
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves all the user products' })
  @ApiOkResponse({
    description: 'Gets all the user products',
    type: GetManyProductProxyResponse
  })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id/products')
  public async getProductsByUserId(
    @Param('id') userId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.userService.getProductsByUserId(
      userId,
      crudRequest
    )
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "/users" route with
   * "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns the found user data
   */
  @ProtectTo(RolesEnum.Admin)
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<UserProxy> | UserProxy[]> {
    const getManyDefaultResponse = await this.userService.getMany(crudRequest)
    return mapCrud(getManyDefaultResponse)
  }

  /**
   * Method that is called when the user access the "/users/:id" route
   * with "PATCH"
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   */
  @ApiOperation({ summary: 'Updates a single user' })
  @ApiOkResponse({ description: 'Updates user' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') userId: number,
    @User() requestUser: RequestUser,
    @Body() updatedUserPayload: UpdateUserPaylaod
  ): Promise<void> {
    await this.userService.update(userId, requestUser, updatedUserPayload)
  }

  /**
   * Method that is called when the user access the "/users/:id" route
   * with "DELETE" method
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   */
  @ProtectTo(RolesEnum.Admin)
  @Delete(':id')
  public async delete(
    @Param('id') userId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.userService.delete(userId, requestUser)
  }

  /**
   * Method that is called when the user access the "users/:id/disable"
   * route with "PUT" method
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single user' })
  @ApiOkResponse({ description: 'Disables a single user' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(
    @Param('id') userId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.userService.disable(userId, requestUser)
  }

  /**
   * Method that is called when the user access the "users/:id/enable"
   * route with "PUT" method
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Enables a single user' })
  @ApiOkResponse({ description: 'Enables a single user' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(
    @Param('id') userId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.userService.enable(userId, requestUser)
  }
}

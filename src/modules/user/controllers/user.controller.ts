import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { JwtGuard } from 'src/guards/jwt/jwt.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

import { UserEntity } from '../entities/user.entity'

import { CreateUserPayload } from '../models/create-user.payload'
import { UpdateUserPaylaod } from '../models/update-user.payload'
import { UserProxy } from '../models/user.proxy'
import { AddressProxy } from 'src/modules/address/models/address.proxy'

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
    type: UserEntity
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
  @ApiQuery({
    required: false,
    name: 'cache',
    type: 'integer',
    description: 'Reset cache (if was enabled).'
  })
  @ApiQuery({
    required: false,
    name: 'fields',
    type: 'string',
    isArray: true,
    description: 'Selects resource fields.'
  })
  @ApiQuery({
    required: false,
    name: 'join',
    type: 'string',
    isArray: true,
    description: 'Adds relational resources.'
  })
  @ApiOperation({ summary: 'Gets the logged user' })
  @ApiOkResponse({ description: 'Gets the logged user data', type: UserProxy })
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
   * Method that is called when the user access the "/users/:id"
   * route with "GET" method
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found user data
   */
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
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
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
   * Method that is called when the user access the "/users" route with
   * "GET" method
   * @param crudRequest stores the joins, filters, etc
   * @returns the found user data
   */
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
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
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
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
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
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
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
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
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id/enable')
  public async enable(
    @Param('id') userId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.userService.enable(userId, requestUser)
  }
}

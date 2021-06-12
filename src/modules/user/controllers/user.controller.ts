import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import {
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

import { ApiQueryGet } from 'src/decorators/api-query-get/api-query-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/request-user/request-user.decorator'

import { UserEntity } from '../entities/user.entity'

import { CreateUserDto } from '../models/create-user.dto'
import { UpdateUserDto } from '../models/update-user.dto'
import { GetManyUserDtoResponse, UserDto } from '../models/user.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { UserService } from '../services/user.service'

import { map } from 'src/utils/crud'

/**
 * The app's main user controller class
 *
 * Class that deals with the user routes
 */
@Crud({
  model: {
    type: UserDto,
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
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'getOneBase',
      'recoverOneBase',
      'getManyBase',
      'deleteOneBase',
    ],
  },
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('users')
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  /**
   * Method that is called when the user access the "/users" route with
   * the "POST" method
   *
   * @param createdUserPayload stores the new user data
   * @returns the created user data
   */
  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'Gets the created user data',
    type: UserDto,
  })
  @Post()
  public async create(
    @Body() createdUserPayload: CreateUserDto,
  ): Promise<UserDto> {
    const entity = await this.userService.create(createdUserPayload)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/users/me" route
   * with "GET" method
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the logged user data
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiQueryGet()
  @ApiOperation({ summary: 'Retrieves the logged user' })
  @ApiOkResponse({
    description: 'Retrieves the logged user data',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get('me')
  public async listMe(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<UserDto> {
    const entity = await this.userService.listOne(
      requestUser.id,
      requestUser,
      crudRequest,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/users/:id"
   * route with "GET" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found user data
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiQueryGet()
  @ApiOperation({ summary: 'Retrieves a single UserDto' })
  @ApiOkResponse({
    description: 'Retrieve a single UserDto',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get(':id')
  public async listOne(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<UserDto> {
    const entity = await this.userService.listOne(
      userId,
      requestUser,
      crudRequest,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/users" route with
   * "GET" method
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns the found user data
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Retrieves multiple UserDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyUserDtoResponse,
  })
  @Get()
  public async listMany(
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<UserDto> | UserDto[]> {
    const getManyDefaultResponse = await this.userService.getMany(crudRequest)
    return map(getManyDefaultResponse, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/users/:id" route
   * with "PATCH" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to execute this action
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single user entity' })
  @ApiOkResponse({ description: 'Updates a single user entity' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updatedUserPayload: UpdateUserDto,
  ): Promise<void> {
    await this.userService.update(userId, requestUser, updatedUserPayload)
  }

  /**
   * Method that is called when the user access the "/users/:id" route
   * with "DELETE" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Delete a single user entity' })
  @ApiOkResponse({ description: 'Delete one base response' })
  @ApiNotFoundResponse({ description: 'User cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.userService.delete(userId, requestUser)
  }

  /**
   * Method that is called when the user access the "users/:id/disable"
   * route with "PUT" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the user is already disabled
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single user' })
  @ApiOkResponse({ description: 'Disables a single user' })
  @Put(':id/disable')
  public async disable(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.userService.disable(userId, requestUser)
  }

  /**
   * Method that is called when the user access the "users/:id/enable"
   * route with "PUT" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the user is already enabled
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single user' })
  @ApiOkResponse({ description: 'Enables a single user' })
  @Put(':id/enable')
  public async enable(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.userService.enable(userId, requestUser)
  }

  /**
   * Method that is called when the user access the "users/:id/to-seller"
   * route with "PUT" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {ConflictException} if user already has the seller role
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Changes a single user role from "*" to "seller"' })
  @ApiOkResponse({
    description: 'Changes a single user role from "*" to "seller"',
  })
  @Put(':id/to-seller')
  public async modifyUserRolesToSeller(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.userService.modifyUserRolesToSeller(userId, requestUser)
  }

  /**
   * Method that is called when the user access the "users/:id/to-common"
   * route with "PUT" method
   *
   * @param userId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {ConflictException} if user already has the common role
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Changes a single user role from "*" to "common"' })
  @ApiOkResponse({
    description: 'Changes a single user role from "*" to "common"',
  })
  @Put(':id/to-common')
  public async modifyUserRolesToCommon(
    @Param('id') userId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.userService.modifyUserRolesToCommon(userId, requestUser)
  }
}

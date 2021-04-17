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

import { ApiPropertyGet } from 'src/decorators/api-property-get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from '../entities/user.entity'

import { CreateUserDto } from '../models/create-user.dto'
import { UpdateUserDto } from '../models/update-user.dto'
import { UserDto } from '../models/user.dto'

import { UserService } from '../services/user.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main user controller class
 *
 * Class that deals with the user routes
 */
@Crud({
  model: {
    type: UserDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      addresses: {},
      products: {},
      orders: {},
      ratings: {}
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
    type: UserDto
  })
  @Post()
  public async create(
    @Body() createdUserPayload: CreateUserDto
  ): Promise<UserDto> {
    const entity = await this.userService.create(createdUserPayload)
    return entity.toDto()
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
  @ApiOkResponse({ description: 'Gets the logged user data', type: UserDto })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get('me')
  public async getMe(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<UserDto> {
    const entity = await this.userService.get(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return entity.toDto()
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
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<UserDto> {
    const entity = await this.userService.get(userId, requestUser, crudRequest)
    return entity.toDto()
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
  ): Promise<GetManyDefaultResponse<UserDto> | UserDto[]> {
    const getManyDefaultResponse = await this.userService.getMany(crudRequest)
    return map(getManyDefaultResponse, entity => entity.toDto())
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
    @RequestUser() requestUser: UserEntity,
    @Body() updatedUserPayload: UpdateUserDto
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
    @RequestUser() requestUser: UserEntity
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
    @RequestUser() requestUser: UserEntity
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
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.userService.enable(userId, requestUser)
  }
}

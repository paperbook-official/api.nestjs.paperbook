import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { Crud, CrudRequest, ParsedRequest } from '@nestjsx/crud'

import { User } from 'src/decorators/user/user.decorator'

import { JwtGuard } from 'src/guards/jwt/jwt.guard'

import { UserEntity } from '../entities/user.entity'

import { CreateUserPayload } from '../models/create-user.payload'
import { UserProxy } from '../models/user.proxy'

import { UserService } from '../services/user.service'

import { RequestUser } from 'src/utils/type.shared'

/**
 * The app's main user controller class
 *
 * Class that deals with the user routes
 */
@Crud({
  model: {
    type: UserEntity
  },
  routes: {
    only: ['getManyBase']
  }
})
@ApiTags('users')
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  /**
   * Method that is called when the user access the "/user" route with the "POST"
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
   * Method that is called when the user access the "/user/me" route with "GET" method
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
  @UseGuards(JwtGuard)
  @Get('me')
  public async getMe(
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest: CrudRequest
  ): Promise<UserProxy> {
    const entity = await this.userService.get(
      requestUser.id,
      requestUser,
      crudRequest
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/user/:userId" route with "GET" method
   * @param userId stores the user id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found user data
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
  @ApiParam({
    name: 'userId',
    type: 'number'
  })
  @ApiOperation({ summary: 'Gets the user by id' })
  @ApiOkResponse({ description: 'Gets the user data' })
  @UseGuards(JwtGuard)
  @Get(':userId')
  public async get(
    @Param('userId') userId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest: CrudRequest
  ): Promise<UserProxy> {
    const entity = await this.userService.get(userId, requestUser, crudRequest)
    return entity.toProxy()
  }
}

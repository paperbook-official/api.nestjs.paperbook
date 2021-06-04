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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest,
} from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/request-user/request-user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateShoppingCartDto } from '../models/create-shopping-cart.dto'
import {
  GetManyShoppingCartDtoResponse,
  ShoppingCartDto,
} from '../models/shopping-cart.dto'
import { UpdateShoppingCartDto } from '../models/update-shopping-cart.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { ShoppingCartService } from '../services/shopping-cart.service'

import { map } from 'src/utils/crud'

/**
 * The app's main shopping cart controller class
 *
 * Class that deals with the shopping cart routes
 */
@Crud({
  model: {
    type: ShoppingCartDto,
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
      productGroups: {},
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
@ApiTags('shopping-carts')
@Controller('shopping-carts')
export class ShoppingCartController {
  public constructor(
    private readonly shoppingCartService: ShoppingCartService,
  ) {}

  /**
   * Method that is called when the user access the "/shopping-cart"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createShoppingCartPayload stores the new shopping
   * cart entity data
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the created shopping cart entity dto
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Creates a new shopping cart entity' })
  @ApiCreatedResponse({
    description: 'Gets the created shopping cart entity data',
    type: ShoppingCartDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createShoppingCartPayload: CreateShoppingCartDto,
  ): Promise<ShoppingCartDto> {
    const entity = await this.shoppingCartService.create(
      requestUser,
      createShoppingCartPayload,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/shopping-cart"
   * route with the "GET" method
   *
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns all the found shopping cart entity proxies
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Retrieves multiple ShoppingCartDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyShoppingCartDtoResponse,
  })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get()
  public async listMany(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<ShoppingCartDto> | ShoppingCartDto[]> {
    const entities = await this.shoppingCartService.listMany(
      requestUser,
      crudRequest,
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/shopping-cart/:id"
   * route with the "GET" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the shopping card was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found shopping cart entity dto
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiProperty()
  @ApiOperation({ summary: 'Retrieves multiple ShoppingCartDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyShoppingCartDtoResponse,
  })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get(':id')
  public async listOne(
    @Param('id') shoppingCartId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<ShoppingCartDto> {
    const entity = await this.shoppingCartService.listOne(
      shoppingCartId,
      requestUser,
      crudRequest,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/shopping-cart/:id"
   * route with the "PATCH" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @param updateShoppingCartPayload stores the shopping cart new data
   * @throws {EntityNotFoundException} if the shopping card was not found
   */
  @ProtectTo(RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single shopping entity' })
  @ApiOkResponse({ description: 'Updates a single shopping entity' })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') shoppingCartId: number,
    @Body() updateShoppingCartPayload: UpdateShoppingCartDto,
  ): Promise<void> {
    await this.shoppingCartService.update(
      shoppingCartId,
      updateShoppingCartPayload,
    )
  }

  /**
   * Method that is called when the user access the "/shopping-cart/:id"
   * route with the "DELETE" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the shopping card was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Delete a single shopping cart entity' })
  @ApiOkResponse({ description: 'Delete one base response' })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(
    @Param('id') shoppingCartId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.shoppingCartService.delete(shoppingCartId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/shopping-cart/:id/disable" route with the "PUT" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @throws {EntityNotFoundException} if the shopping cart was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the shopping cart is already disabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single shopping cart entity' })
  @ApiOkResponse({ description: 'Disables a single shopping cart entity' })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The shopping cart is already disabled' })
  @Put(':id/disable')
  public async disable(@Param('id') shoppingCartId: number): Promise<void> {
    await this.shoppingCartService.disable(shoppingCartId)
  }

  /**
   * Method that is called when the user access the
   * "/shopping-cart/:id/enable" route with the "PUT" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @throws {EntityNotFoundException} if the shopping cart was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the shopping cart is already enabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single shopping cart entity' })
  @ApiOkResponse({ description: 'Enables a single shopping cart entity' })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The shopping cart is already enabled' })
  @Put(':id/enable')
  public async enable(@Param('id') shoppingCartId: number): Promise<void> {
    await this.shoppingCartService.enable(shoppingCartId)
  }
}

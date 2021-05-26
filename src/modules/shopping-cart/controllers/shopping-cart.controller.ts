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

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateShoppingCartDto } from '../models/create-shopping-cart.dto'
import { ShoppingCartDto } from '../models/shopping-cart.dto'
import { UpdateShoppingCartDto } from '../models/update-shopping-cart.dto'

import { ShoppingCartService } from '../services/shopping-cart.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main shopping cart controller class
 *
 * Class that deals with the shopping cart routes
 */
@Crud({
  model: {
    type: ShoppingCartDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
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
@ApiTags('shopping-carts')
@Controller('shopping-carts')
export class ShoppingCartController {
  public constructor(
    private readonly shoppingCartService: ShoppingCartService
  ) {}

  /**
   * Method that is called when the user access the "/shopping-cart"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createShoppingCartPayload stores the new shopping
   * cart entity data
   * @returns the created shopping cart entity dto
   */
  @ApiOperation({ summary: 'Creates a new shopping cart entity' })
  @ApiCreatedResponse({
    description: 'Gets the created shopping cart entity data',
    type: ShoppingCartDto
  })
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createShoppingCartPayload: CreateShoppingCartDto
  ): Promise<ShoppingCartDto> {
    const entity = await this.shoppingCartService.create(
      requestUser,
      createShoppingCartPayload
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/shopping-cart/:id"
   * route with the "GET" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @returns the found shopping cart entity dto
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') shoppingCartId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<ShoppingCartDto> {
    const entity = await this.shoppingCartService.get(
      shoppingCartId,
      requestUser,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/shopping-cart"
   * route with the "GET" method
   *
   * @param requestUser stores the logged user
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found shopping cart entity proxies
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Get()
  public async getMore(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ShoppingCartDto> | ShoppingCartDto[]> {
    const entities = await this.shoppingCartService.getMore(
      requestUser,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/shopping-cart/:id"
   * route with the "PATCH" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @param updateShoppingCartPayload stores the shopping cart new data
   */
  @ApiOperation({ summary: 'Updates a single shopping cart entity' })
  @ApiOkResponse({ description: 'Updates a single shopping cart entity' })
  @ProtectTo(RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') shoppingCartId: number,
    @Body() updateShoppingCartPayload: UpdateShoppingCartDto
  ): Promise<void> {
    await this.shoppingCartService.update(
      shoppingCartId,
      updateShoppingCartPayload
    )
  }

  /**
   * Method that is called when the user access the "/shopping-cart/:id"
   * route with the "DELETE" method
   *
   * @param shoppingCartId stores the shopping cart id
   * @param requestUser stores the logged user data
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Delete(':id')
  public async delete(
    @Param('id') shoppingCartId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.shoppingCartService.delete(shoppingCartId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/shopping-cart/:id/disable" route with the "PUT" method
   *
   * @param shoppingCartId stores the shopping cart id
   */
  @ApiOperation({ summary: 'Disables a single shopping cart entity' })
  @ApiOkResponse({ description: 'Disables a single shopping cart entity' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(@Param('id') shoppingCartId: number): Promise<void> {
    await this.shoppingCartService.disable(shoppingCartId)
  }

  /**
   * Method that is called when the user access the
   * "/shopping-cart/:id/enable" route with the "PUT" method
   *
   * @param shoppingCartId stores the shopping cart id
   */
  @ApiOperation({ summary: 'Enables a single shopping cart entity' })
  @ApiOkResponse({ description: 'Enables a single shopping cart entity' })
  @ProtectTo(RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(@Param('id') shoppingCartId: number): Promise<void> {
    await this.shoppingCartService.enable(shoppingCartId)
  }
}

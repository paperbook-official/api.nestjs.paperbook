import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { Patch } from '@nestjs/common'
import { Delete } from '@nestjs/common'
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

import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { JwtGuard } from 'src/guards/jwt/jwt.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

import { AddressEntity } from '../entities/address.entity'

import { AddressProxy } from '../models/address.proxy'
import { CreateAddressPayload } from '../models/create-address.payload'
import { UpdatedAddressPayload } from '../models/update-address.payload'

import { AddressService } from '../services/address.service'

import { mapCrud } from 'src/utils/crud'
import { RequestUser } from 'src/utils/type.shared'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main address controller class
 *
 * Class that deals with the address routes
 */
@Crud({
  model: {
    type: AddressEntity
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
@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}

  /**
   * Method that is called when the user access the "/addresses"
   * route with "POST" method
   * @param requestUser stores the logged user data
   * @param createAddressPayload stores the new address data
   * @returns the created address data
   */
  @ApiOperation({ summary: 'Creates a new address' })
  @ApiCreatedResponse({
    description: 'Gets the created address data',
    type: AddressProxy
  })
  @Roles(RolesEnum.Admin, RolesEnum.Seller, RolesEnum.User)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  public async create(
    @User() requestUser: RequestUser,
    @Body() createAddressPayload: CreateAddressPayload
  ): Promise<AddressProxy> {
    const entity = await this.addressService.create(
      requestUser,
      createAddressPayload
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "GET" method
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found address data
   */
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  public async get(
    @Param('id') addressId: number,
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<AddressProxy> {
    const entity = await this.addressService.get(
      addressId,
      requestUser,
      crudRequest
    )
    return entity.toProxy()
  }

  /**
   * Method that is called when the user access the "/addresses" route
   * with "GET" method
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found addresses data
   */
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  public async getMore(
    @User() requestUser: RequestUser,
    @ParsedRequest() crudRequest: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressProxy> | AddressProxy[]> {
    const entities = await this.addressService.getMore(requestUser, crudRequest)
    return mapCrud(entities)
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "PATCH"
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @param updatedUserPayload stores the new user data
   */
  @ApiOperation({ summary: 'Updates a single address' })
  @ApiOkResponse({ description: 'Updates user' })
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  public async update(
    @Param('id') addressId: number,
    @User() requestUser: RequestUser,
    @Body() updatedAddressPayload: UpdatedAddressPayload
  ): Promise<void> {
    await this.addressService.update(
      addressId,
      requestUser,
      updatedAddressPayload
    )
  }

  /**
   * Method that is called when the user acces the "/addresses/:id"
   * route with "DELETE" method
   * @param addressId stores the target user id
   * @param requestUser stores the logged user data
   */
  @Roles(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  public async delete(
    @Param('id') addressId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.addressService.delete(addressId, requestUser)
  }

  /**
   * Method that is called when the user acces the "addresses/:id/disable"
   * route with "PUT" method
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single address' })
  @ApiOkResponse({ description: 'Disables a single address' })
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id/disable')
  public async disable(
    @Param('id') addressId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.addressService.disable(addressId, requestUser)
  }

  /**
   * Method that is called when the user acces the "addresses/:id/enable"
   * route with "PUT" method
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Enables a single address' })
  @ApiOkResponse({ description: 'Enables a single address' })
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id/enable')
  public async enable(
    @Param('id') addressId: number,
    @User() requestUser: RequestUser
  ): Promise<void> {
    await this.addressService.enable(addressId, requestUser)
  }
}

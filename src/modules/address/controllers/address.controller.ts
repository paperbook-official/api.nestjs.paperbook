import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { AddressDto } from '../models/address.dto'
import { CreateAddressDto } from '../models/create-address.dto'
import { UpdatedAddressDto } from '../models/update-address.dto'

import { AddressService } from '../services/address.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main address controller class
 *
 * Class that deals with the address routes
 */
@Crud({
  model: {
    type: AddressDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {}
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
@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}

  /**
   * Method that is called when the user access the "/addresses"
   * route with "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createAddressDto stores the new address data
   * @returns the created address entity dto
   */
  @ApiOperation({ summary: 'Creates a new address' })
  @ApiCreatedResponse({
    description: 'Gets the created address data',
    type: AddressDto
  })
  @ProtectTo(RolesEnum.Admin, RolesEnum.Seller, RolesEnum.User)
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createAddressDto: CreateAddressDto
  ): Promise<AddressDto> {
    const entity = await this.addressService.create(
      requestUser,
      createAddressDto
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "GET" method
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found address entity dto
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get(':id')
  public async get(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<AddressDto> {
    const entity = await this.addressService.get(
      addressId,
      requestUser,
      crudRequest
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/addresses" route
   * with "GET" method
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @returns the found address entity dtos
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Get()
  public async getMore(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<AddressDto> | AddressDto[]> {
    const entities = await this.addressService.getMore(requestUser, crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "PATCH"
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @param updatedAddressDto stores the new address data
   */
  @ApiOperation({ summary: 'Updates a single address' })
  @ApiOkResponse({ description: 'Updates the user' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updatedAddressDto: UpdatedAddressDto
  ): Promise<void> {
    await this.addressService.update(addressId, requestUser, updatedAddressDto)
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "DELETE" method
   *
   * @param addressId stores the target user id
   * @param requestUser stores the logged user data
   */
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Delete(':id')
  public async delete(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.addressService.delete(addressId, requestUser)
  }

  /**
   * Method that is called when the user access the "addresses/:id/disable"
   * route with "PUT" method
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single address' })
  @ApiOkResponse({ description: 'Disables a single address' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.addressService.disable(addressId, requestUser)
  }

  /**
   * Method that is called when the user access the "addresses/:id/enable"
   * route with "PUT" method
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Enables a single address' })
  @ApiOkResponse({ description: 'Enables a single address' })
  @ProtectTo(RolesEnum.User, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.addressService.enable(addressId, requestUser)
  }
}

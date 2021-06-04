import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { Patch } from '@nestjs/common'
import { Delete } from '@nestjs/common'
import {
  ApiConflictResponse,
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

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'
import { ApiPropertyGet } from 'src/decorators/api-property-get/api-property-get.decorator'
import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/request-user/request-user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { AddressDto, GetManyAddressDtoResponse } from '../models/address.dto'
import { CreateAddressDto } from '../models/create-address.dto'
import { UpdatedAddressDto } from '../models/update-address.dto'
import { RolesEnum } from 'src/models/enums/roles.enum'

import { AddressService } from '../services/address.service'

import { map } from 'src/utils/crud'

/**
 * The app's main address controller class
 *
 * Class that deals with the address routes
 */
@Crud({
  model: {
    type: AddressDto,
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
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
   * @throws {EntityNotFoundException} if the user was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the created address entity dto
   */
  @ProtectTo(RolesEnum.Admin, RolesEnum.Seller, RolesEnum.Common)
  @ApiOperation({ summary: 'Creates a new address' })
  @ApiCreatedResponse({
    description: 'Retrieves the created address entity',
    type: AddressDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    const entity = await this.addressService.create(
      requestUser,
      createAddressDto,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/addresses" route
   * with "GET" method
   *
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found address entity dtos
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({ summary: 'Retrieves multiple AddressDto' })
  @ApiOkResponse({
    description: 'Get many base response',
    type: GetManyAddressDtoResponse,
  })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get()
  public async listMany(
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<AddressDto> | AddressDto[]> {
    const entities = await this.addressService.listMany(
      requestUser,
      crudRequest,
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "GET" method
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @returns the found address entity dto
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiPropertyGet()
  @ApiOperation({ summary: 'Retrieves a single AddressDto' })
  @ApiOkResponse({
    description: 'Retrieve a single AddressDto',
    type: AddressDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Get(':id')
  public async listOne(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
    @ParsedRequest() crudRequest?: CrudRequest,
  ): Promise<AddressDto> {
    const entity = await this.addressService.listOne(
      addressId,
      requestUser,
      crudRequest,
    )
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "PATCH"
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @param updatedAddressDto stores the new address data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Updates a single address' })
  @ApiOkResponse({ description: 'Updates the address' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Patch(':id')
  public async update(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updatedAddressDto: UpdatedAddressDto,
  ): Promise<void> {
    await this.addressService.update(addressId, requestUser, updatedAddressDto)
  }

  /**
   * Method that is called when the user access the "/addresses/:id"
   * route with "DELETE" method
   *
   * @param addressId stores the target user id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Delete a single address' })
  @ApiOkResponse({ description: 'Delete one base response' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @Delete(':id')
  public async delete(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.addressService.delete(addressId, requestUser)
  }

  /**
   * Method that is called when the user access the "addresses/:id/disable"
   * route with "PUT" method
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyDisabledException} if the address is already disabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Disables a single address' })
  @ApiOkResponse({ description: 'Disables a single address' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The address is already disabled' })
  @Put(':id/disable')
  public async disable(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.addressService.disable(addressId, requestUser)
  }

  /**
   * Method that is called when the user access the "addresses/:id/enable"
   * route with "PUT" method
   *
   * @param addressId stores the target address id
   * @param requestUser stores the logged user data
   * @throws {EntityNotFoundException} if the address was not found
   * @throws {ForbiddenException} if the request user has no permission
   * to access those sources
   * @throws {EntityAlreadyEnabledException} if the address is already enabled
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @ApiOperation({ summary: 'Enables a single address' })
  @ApiOkResponse({ description: 'Enables a single address' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiForbiddenResponse({
    description: 'The user has no permission to access those sources',
  })
  @ApiConflictResponse({ description: 'The address is already enabled' })
  @Put(':id/enable')
  public async enable(
    @Param('id') addressId: number,
    @RequestUser() requestUser: UserEntity,
  ): Promise<void> {
    await this.addressService.enable(addressId, requestUser)
  }
}

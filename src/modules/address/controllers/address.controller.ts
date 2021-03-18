import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'

import { JwtGuard } from 'src/guards/jwt/jwt.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

import { AddressEntity } from '../entities/address.entity'

import { AddressProxy } from '../models/address.proxy'
import { CreateAddressPayload } from '../models/create-address.payload'

import { AddressService } from '../services/address.service'

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
   * Method that is called when the user access the "/addresses" route with "POST" method
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
}

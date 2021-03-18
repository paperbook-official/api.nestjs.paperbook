import { Controller, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { AddressEntity } from '../entities/address.entity'

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
export class AddressController {}

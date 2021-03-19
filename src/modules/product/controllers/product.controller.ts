import { Controller, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { UserEntity } from 'src/modules/user/entities/user.entity'

/**
 * The app's main products controller class
 *
 * Class that deals with the products routes
 */
@Crud({
  model: {
    type: UserEntity
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
@ApiTags('products')
@Controller('products')
export class ProductController {}

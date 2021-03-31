import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud } from '@nestjsx/crud'

import { RatingProxy } from '../models/rating.proxy'

/**
 * The app's main rating controller class
 *
 * Class that deals with the rating routes
 */
@Crud({
  model: {
    type: RatingProxy
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
@ApiTags('ratings')
@Controller('ratings')
export class RatingController {}

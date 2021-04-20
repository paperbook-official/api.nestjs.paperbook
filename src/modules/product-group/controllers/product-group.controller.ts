import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Crud } from '@nestjsx/crud'

import { ProductGroupDto } from '../models/product-group.dto'

import { ProductGroupService } from '../services/product-group.service'

/**
 * The app's main product group controller class
 *
 * Class that deals with the product group routes
 */
@Crud({
  model: {
    type: ProductGroupDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      shoppingCart: {}
    }
  }
})
@ApiTags('product-group')
@Controller('product-group')
export class ProductGroupController {
  public constructor(
    private readonly productGroupService: ProductGroupService
  ) {}
}

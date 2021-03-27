import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor } from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'

import { CreateProductCategoryPayload } from '../models/create-product-category.payload'
import { ProductCategoryProxy } from '../models/product-category.proxy'

import { ProductCategoryService } from '../services/product-category.service'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main products controller class
 *
 * Class that deals with the products routes
 */
@Crud({
  model: {
    type: ProductCategoryProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {}
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
@ApiTags('products-categories')
@Controller('products-categories')
export class ProductCategoryController {
  public constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}

  /**
   * Method that is called when the user access the "/product-category"
   * route with the "POST" method
   * @param createProductCategoryPayload stores the product-category new data
   * @returns the created product-category entity proxy
   */
  @ApiOperation({ summary: 'Creates a new product-category relation' })
  @ApiCreatedResponse({
    description: 'Gets the created product-category data',
    type: ProductCategoryProxy
  })
  @ProtectTo(RolesEnum.Admin)
  @Post()
  public async create(
    @Body() createProductCategoryPayload: CreateProductCategoryPayload
  ): Promise<ProductCategoryProxy> {
    const entity = await this.productCategoryService.create(
      createProductCategoryPayload
    )
    return entity.toProxy()
  }
}

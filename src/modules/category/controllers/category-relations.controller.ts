import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'

import { CategoryProxy } from '../models/category.proxy'
import {
  GetManyProductProxyResponse,
  ProductProxy
} from 'src/modules/product/models/product.proxy'

import { CategoryService } from '../services/category.service'

import { map } from 'src/utils/crud'

import { RemoveIdSearchPipe } from 'src/pipes/remove-id-search/remove-id-search.pipe'

/**
 * The app's main category controller class
 *
 * Class that deals with the category routes
 */
@Crud({
  model: {
    type: CategoryProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      productsCategories: {}
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
@ApiTags('categories')
@Controller('categories')
export class CategoryRelationsController {
  public constructor(private readonly categoryService: CategoryService) {}

  /** Method that is called when the user access the "/categories/:id/products"
   * route with "GET" method
   * @param categoryId stores the category id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found product entities
   */
  @ApiOperation({
    summary: 'Retrieves all the products of a single category'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products of a single category',
    type: GetManyProductProxyResponse
  })
  @Get(':id/products')
  public async getProductsByCategoryId(
    @Param('id') categoryId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.categoryService.getProductsByCategoryId(
      categoryId,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }
}

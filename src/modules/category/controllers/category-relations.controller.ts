import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import {
  ApiNotFoundResponse,
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

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'

import { RemoveIdSearchPipe } from 'src/pipes/remove-id-search/remove-id-search.pipe'

import { CategoryDto } from '../models/category.dto'
import {
  GetManyProductDtoResponse,
  ProductDto
} from 'src/modules/product/models/product.dto'

import { CategoryRelationsService } from '../services/category-relations.service'

import { map } from 'src/utils/crud'

/**
 * The app's main category relations controller class
 *
 * Class that deals with the category relations routes
 */
@Crud({
  model: {
    type: CategoryDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      products: {},
      categories: {}
    }
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'recoverOneBase',
      'getOneBase',
      'getManyBase'
    ]
  }
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('categories')
@Controller('categories')
export class CategoryRelationsController {
  public constructor(
    private readonly categoryRelationsService: CategoryRelationsService
  ) {}

  /** Method that is called when the user access the "/categories/:id/products"
   * route with "GET" method
   *
   * @param categoryId stores the category id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found product entity dtos
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the products of a single category'
  })
  @ApiOkResponse({
    description: 'Gets all the products of a single category',
    type: GetManyProductDtoResponse
  })
  @ApiNotFoundResponse({ description: 'Category was not found' })
  @Get(':id/products')
  public async getProductsByCategoryId(
    @Param('id') categoryId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.categoryRelationsService.getProductsByCategoryId(
      categoryId,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }
}

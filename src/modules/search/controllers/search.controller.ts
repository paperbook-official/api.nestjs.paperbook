import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'

import {
  GetManyProductDtoResponse,
  ProductDto
} from 'src/modules/product/models/product.dto'

import { ProductService } from 'src/modules/product/services/product.service'

import { map } from 'src/utils/crud'

import { SortBySearchEnum } from 'src/models/enums/sort-by-search.enum'
import { ParseBoolOrUndefinedPipe } from 'src/pipes/parse-bool-or-undefined/parse-bool-or-undefined.pipe'
import { ParseNumberOrUndefinedPipe } from 'src/pipes/parse-number-or-undefined/parse-number-or-undefined.pipe'

/**
 * The app's main search controller class
 *
 * Class that deals with the search routes
 */
@Crud({
  model: {
    type: ProductDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
      orders: {},
      'user.addresses': {},
      categories: {},
      shoppingCarts: {},
      ratings: {}
    }
  },
  routes: {
    exclude: [
      'createManyBase',
      'deleteOneBase',
      'getManyBase',
      'recoverOneBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase'
    ]
  }
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('search')
@Controller('search')
export class SearchController {
  public constructor(private readonly searchService: ProductService) {}

  /**
   * Method that is called when the user access the "/search" with
   * the "GET" method
   * @param name stores the product name
   * @param categoryId stores the category id
   * @param minPrice stores the product min price
   * @param maxPrice stores the product max price
   * @param state stores the seller state
   * @param freeOfInterests stores a value indicating if the products
   * are free or interests
   * @param sortBy stores a value indicating how the items must be returned
   * @param crudRequest stores the joins, filters, etc;
   * @returns all the found products that match with the queries
   */
  @ApiOperation({
    summary: 'Retries all the products that match with the queries'
  })
  @ApiQuery({
    required: false,
    name: 'name',
    type: 'string',
    description: 'Selects products with the name like this query'
  })
  @ApiQuery({
    required: false,
    name: 'categoryId',
    type: 'integer',
    description: 'Selects products with the category id equals this query'
  })
  @ApiQuery({
    required: false,
    name: 'minPrice',
    type: 'integer',
    description: 'Selects products with the full price greater than this query'
  })
  @ApiQuery({
    required: false,
    name: 'maxPrice',
    type: 'integer',
    description: 'Selects products with the full price less than this query'
  })
  @ApiQuery({
    required: false,
    name: 'state',
    type: 'string',
    description: 'Selects products with the user state equals this query'
  })
  @ApiQuery({
    required: false,
    name: 'freeOfInterests',
    type: 'boolean',
    description: 'Selects products with free of interests prices'
  })
  @ApiQuery({
    required: false,
    name: 'sortBy',
    enum: SortBySearchEnum,
    description:
      'Sort the values based on the min price or max price of them with discount'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the products that matches with the queries',
    type: GetManyProductDtoResponse
  })
  @Get()
  public async search(
    @Query('name')
    name?: string,
    @Query('categoryId')
    categoryId?: number,
    @Query('minPrice', ParseNumberOrUndefinedPipe)
    minPrice?: number,
    @Query('maxPrice', ParseNumberOrUndefinedPipe)
    maxPrice?: number,
    @Query('state')
    state?: string,
    @Query('freeOfInterests', ParseBoolOrUndefinedPipe)
    freeOfInterests?: boolean,
    @Query('sortBy')
    sortBy?: SortBySearchEnum,
    @ParsedRequest()
    crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductDto> | ProductDto[]> {
    const entities = await this.searchService.search(
      name,
      categoryId,
      minPrice,
      maxPrice,
      state,
      freeOfInterests,
      sortBy,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }
}

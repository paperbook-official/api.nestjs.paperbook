import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'

import { ProductProxy } from 'src/modules/product/models/product.proxy'

import { ProductService } from 'src/modules/product/services/product.service'

import { map } from 'src/utils/crud'

@Crud({
  model: {
    type: ProductProxy
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      user: {},
      'user.addresses': {},
      productsCategories: {}
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

  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse()
  @Get()
  public async search(
    @Query('name') name?: string,
    @Query('categoryId') categoryId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('state') state?: string,
    @Query('freeOfInterests') freeOfInterests?: string,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<ProductProxy> | ProductProxy[]> {
    const entities = await this.searchService.search(
      name,
      categoryId,
      minPrice,
      maxPrice,
      state,
      freeOfInterests,
      crudRequest
    )
    return map(entities, entity => entity.toProxy())
  }
}

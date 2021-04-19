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

import { GetManyRatingDtoResponse } from 'src/modules/rating/entities/rating.entity'

import { ProductReviewDto } from '../models/product-review.dto'
import { ProductDto } from '../models/product.dto'
import {
  CategoryDto,
  GetManyCategoryDtoResponse
} from 'src/modules/category/models/category.dto'
import { RatingDto } from 'src/modules/rating/models/rating.dto'

import { ProductService } from '../services/product.service'

import { map } from 'src/utils/crud'

import { RemoveIdSearchPipe } from 'src/pipes/remove-id-search/remove-id-search.pipe'

/**
 * The app's main products relations controller class
 *
 * Class that deals with the products relations routes
 */
@Crud({
  model: {
    type: ProductDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      rating: {},
      user: {},
      orders: {},
      categories: {},
      shoppingCarts: {},
      ratings: {},
      products: {},
      product: {}
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
@ApiTags('products')
@Controller('products')
export class ProductRelationsController {
  public constructor(private readonly productService: ProductService) {}

  /**
   * Method that is called when the user access the "/products/:id/categories"
   * route with "GET" method
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found category entities proxies
   */
  @ApiOperation({
    summary: 'Retrieves all the categories of a single product'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the categories of a single product',
    type: GetManyCategoryDtoResponse
  })
  @Get(':id/categories')
  public async getCategoriesByProductId(
    @Param('id') productId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<CategoryDto> | CategoryDto[]> {
    const entities = await this.productService.getCategoriesByProductId(
      productId,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/:id/ratings"
   * route with "GET" method
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found rating entities proxies
   */
  @ApiOperation({
    summary: 'Retrieves all the ratings of a single product'
  })
  @ApiPropertyGetManyDefaultResponse()
  @ApiOkResponse({
    description: 'Gets all the ratings of a single product',
    type: GetManyRatingDtoResponse
  })
  @Get(':id/ratings')
  public async getRatingsByProductId(
    @Param('id') productId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<RatingDto> | RatingDto[]> {
    const entities = await this.productService.getRatingsByProductId(
      productId,
      crudRequest
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/:id/ratings"
   * route with "GET" method
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found rating entities proxies
   */
  @ApiOperation({
    summary: 'Retrieves rating review of a single product'
  })
  @ApiOkResponse({
    description: 'Gets rating review of a single product',
    type: ProductReviewDto
  })
  @Get(':id/review')
  public async getReviewByProductId(
    @Param('id') productId: number
  ): Promise<ProductReviewDto> {
    const entities = await this.productService.getReviewByProductId(productId)
    return entities
  }
}

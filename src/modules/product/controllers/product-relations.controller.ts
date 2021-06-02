import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest,
} from '@nestjsx/crud'

import { ApiPropertyGetManyDefaultResponse } from 'src/decorators/api-property-get-many/api-property-get-many.decorator'

import { RemoveIdSearchPipe } from 'src/pipes/remove-id-search/remove-id-search.pipe'

import { GetManyRatingDtoResponse } from 'src/modules/rating/entities/rating.entity'

import { ProductReviewDto } from '../models/product-review.dto'
import { ProductDto } from '../models/product.dto'
import {
  CategoryDto,
  GetManyCategoryDtoResponse,
} from 'src/modules/category/models/category.dto'
import { RatingDto } from 'src/modules/rating/models/rating.dto'

import { ProductRelationsService } from '../services/product-relations.service'

import { map } from 'src/utils/crud'

/**
 * The app's main products relations controller class
 *
 * Class that deals with the products relations routes
 */
@Crud({
  model: {
    type: ProductDto,
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
      product: {},
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
    ],
  },
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('products')
@Controller('products')
export class ProductRelationsController {
  public constructor(
    private readonly productRelationsService: ProductRelationsService,
  ) {}

  /**
   * Method that is called when the user access the "/products/:id/categories"
   * route with "GET" method
   *
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns all the found category entities proxies
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the categories of a single product',
  })
  @ApiOkResponse({
    description: 'Gets all the categories of a single product',
    type: GetManyCategoryDtoResponse,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Get(':id/categories')
  public async listCategoriesByProductId(
    @Param('id') productId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<CategoryDto> | CategoryDto[]> {
    const entities = await this.productRelationsService.listCategoriesByProductId(
      productId,
      crudRequest,
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/:id/ratings"
   * route with "GET" method
   *
   * @param productId stores the product id
   * @param crudRequest stores the joins, filters, etc
   * @throws {EntityNotFoundException} if the product was not found
   * @returns all the found rating entities proxies
   */
  @ApiPropertyGetManyDefaultResponse()
  @ApiOperation({
    summary: 'Retrieves all the ratings of a single product',
  })
  @ApiOkResponse({
    description: 'Gets all the ratings of a single product',
    type: GetManyRatingDtoResponse,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Get(':id/ratings')
  public async listRatingsByProductId(
    @Param('id') productId: number,
    @ParsedRequest(RemoveIdSearchPipe) crudRequest?: CrudRequest,
  ): Promise<GetManyDefaultResponse<RatingDto> | RatingDto[]> {
    const entities = await this.productRelationsService.listRatingsByProductId(
      productId,
      crudRequest,
    )
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/products/:id/ratings"
   * route with "GET" method
   *
   * @param productId stores the product id
   * @throws {EntityNotFoundException} if the product was not found
   * @returns all the found rating entities proxies
   */
  @ApiOperation({
    summary: 'Retrieves rating review of a single product',
  })
  @ApiOkResponse({
    description: 'Gets rating review of a single product',
    type: ProductReviewDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Get(':id/review')
  public async listReviewByProductId(
    @Param('id') productId: number,
  ): Promise<ProductReviewDto> {
    return await this.productRelationsService.listReviewByProductId(productId)
  }
}
